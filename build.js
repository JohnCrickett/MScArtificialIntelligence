const fs = require("fs");
const path = require("path");

const courses = JSON.parse(fs.readFileSync("data/courses.json", "utf8"));
const distDir = path.join(__dirname, "dist");

const SITE_TITLE = "Masters in Artificial Intelligence";
const SITE_DESCRIPTION =
  "A curated directory of MSc Artificial Intelligence degree courses worldwide. Find full-time, part-time, and online AI masters programmes.";
const SITE_URL = "https://mastersartificialintelligence.fyi";

const CATEGORY_ORDER = [
  "Full Time MSc AI (UK)",
  "Full Time MSc AI (Europe)",
  "Full Time MSc AI (USA)",
  "Part Time MSc AI",
  "Distance Learning / Online MSc AI",
];

const CSS = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,sans-serif;line-height:1.6;color:#1a1a2e;background:#fafafa}
a{color:#2d5fce;text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:52rem;margin:0 auto;padding:0 1.5rem}
header{background:#1a1a2e;color:#fff;padding:2.5rem 0}
header h1{margin:0;font-size:1.75rem;font-weight:700;letter-spacing:-0.02em}
header p{margin:0.5rem 0 0;color:#a0a0c0;font-size:0.95rem}
main{padding:2rem 0 4rem}
h2{font-size:1.25rem;margin:2.5rem 0 1rem;padding-bottom:0.4rem;border-bottom:2px solid #e8e8f0;color:#1a1a2e}
h2:first-child{margin-top:0}
.course-list{list-style:none;padding:0;margin:0}
.course-item{padding:0.6rem 0;border-bottom:1px solid #f0f0f5}
.course-item:last-child{border-bottom:none}
.course-uni{font-size:0.85rem;color:#666;margin-left:0.25rem}
.course-notes{font-size:0.8rem;color:#888;margin-left:0.5rem;font-style:italic}
.course-link{font-weight:500}
footer{border-top:1px solid #e8e8f0;padding:2rem 0;text-align:center;font-size:0.85rem;color:#888}
.breadcrumb{font-size:0.85rem;color:#888;margin-bottom:1.5rem}
.breadcrumb a{color:#666}
.detail-header{margin-bottom:1.5rem}
.detail-header h1{font-size:1.5rem;margin:0 0 0.25rem;color:#1a1a2e}
.detail-header .uni{font-size:1.1rem;color:#555;margin:0}
.detail-meta{background:#fff;border:1px solid #e8e8f0;border-radius:0.5rem;padding:1.25rem;margin:1.5rem 0}
.detail-meta dt{font-weight:600;font-size:0.85rem;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-top:1rem}
.detail-meta dt:first-child{margin-top:0}
.detail-meta dd{margin:0.25rem 0 0;font-size:0.95rem}
.visit-btn{display:inline-block;background:#2d5fce;color:#fff;padding:0.7rem 1.5rem;border-radius:0.4rem;font-weight:600;margin-top:1.5rem;font-size:0.95rem}
.visit-btn:hover{background:#244db0;text-decoration:none}
.course-summary{font-size:0.95rem;color:#444;line-height:1.7;margin:0 0 0.5rem}
.back-link{display:inline-block;margin-top:1.5rem;font-size:0.9rem}
.count{font-size:0.85rem;color:#888;font-weight:400;margin-left:0.5rem}
@media(max-width:600px){
  header{padding:1.5rem 0}
  header h1{font-size:1.35rem}
  main{padding:1.5rem 0 3rem}
  h2{font-size:1.1rem}
}
`;

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlPage({ title, description, canonicalPath, body }) {
  const canonical = SITE_URL + canonicalPath;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:type" content="website">
<style>${CSS}</style>
</head>
<body>
<header><div class="container"><h1><a href="/" style="color:inherit;text-decoration:none">${escapeHtml(SITE_TITLE)}</a></h1><p>${escapeHtml(SITE_DESCRIPTION)}</p></div></header>
<main><div class="container">
${body}
</div></main>
<footer><div class="container"><p>Curated by <a href="https://www.linkedin.com/in/johncrickett/">John Crickett</a></p><p>Know a course we're missing or spot something out of date? <a href="https://github.com/JohnCrickett/MScArtificialIntelligence">Contribute on GitHub</a></p></div></footer>
</body>
</html>`;
}

// Group courses by category
const grouped = {};
for (const course of courses) {
  if (!grouped[course.category]) grouped[course.category] = [];
  grouped[course.category].push(course);
}

// Build index page
let indexBody = "";
for (const category of CATEGORY_ORDER) {
  const items = grouped[category];
  if (!items) continue;
  indexBody += `<h2>${escapeHtml(category)}<span class="count">(${items.length})</span></h2>\n<ul class="course-list">\n`;
  for (const c of items) {
    indexBody += `<li class="course-item"><a class="course-link" href="/courses/${escapeHtml(c.slug)}/">${escapeHtml(c.name)}</a><span class="course-uni"> &mdash; ${escapeHtml(c.university)}</span>`;
    if (c.notes)
      indexBody += `<span class="course-notes">${escapeHtml(c.notes)}</span>`;
    indexBody += `</li>\n`;
  }
  indexBody += `</ul>\n`;
}

const indexHtml = htmlPage({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
  body: indexBody,
});

// Write index
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "index.html"), indexHtml);

// Build course pages
for (const c of courses) {
  const courseDir = path.join(distDir, "courses", c.slug);
  fs.mkdirSync(courseDir, { recursive: true });

  let body = `<div class="breadcrumb"><a href="/">All courses</a> &rsaquo; ${escapeHtml(c.category)}</div>`;
  body += `<div class="detail-header"><h1>${escapeHtml(c.name)}</h1><p class="uni">${escapeHtml(c.university)}</p></div>`;
  if (c.summary) body += `<p class="course-summary">${escapeHtml(c.summary)}</p>`;
  body += `<dl class="detail-meta">`;
  body += `<dt>Category</dt><dd>${escapeHtml(c.category)}</dd>`;
  if (c.duration) body += `<dt>Duration</dt><dd>${escapeHtml(c.duration)}</dd>`;
  if (c.fees_domestic || c.fees_international) {
    body += `<dt>Tuition Fees</dt><dd>`;
    if (c.fees_domestic) body += `Home: ${escapeHtml(c.fees_domestic)}`;
    if (c.fees_domestic && c.fees_international) body += `<br>`;
    if (c.fees_international) body += `International: ${escapeHtml(c.fees_international)}`;
    body += `</dd>`;
  }
  if (c.entry_requirements) body += `<dt>Entry Requirements</dt><dd>${escapeHtml(c.entry_requirements)}</dd>`;
  if (c.notes) body += `<dt>Notes</dt><dd>${escapeHtml(c.notes)}</dd>`;
  body += `</dl>`;
  body += `<a class="visit-btn" href="${escapeHtml(c.url)}" target="_blank" rel="noopener">Visit course page &rarr;</a>`;
  body += `<br><a class="back-link" href="/">&larr; Back to all courses</a>`;

  const pageTitle = `${c.name} — ${c.university} | ${SITE_TITLE}`;
  const pageDesc = `${c.name} at ${c.university}. ${c.summary || c.notes || "Find details about this AI masters programme."}`;

  fs.writeFileSync(
    path.join(courseDir, "index.html"),
    htmlPage({
      title: pageTitle,
      description: pageDesc,
      canonicalPath: `/courses/${c.slug}/`,
      body,
    }),
  );
}

console.log(`Built ${courses.length + 1} pages in dist/`);
