import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "My works");
const OUT = path.join(ROOT, "public", "works");
const MANIFEST = path.join(ROOT, "src", "data", "works-manifest.json");
const SIZE_LIMIT = 60 * 1024 * 1024;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const CONFIG = [
  { slug: "tokenfi", dirs: ["Graphic Designs/TokenFi"], first: ["tokenfi.jpg"] },
  {
    slug: "photo-compositing",
    dirs: ["Image Composition"],
    first: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "AI-AND-LAW.jpg"],
  },
  {
    slug: "portrait-retouching",
    dirs: ["Studio Pictures"],
    first: ["Retouch Before and After.jpg", "Clean Retouch.png"],
    sessions: ["Adekunle", "Big joe", "Kiitan", "Odetola", "Whitney"],
  },
  { slug: "kedolikswap", dirs: ["Graphic Designs/Kedolikswap"] },
  { slug: "sqwad", dirs: ["Graphic Designs/SQWAD"] },
  { slug: "alphax", dirs: ["Graphic Designs/AlphaX"], first: ["AlphaX Designs.jpg"] },
  { slug: "church-photography", dirs: ["Church Photography"] },
  { slug: "medigo", dirs: ["Graphic Designs/MediGo"] },
  { slug: "peec-graphics", dirs: ["Graphic Designs/PEEC"] },
  { slug: "church-posters", dirs: ["Graphic Designs/Church Poster"] },
  { slug: "birthday-posters", dirs: ["Graphic Designs/Birthday Posters"] },
  {
    slug: "social-and-event-graphics",
    dirs: ["Graphic Designs/Others"],
    exclude: ["BNB INU DESIGN 3.png"],
  },
];

function listFiles(dirs) {
  const files = [];
  for (const dir of dirs) {
    const full = path.join(SRC, dir);
    if (!fs.existsSync(full)) {
      console.log(`MISSING FOLDER: ${dir}`);
      continue;
    }
    for (const name of fs.readdirSync(full)) {
      const p = path.join(full, name);
      if (fs.statSync(p).isFile() && /\.(jpe?g|png|webp)$/i.test(name)) files.push({ name, path: p });
    }
  }
  return files.sort((a, b) => byName(a.name, b.name));
}

function orderFiles(cfg, files) {
  const used = new Set();
  const ordered = [];
  const take = (match) => {
    const hit = files.find((f) => !used.has(f.name) && match(f));
    if (hit) {
      used.add(hit.name);
      ordered.push(hit);
    }
    return hit;
  };
  for (const name of cfg.first ?? []) {
    if (!take((f) => norm(f.name) === norm(name))) console.log(`MISSING FIRST FILE: ${cfg.slug} / ${name}`);
  }
  for (const session of cfg.sessions ?? []) {
    const key = norm(session);
    take((f) => norm(f.name).startsWith(key + "birthdayportraits"));
    const singles = files.filter((f) => !used.has(f.name) && norm(f.name).startsWith(key));
    for (const f of singles) {
      used.add(f.name);
      ordered.push(f);
    }
  }
  const excluded = new Set((cfg.exclude ?? []).map(norm));
  for (const f of files) {
    if (!used.has(f.name) && !excluded.has(norm(f.name))) ordered.push(f);
  }
  return ordered;
}

function dirSize(dir) {
  let total = 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    total += fs.statSync(p).isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

async function run(widths, quality) {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  let count = 0;
  for (const cfg of CONFIG) {
    const ordered = orderFiles(cfg, listFiles(cfg.dirs));
    fs.mkdirSync(path.join(OUT, cfg.slug), { recursive: true });
    for (let i = 0; i < ordered.length; i++) {
      const nn = String(i + 1).padStart(2, "0");
      for (const width of widths) {
        const outName = `${nn}-${width}.webp`;
        const info = await sharp(ordered[i].path)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality })
          .toFile(path.join(OUT, cfg.slug, outName));
        manifest[`${cfg.slug}/${outName}`] = { width: info.width, height: info.height };
      }
      console.log(`${cfg.slug}/${nn} <= ${ordered[i].name}`);
      count++;
    }
    console.log(`COUNT ${cfg.slug}: ${ordered.length}`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  const bytes = dirSize(OUT);
  console.log(`IMAGES: ${count}, OUTPUTS: ${Object.keys(manifest).length}, SIZE: ${(bytes / 1024 / 1024).toFixed(1)} MB (quality ${quality}, widths ${widths.join("/")})`);
  return bytes;
}

let bytes = await run([800, 1600], 80);
if (bytes > SIZE_LIMIT) {
  console.log("Over 60 MB - rerunning at quality 75 and 1400px");
  bytes = await run([800, 1400], 75);
}