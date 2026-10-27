#!/usr/bin/env python3
"""Preserve the three published privacy policies during website changes.

Uses only Python's standard library and local files. Source fingerprints come
from commit 90ef7ff5533fb69d2dc2c439037337749514aa38; the original UTILS HTML was
moved byte-for-byte into assets/privacy. Markdown content fingerprints were
captured from an unchanged-source build with Hugo 0.168.0. The UTILS fingerprint
comes directly from its original main element, excluding only the branding
footer, now supplied by the site's shared footer outside the legal article.

This checks preservation, not legal accuracy. A deliberate policy update needs
review of its source, rendered page and corresponding baseline below.
"""

from __future__ import annotations

import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import unicodedata


BASELINE_COMMIT = "90ef7ff5533fb69d2dc2c439037337749514aa38"
POLICIES = (
    {
        "source": "content/privacy-policy.md",
        "url": "/privacy-policy/",
        "source_sha256": "f4fc7d48cee5f94e7fc4b669bbc5ed400bf6c001f9aa6795048fe3ea7338f1d8",
        "main_sha256": "1bbe9cb6408de1f19f9bc33381813beefa28f8743dad158db33793988998c276",
    },
    {
        "source": "content/posts/entradas/privacypolicy.md",
        "url": "/posts/entradas/privacypolicy/",
        "source_sha256": "2cec73488c8a8f9684e395561ff24ba35dc4eb2eeff89c42347ba6439a718f05",
        "main_sha256": "6508e84648989e9b012e34fbe5b1ac6c102fe78110ed5193eb44241c4008c155",
    },
    {
        "source": "assets/privacy/google-analytics-utils-original.html",
        "url": "/google-analytics-utils/privacy-policy/",
        "source_sha256": "8bb5e4a858de7e324d4a5b228d6ca3485dd8a1d8d8d6aae40150e3e9d5133ee4",
        "main_sha256": "f2c860a13d4fbf5c86aaf16499404f26015878c580f20212370926f96a8b567f",
        "source_region": "main_without_branding_footer",
    },
)
BLOCK_TAGS = {
    "article", "blockquote", "br", "dd", "div", "dl", "dt", "h1", "h2",
    "h3", "h4", "h5", "h6", "hr", "li", "ol", "p", "pre", "section",
    "table", "td", "th", "tr", "ul",
}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


class PolicyHTML(HTMLParser):
    """Read main policy text and link destinations, ignoring the site chrome."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.has_html = False
        self.has_refresh = False
        self.main_regions = 0
        self.article_depth = 0
        self.text_parts = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.has_html = True
        if tag == "meta" and (attrs.get("http-equiv") or "").strip().lower() == "refresh":
            self.has_refresh = True
        if tag == "article":
            if self.article_depth:
                self.article_depth += 1
            elif "legacy-prose" in (attrs.get("class") or "").split():
                self.article_depth = 1
                self.main_regions += 1
        if not self.article_depth:
            return
        if tag in BLOCK_TAGS:
            self.text_parts.append(" ")
        if tag == "a":
            self.links.append((attrs.get("href") or "").strip())

    def handle_endtag(self, tag):
        if self.article_depth:
            if tag in BLOCK_TAGS:
                self.text_parts.append(" ")
            if tag == "article":
                self.article_depth -= 1

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data):
        if self.article_depth:
            self.text_parts.append(data)

    def main_digest(self):
        text = unicodedata.normalize("NFC", "".join(self.text_parts))
        normalized = {"text": re.sub(r"\s+", " ", text).strip(), "links": self.links}
        encoded = json.dumps(normalized, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        return sha256(encoded.encode("utf-8"))


def original_utils_digest(data):
    """Derive the legal-content fingerprint from the archived original, not a build.

    Keep its header (product, title, effective date and version), all legal prose
    and both link destinations. Only <footer> contained the old branding line.
    The complete archived HTML, including that footer, still has its source hash.
    """
    html = data.decode("utf-8")
    mains = re.findall(r"<main\b[^>]*>(.*?)</main\s*>", html, flags=re.I | re.S)
    if len(mains) != 1:
        raise ValueError("el HTML original debe contener un único main")
    footers = re.findall(r"<footer\b[^>]*>.*?</footer\s*>", mains[0], flags=re.I | re.S)
    if len(footers) != 1:
        raise ValueError("el HTML original debe contener un único footer de marca")
    fragment = re.sub(r"<footer\b[^>]*>.*?</footer\s*>", "", mains[0], flags=re.I | re.S)
    page = PolicyHTML()
    page.feed('<article class="legacy-prose">' + fragment + '</article>')
    page.close()
    return page.main_digest()


def check_privacy(source_root, public_dir):
    errors = []
    for policy in POLICIES:
        source = source_root / policy["source"]
        try:
            source_data = source.read_bytes()
            source_digest = sha256(source_data)
        except OSError as error:
            errors.append(f"No se puede leer la fuente {policy['source']}: {error}")
        else:
            if source_digest != policy["source_sha256"]:
                errors.append(f"Fuente modificada: {policy['source']}; revisar el cambio de política y su baseline")
            if policy.get("source_region") == "main_without_branding_footer":
                try:
                    original_digest = original_utils_digest(source_data)
                    if original_digest != policy["main_sha256"]:
                        errors.append(f"{policy['source']}: el baseline legal no coincide con el original archivado")
                except (UnicodeError, ValueError) as error:
                    errors.append(f"No se puede extraer la política original de UTILS: {error}")

        output = public_dir / policy["url"].lstrip("/") / "index.html"
        if not output.is_file() or output.is_symlink():
            errors.append(f"Falta HTML físico en {policy['url']} (se requiere {output})")
            continue
        try:
            data = output.read_bytes()
            page = PolicyHTML()
            page.feed(data.decode("utf-8"))
            page.close()
        except (OSError, UnicodeError, ValueError) as error:
            errors.append(f"No se puede analizar {policy['url']}: {error}")
            continue
        if not page.has_html or page.has_refresh:
            errors.append(f"{policy['url']}: debe contener su página HTML, sin alias ni meta-refresh")
        if page.main_regions != 1 or page.article_depth:
            errors.append(f"{policy['url']}: falta un único article.legacy-prose completo con la política")
        elif page.main_digest() != policy["main_sha256"]:
            errors.append(f"{policy['url']}: el texto principal o sus enlaces difieren del original verificado")
    return errors


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=Path(__file__).resolve().parents[1], help="raíz del repositorio; por defecto se deduce de este script")
    parser.add_argument("--public", type=Path, default=Path("public"), help="salida de Hugo, absoluta o relativa a la raíz del repositorio")
    args = parser.parse_args(argv)
    source_root = args.source_root.resolve()
    public_dir = args.public if args.public.is_absolute() else source_root / args.public
    errors = check_privacy(source_root, public_dir.resolve())
    if errors:
        print(f"ERROR: {len(errors)} incidencias de preservación de privacidad.", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1
    print("OK: 3 políticas originales, 3 URLs con HTML físico y contenido íntegro verificados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
