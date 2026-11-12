# Blessed Anthony Etim — Portfolio

A clean, simple, professional portfolio for Blessed Anthony Etim (Debest Creative), Graphic Designer & Adobe Photoshop Specialist.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 📸 Photos

Web-ready images live in `public/images/`:

- `nav-logo.webp` (128×128): circular logo in the sticky navigation.
- `profile.webp`: transparent cutout portrait in the Hero.
- `about.webp`: photo in the About card.

Full-size originals are kept in `public/images/originals/`, which is excluded via `.gitignore` and `.vercelignore`.

---

## 💼 Featured Work

Projects are defined in `src/data/works.ts`. Optimised images live in `public/works/<slug>/`
(`NN-800.webp` and `NN-1600.webp`), with dimensions in `src/data/works-manifest.json`.
Both `public/works/` and the manifest are committed; the build never needs the source folder.

### Adding images (run optimize:works)

1. Put the original JPG/PNG files into the matching folder under `My works/` (never edited by the site or the build).
2. Run:
   ```bash
   npm run optimize:works
   ```
   This regenerates `public/works/` and `src/data/works-manifest.json` (WebP, quality 80, 800px and 1600px wide). If the output exceeds 60 MB it automatically reruns at quality 75 / 1400px.
3. Add the new image numbers to the project's `images` array in `src/data/works.ts` (captions optional).
4. Commit `public/works/` and `src/data/works-manifest.json`.

### Adding process proof to a project

In `src/data/works.ts`, set either field on the project (both are optional and render only when present):

```ts
layersScreenshot: "/works/tokenfi/layers-panel.webp",
screenRecording: {
  src: "/works/tokenfi/process.mp4",
  poster: "/works/tokenfi/process-poster.webp",
},
```

Place the files in `public/works/<slug>/` yourself (the optimizer only processes `My works/`).
The Layers screenshot is shown with the caption "Layers panel"; the recording uses native
video controls with `preload="metadata"` and the poster image.

### Before / after slider

A slider is only built when separate before and after files exist. The current source
("Retouch Before and After.jpg") is a single combined image, so it is shown as is.

---

## 📄 CV File Notice

**IMPORTANT:** Before launch, please replace `public/cv.pdf` with your actual CV document.
The current file is a lightweight placeholder. The "Download CV" button in the Experience section automatically links to `/cv.pdf`.

---

## 🚀 Running Locally & Deploying

### Run Locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Build for Production:
```bash
npm run build
```

### Deploy to Vercel:
Push this repository to GitHub and import it on Vercel. Standard Next.js defaults apply.
