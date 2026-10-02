# PitBoard website

The download page for PitBoard, served with GitHub Pages at
**https://guyka2212.github.io/pitboard-website/**.

It's a static site (`index.html`, `styles.css`, `main.js`, `assets/`). Every push to `main` deploys
it through `.github/workflows/pages.yml`.

## Downloads

The installers aren't committed. They're assets on the latest
[GitHub release](https://github.com/guyka2212/pitboard-website/releases), and the page links to
them with fixed names, so the links keep working across versions:

| Asset | Source |
|---|---|
| `PitBoard-Setup-Windows.exe` | `windows-software/dist/PitBoard Setup <version>.exe` |
| `PitBoard-Android.apk` | `phone-app/androidApp/build/outputs/apk/…/*.apk` |

## Publishing a new version

Build both apps, copy the files under the names above, then create a release:

```bash
gh release create v1.1.0 PitBoard-Setup-Windows.exe PitBoard-Android.apk --repo guyka2212/pitboard-website --title "PitBoard 1.1.0" --notes "What changed"
```

Then update the version, file sizes and SHA-256 checksums in `index.html` and push.

## Running locally

```bash
npx serve .
```
