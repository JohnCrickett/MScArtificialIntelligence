const fs = require('fs');

const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));

const CATEGORY_ORDER = [
  'Full Time MSc AI (UK)',
  'Full Time MSc AI (Europe)',
  'Full Time MSc AI (USA)',
  'Part Time MSc AI',
  'Distance Learning / Online MSc AI'
];

const grouped = {};
for (const course of courses) {
  if (!grouped[course.category]) grouped[course.category] = [];
  grouped[course.category].push(course);
}

let md = `![image](img/ai-msc-degrees.jpg)

<div align="center">
<p align="center">by John Crickett</p>
</div>

# MSc Artificial Intelligence Degree Courses

A curated directory of MSc Artificial Intelligence degree courses worldwide.

Website: [mastersartificialintelligence.fyi](https://mastersartificialintelligence.fyi)

`;

for (const category of CATEGORY_ORDER) {
  const items = grouped[category];
  if (!items) continue;
  md += `## ${category}\n\n`;
  for (const c of items) {
    let line = `* [${c.university} ${c.name}](${c.url})`;
    if (c.notes) line += ` — ${c.notes}`;
    md += line + '\n';
  }
  md += '\n';
}

md += `## Contributing

Know a course we're missing or spot something out of date? See [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on editing the site, building locally, and submitting a pull request.\n`;

fs.writeFileSync('README.md', md);
console.log(`Generated README.md with ${courses.length} courses`);
