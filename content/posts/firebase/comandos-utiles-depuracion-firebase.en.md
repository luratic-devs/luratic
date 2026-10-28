{
  "title": "Useful commands for debugging and validating analytics on Android",
  "date": "2020-08-19T13:14:34+06:00",
  "description": "Commands historically used by Luratic to debug and validate Firebase Analytics on Android.",
  "draft": true
}

## Android debugging

One way to find an Android package name is to run:

```bash
adb shell pm list packages | grep <expected-package-name>
```

### Enable Firebase DebugView

```bash
adb shell setprop debug.firebase.analytics.app <package>
```

### Disable Firebase DebugView

```bash
adb shell setprop debug.firebase.analytics.app .none.
```

### Enable logs

Google Analytics:

```bash
adb shell setprop log.tag.GAv4-SVC DEBUG
```

Firebase Analytics:

```bash
adb shell setprop log.tag.FA VERBOSE
adb shell setprop log.tag.FA-SVC VERBOSE
```

Google Tag Manager:

```bash
adb shell setprop log.tag.GoogleTagManager VERBOSE
```

### View logs

Firebase only:

```bash
adb logcat -v time -s FA FA-SVC
```

GA and Firebase:

```bash
adb logcat -v time -s FA FA-SVC GAv4 GAv4-SVC
```

GTM-related output:

```bash
adb logcat -v time -s FA FA-SVC GoogleTagManager
```

This is an archived draft from 2020. Commands and product behavior should be verified against current Firebase and Android documentation before use.
