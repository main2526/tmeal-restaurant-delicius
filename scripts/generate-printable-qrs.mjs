import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const qrDirectory = resolve("generated-qrs");
const temporaryDirectory = resolve("tmp", "pdfs");
const outputDirectory = resolve("output", "pdf");

await Promise.all([
  mkdir(temporaryDirectory, { recursive: true }),
  mkdir(outputDirectory, { recursive: true }),
]);

const pages = [];

for (let table = 1; table <= 12; table += 1) {
  const svg = await readFile(resolve(qrDirectory, `mesa-${table}.svg`), "utf8");
  pages.push(`
    <section class="page">
      <div class="eyebrow">DELICIAS DE BAVARO</div>
      <h1>MESA ${table}</h1>
      <div class="qr">${svg}</div>
      <h2>Escanea para ver el menu y ordenar</h2>
      <p>Scan to view the menu and order</p>
      <div class="footer">QR exclusivo de esta mesa - No compartir</div>
    </section>`);
}

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Codigos QR por mesa</title>
  <style>
    @page { size: letter portrait; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: white; color: #171717; font-family: Arial, Helvetica, sans-serif; }
    .page { width: 8.5in; height: 11in; padding: 0.7in; display: flex; flex-direction: column; align-items: center; text-align: center; page-break-after: always; overflow: hidden; }
    .page:last-child { page-break-after: auto; }
    .eyebrow { color: #dc2626; font-size: 15pt; font-weight: 900; letter-spacing: 0.18em; margin-top: 0.1in; }
    h1 { margin: 0.18in 0 0.22in; font-size: 54pt; line-height: 1; font-weight: 900; letter-spacing: -0.04em; }
    .qr { width: 5.35in; height: 5.35in; padding: 0.18in; border: 5px solid #171717; border-radius: 0.2in; background: white; }
    .qr svg { display: block; width: 100%; height: 100%; }
    h2 { margin: 0.3in 0 0.08in; font-size: 22pt; line-height: 1.15; }
    p { margin: 0; color: #525252; font-size: 14pt; font-weight: 700; }
    .footer { margin-top: auto; width: 100%; border-top: 2px solid #e5e5e5; padding-top: 0.16in; color: #737373; font-size: 10pt; font-weight: 700; }
  </style>
</head>
<body>${pages.join("")}</body>
</html>`;

const htmlPath = resolve(temporaryDirectory, "codigos-qr-mesas.html");
await writeFile(htmlPath, html, "utf8");
console.log(htmlPath);
