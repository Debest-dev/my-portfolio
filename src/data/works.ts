import manifest from "./works-manifest.json";

export type WorkSection = "Campaign design" | "Compositing" | "Retouching";

export interface WorkImage {
  file: string;
  caption?: string;
}

export interface WorkProject {
  slug: string;
  section: WorkSection;
  title: string;
  summary: string;
  bullets: string[];
  tools: string[];
  cover: string;
  coverPosition?: string;
  coverCrop?: "bottom-half";
  coverFit?: "contain";
  images: WorkImage[];
  layersScreenshot?: string;
  screenRecording?: { src: string; poster: string };
}

export interface ImageVariant {
  src: string;
  width: number;
  height: number;
}

const sizes = manifest as Record<string, { width: number; height: number }>;

export function imageVariants(slug: string, file: string): ImageVariant[] {
  return Object.entries(sizes)
    .filter(([key]) => key.startsWith(`${slug}/${file}-`))
    .map(([key, size]) => ({ src: `/works/${key}`, width: size.width, height: size.height }))
    .sort((a, b) => a.width - b.width);
}

export function imageAlt(project: WorkProject, image: WorkImage): string {
  if (image.caption) return `${project.title} - ${image.caption}`;
  const n = project.images.indexOf(image) + 1;
  return `${project.title} - image ${n} of ${project.images.length}`;
}

const range = (from: number, to: number, caption?: string): WorkImage[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    file: String(from + i).padStart(2, "0"),
    ...(caption ? { caption } : {}),
  }));

const ALPHAX_TOOLS = ["Type Tool", "Rectangle Tool", "Smart Objects", "Clipping Masks", "Camera Raw"];

export const works: WorkProject[] = [
  {
    slug: "tokenfi",
    section: "Campaign design",
    title: "TokenFi",
    summary: "Winning entry in TokenFi's 2-year anniversary infographic contest.",
    bullets: [
      "Condensed TokenFi's product lineup into one infographic",
      "Kept dense information readable on a dark, branded layout",
      "Won the contest, with the announcement tweet as proof",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    coverFit: "contain",
    images: [
      { file: "01" },
      { file: "02", caption: "Contest announcement" },
      { file: "03", caption: "Contest announcement" },
    ],
  },
  {
    slug: "photo-compositing",
    section: "Compositing",
    title: "Photo Compositing",
    summary: "Eight composite pieces built from separate images into one believable result.",
    bullets: [
      "Cut out subjects with clean, editable masks",
      "Blended and colour balanced each scene in Camera Raw",
      "Added shadows and dust so subjects sit naturally",
    ],
    tools: ["Layer Masks", "Select Subject", "Adjustment Layers", "Blend Modes", "Camera Raw"],
    cover: "01",
    coverCrop: "bottom-half",
    images: range(1, 8),
  },
  {
    slug: "portrait-retouching",
    section: "Retouching",
    title: "Portrait Retouching",
    summary:
      "Birthday portrait sessions edited as matched sets, so skin tone and colour stay consistent across every frame.",
    bullets: [
      "Cleaned skin with frequency separation using the Beauty Retouch plugin",
      "Refined skin tone with Gradient Maps, then cleaned up details with the Mixer Brush",
      "Corrected exposure and colour in Camera Raw, then graded each backdrop",
    ],
    tools: [
      "Camera Raw",
      "Healing Brush",
      "Frequency Separation (Beauty Retouch)",
      "Dodge and Burn",
      "Gradient Map",
      "Mixer Brush",
    ],
    cover: "02",
    coverPosition: "center 8%",
    images: [
      { file: "01", caption: "Before / After" },
      { file: "02" },
      ...range(3, 8, "Session 1"),
      ...range(9, 13, "Session 2"),
      ...range(14, 19, "Session 3"),
      ...range(20, 24, "Session 4"),
      ...range(25, 30, "Session 5"),
      { file: "31" },
    ],
  },
  {
    slug: "kedolikswap",
    section: "Campaign design",
    title: "KedolikSwap",
    summary: "Launch and DEX campaign graphics, including the $KEDOL Raydium listing announcement.",
    bullets: [
      "Created a glowing coin focal point with light effects",
      "Reused one visual system across several design variations",
      "Included a mascot-led post for community engagement",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    coverFit: "contain",
    images: range(1, 9),
  },
  {
    slug: "sqwad",
    section: "Campaign design",
    title: "SQWAD",
    summary: "Web3 campaign and presale graphics with a clean, high-tech look.",
    bullets: [
      "Designed a presale flyer series and product launch visuals",
      "Combined glowing 3D elements and the SQWAD mark into each layout",
      "Kept messaging readable on dark, detailed backgrounds",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    images: range(1, 7),
  },
  {
    slug: "alphax",
    section: "Campaign design",
    title: "AlphaX",
    summary: "A purple fintech social campaign built as one consistent system.",
    bullets: [
      "Set one colour palette, layout grid, and type style",
      "Built layouts with the Type and Rectangle tools, with phone mockups placed as Smart Objects",
      "Finished each post with a colour grade in Camera Raw",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    coverFit: "contain",
    images: range(1, 6),
  },
  {
    slug: "church-photography",
    section: "Retouching",
    title: "Church Photography",
    summary: "Event photography edited for the church's media, with a consistent look across 26 frames.",
    bullets: [
      "Adjusted each shot individually for mixed stage lighting",
      "Controlled highlights, curves, and colour balance in Camera Raw",
      "Created black and white edits by reducing saturation, adding a vignette in the Effects tab, and deepening the blacks for strong contrast",
      "Used Iris Blur from the Blur Gallery to soften the background and keep focus on the subject",
      "Added a branded overlay for publishing",
    ],
    tools: [
      "Camera Raw",
      "Blur Gallery (Iris Blur)",
      "Highlights",
      "Curves",
      "Color Balance",
      "Saturation",
      "Blacks",
      "Vignette",
    ],
    cover: "01",
    images: range(1, 26),
  },
  {
    slug: "medigo",
    section: "Campaign design",
    title: "MediGo",
    summary: "Health-app social graphics with a friendly, illustrated tone.",
    bullets: [
      "Built a soft purple identity around illustrated characters",
      "Kept a repeating layout for easy daily posting",
      "Finished each post with a colour grade in Camera Raw",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    images: range(1, 5),
  },
  {
    slug: "peec-graphics",
    section: "Campaign design",
    title: "PEEC Graphics",
    summary: "Announcement and cover graphics for Professor Enefiok Essien Chambers.",
    bullets: [
      "Built a congratulations graphic featuring associate portraits in a tidy grid",
      "Matched the Chambers' purple branding",
      "Designed a cover page for a published guide",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    coverFit: "contain",
    images: range(1, 2),
  },
  {
    slug: "church-posters",
    section: "Campaign design",
    title: "Church Posters",
    summary: "Event and monthly graphics for Dunamis Mbak Itam III.",
    bullets: [
      "Edited each photo separately, then placed it into the design",
      "Built layouts for conventions, services, and ministry events",
      "Applied a final colour grade in Camera Raw for a consistent look",
    ],
    tools: ALPHAX_TOOLS,
    cover: "01",
    coverFit: "contain",
    images: range(1, 5),
  },
  {
    slug: "birthday-posters",
    section: "Compositing",
    title: "Birthday Posters",
    summary: "Celebration posters that combine portrait editing and decorative design.",
    bullets: [
      "Edited and blended portraits into a styled layout",
      "Added floral and light effects around the subjects",
      "Matched colours and type to each celebrant's theme",
    ],
    tools: ["Type Tool", "Smart Objects", "Clipping Masks", "Camera Raw", "Layer Masks"],
    cover: "01",
    coverFit: "contain",
    images: range(1, 2),
  },
  {
    slug: "social-and-event-graphics",
    section: "Campaign design",
    title: "Social and Event Graphics",
    summary: "Event flyers, a YouTube thumbnail, and social posts across tech and Web3.",
    bullets: [
      "Worked across several brand styles, from crypto to community events",
      "Produced hiring posts, campaign visuals, and thumbnails",
      "Adapted layouts for different platforms",
    ],
    tools: ALPHAX_TOOLS,
    cover: "02",
    images: range(1, 15),
  },
];