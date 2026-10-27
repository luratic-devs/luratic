#!/usr/bin/env python3
"""Check a generated Hugo site without dependencies or network requests.

Run from the repository root:
    python3 scripts/check_site.py --public public --check-legacy

The legacy URL snapshot was derived from main at
90ef7ff5533fb69d2dc2c439037337749514aa38. It intentionally does not depend
on the current content tree: deleting a source file must not erase a check.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from html.parser import HTMLParser
import json
from pathlib import Path
import posixpath
import re
import sys
from urllib.parse import unquote, urljoin, urlsplit


LEGACY_TAGS = (
    "adsmurai-visual-commerce", "fitanalytics-fit-finder", "adgravity",
    "adyoulike", "affocean", "amazon", "belboon-container-tags",
    "belboon-performance", "bluekay-oracle-dmp", "clarity",
    "contentsquare-artificial-pageview", "e-goi", "equalweb", "hubspot",
    "jsdelivr", "kakao", "landbot-main-library", "ligatus",
    "linkedin-conversion", "lucky-orange", "mailerlite", "monetate",
    "outbrain-enhanced", "pipedrive-leadbooster-chatbot", "pushnews",
    "salesforce-audience-studio", "salesforce-event-tracker", "sealmetrics",
    "snapchat", "studyportals", "teads", "tiktok", "weborama",
)
LEGACY_VARIABLES = (
    "apps-referrer", "decode-from-base64", "document-character-set",
    "document-title", "encode-to-base64", "ga4-ecommerce-no-persistence",
    "join-strings", "timestamp",
)
LEGACY_PATHS = tuple(
    f"/{language}posts/templates/{kind}/{slug}/"
    for language in ("", "es/")
    for kind, slugs in (("tags", LEGACY_TAGS), ("variables", LEGACY_VARIABLES))
    for slug in slugs
) + (
    "/privacy-policy/",
    "/posts/entradas/privacypolicy/",
)
LOCAL_ORIGIN = "https://site-check.invalid"


@dataclass(frozen=True)
class Reference:
    line: int
    attribute: str
    url: str


def srcset_urls(value: str):
    """Extract srcset candidates, retaining commas inside data URLs."""
    position = 0
    while position < len(value):
        while position < len(value) and (value[position].isspace() or value[position] == ","):
            position += 1
        start = position
        while position < len(value) and not value[position].isspace():
            position += 1
        token = value[start:position]
        if not token:
            break
        yield token.rstrip(",")
        if token.endswith(","):
            continue
        # Width / density descriptors are not part of the URL.
        while position < len(value) and value[position] != ",":
            position += 1


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references: list[Reference] = []
        self.title_parts: list[str] = []
        self.title_seen = False
        self.in_title = False
        self.base_href: str | None = None
        self.redirect = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "title":
            self.title_seen = True
            self.in_title = True
        if tag == "base":
            if self.base_href is None:
                self.base_href = attributes.get("href")
            return
        if tag == "meta" and (attributes.get("http-equiv") or "").lower() == "refresh":
            self.redirect = True
            refresh = attributes.get("content") or ""
            target = re.search(r"(?:^|;)\s*url\s*=\s*(.+)$", refresh, re.IGNORECASE)
            if target:
                self.references.append(
                    Reference(self.getpos()[0], "refresh", target.group(1).strip(" \t\"'"))
                )
        for attribute in ("href", "src", "poster", "xlink:href"):
            value = attributes.get(attribute)
            if value:
                self.references.append(Reference(self.getpos()[0], attribute, value))
        if attributes.get("srcset"):
            for value in srcset_urls(attributes["srcset"]):
                self.references.append(Reference(self.getpos()[0], "srcset", value))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)


def page_url(relative_path: Path) -> str:
    name = relative_path.as_posix()
    if relative_path.name.lower() in ("index.html", "index.htm"):
        name = name.rsplit("/", 1)[0] + "/" if "/" in name else ""
    return LOCAL_ORIGIN + "/" + name


def local_path(url: str, base: str, local_hosts: set[str]) -> str | None:
    value = url.strip()
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(urljoin(base, value))
    if parsed.scheme not in ("http", "https") or parsed.netloc.lower() not in local_hosts:
        return None
    path = unquote(parsed.path or "/", encoding="utf-8", errors="strict")
    # Normalization also handles encoded spaces, Unicode and dot segments.
    return "/" + posixpath.normpath("/" + path.lstrip("/")).lstrip("/")


def read_redirects(public_dir: Path):
    """Read unconditional Netlify redirects; never let SPA rewrites hide 404s."""
    redirect_file = public_dir / "_redirects"
    if not redirect_file.is_file():
        return []
    rules = []
    for line in redirect_file.read_text(encoding="utf-8").splitlines():
        fields = line.strip().split()
        for index, field in enumerate(fields):
            if field.startswith("#"):
                fields = fields[:index]
                break
        if len(fields) not in (2, 3):
            continue  # Conditional rules cannot guarantee an available URL.
        source, destination = fields[:2]
        status = fields[2].rstrip("!") if len(fields) == 3 else "301"
        if source.startswith("/") and status.isdigit() and 300 <= int(status) < 400:
            rules.append((source, destination))
    return rules


def target_exists(public_dir: Path, path: str, redirects=(), local_hosts=None, visited=None) -> bool:
    target = public_dir / path.lstrip("/")
    try:
        target.resolve().relative_to(public_dir)
    except ValueError:
        return False
    if target.is_file() or (
        target.is_dir()
        and any((target / name).is_file() for name in ("index.html", "index.htm"))
    ):
        return True
    visited = set() if visited is None else visited
    if path in visited or len(visited) >= 10:
        return False
    visited.add(path)
    local_hosts = local_hosts or {urlsplit(LOCAL_ORIGIN).netloc}
    for source, destination in redirects:
        if source.endswith("*") and path.startswith(source[:-1]):
            destination = destination.replace(":splat", path[len(source) - 1:])
        elif source.rstrip("/") != path.rstrip("/"):
            continue
        try:
            redirected = local_path(destination, LOCAL_ORIGIN + "/", local_hosts)
            if redirected is None:
                # External redirects are accepted but not fetched.
                return urlsplit(destination).scheme in ("http", "https")
            return target_exists(public_dir, redirected, redirects, local_hosts, visited)
        except (ValueError, UnicodeError):
            return False
    return False


def load_manifest(path: Path) -> list[str]:
    content = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(content, dict):
        content = content.get("paths")
    if not isinstance(content, list) or not all(isinstance(item, str) for item in content):
        raise ValueError("el manifiesto debe ser una lista JSON o un objeto con 'paths': [...]")
    for item in content:
        parsed = urlsplit(item)
        if not item.startswith("/") or parsed.scheme or parsed.netloc:
            raise ValueError(f"ruta del manifiesto no válida: {item!r}; debe empezar por /")
    return content


def check_site(public_dir: Path, legacy_paths=(), site_urls=()):
    public_dir = public_dir.resolve()
    errors: list[str] = []
    local_hosts = {urlsplit(LOCAL_ORIGIN).netloc}
    for url in site_urls:
        parsed = urlsplit(url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise ValueError(f"--site-url no válido: {url!r}")
        local_hosts.add(parsed.netloc.lower())
    if not public_dir.is_dir():
        return [f"No existe el directorio generado: {public_dir}"], 0, 0
    pages = sorted(p for p in public_dir.rglob("*") if p.is_file() and p.suffix.lower() in (".html", ".htm"))
    if not pages:
        return [f"No hay páginas HTML en {public_dir}"], 0, 0
    redirects = read_redirects(public_dir)
    references_checked = 0
    for page in pages:
        relative = page.relative_to(public_dir)
        name = relative.as_posix()
        if re.match(r"^(?:es/|en/)?posts/firebase(?:/|\.html$)", name):
            errors.append(f"{name}: se ha publicado contenido de Firebase marcado como borrador en el origen")
        parser = PageParser()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
            parser.close()
        except (OSError, UnicodeError, ValueError) as error:
            errors.append(f"{name}: no se pudo analizar el HTML: {error}")
            continue
        title = "".join(parser.title_parts).strip()
        # Hugo's generated alias redirects may legitimately omit a title.
        if not title and (parser.title_seen or not parser.redirect):
            errors.append(f"{name}: <title> vacío o ausente")
        base = page_url(relative)
        if parser.base_href:
            base = urljoin(base, parser.base_href)
        seen = set()
        for reference in parser.references:
            try:
                path = local_path(reference.url, base, local_hosts)
            except (ValueError, UnicodeError) as error:
                errors.append(f"{name}:{reference.line}: URL no válida en {reference.attribute}: {reference.url!r} ({error})")
                continue
            if path is None or path in seen:
                continue
            seen.add(path)
            references_checked += 1
            if not target_exists(public_dir, path, redirects, local_hosts):
                errors.append(f"{name}:{reference.line}: falta {path} ({reference.attribute}={reference.url!r})")
    for url in sorted(set(legacy_paths)):
        path = local_path(url, LOCAL_ORIGIN + "/", local_hosts)
        if path is None or not target_exists(public_dir, path, redirects, local_hosts):
            errors.append(f"Ruta histórica ausente: {url}")
    return errors, len(pages), references_checked


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--public", type=Path, default=Path("public"), help="directorio generado (por defecto: public)")
    parser.add_argument("--check-legacy", action="store_true", help="comprobar las 82 fichas históricas y las 2 rutas de privacidad")
    parser.add_argument("--legacy-manifest", type=Path, help="lista JSON adicional de rutas históricas o {'paths': [...]}")
    parser.add_argument("--site-url", action="append", default=[], help="tratar también este origen HTTP(S) como local; se puede repetir")
    parser.add_argument("--max-errors", type=int, default=60, help="máximo de errores mostrados (por defecto: 60)")
    args = parser.parse_args(argv)
    if args.max_errors < 1:
        parser.error("--max-errors debe ser mayor que cero")
    legacy = list(LEGACY_PATHS) if args.check_legacy else []
    try:
        if args.legacy_manifest:
            legacy.extend(load_manifest(args.legacy_manifest))
        errors, page_count, reference_count = check_site(args.public, legacy, args.site_url)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    if errors:
        print(f"ERROR: {len(errors)} incidencias en {page_count} páginas y {reference_count} referencias locales.", file=sys.stderr)
        for error in errors[:args.max_errors]:
            print(f"  - {error}", file=sys.stderr)
        if len(errors) > args.max_errors:
            print(f"  ... {len(errors) - args.max_errors} incidencias más; amplía --max-errors para verlas.", file=sys.stderr)
        return 1
    print(f"OK: {page_count} páginas, {reference_count} referencias locales y {len(set(legacy))} rutas históricas comprobadas.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
