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

## Changing the styles or script

Browsers cache `styles.css` and `main.js`. After changing either one, raise the `?v=` number on its
link in `index.html` (for example `styles.css?v=2` → `styles.css?v=3`) so visitors get the new file.

## Documentation

`docs/index.html` is the user guide, at `/docs/`. Screenshots live in `docs/img/` as WebP. Notes on
a screenshot are plain elements inside its `.shot-frame`, positioned in percent of the image:

```html
<span class="hl" style="--x:10%;--y:20%;--w:30%;--h:15%"></span>   <!-- highlight box -->
<span class="pin" style="--x:40%;--y:20%">1</span>                  <!-- numbered marker -->
<span class="arrow to-r" style="--x:17%;--y:16%"><b><em>1</em><span>Label</span></b></span>
```

`to-r`, `to-l`, `to-t` and `to-b` put the label right, left, above or below the point the arrow
touches; `--len` sets the arrow length. On phones the labels shrink to their number, so every
annotated screenshot also gets a numbered `.legend` list underneath.
