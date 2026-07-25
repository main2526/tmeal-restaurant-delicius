import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import QRCode from "qrcode";

const tableCount = 12;
const restaurantMenuUrl =
  process.env.RESTAURANT_MENU_URL ?? "https://www.deliciasbavaro.com";
const outputDirectory = resolve("public", "qr");

await mkdir(outputDirectory, { recursive: true });

for (let table = 1; table <= tableCount; table += 1) {
  const tableUrl = new URL(restaurantMenuUrl);
  tableUrl.searchParams.set("mesa", String(table));

  const svg = await QRCode.toString(tableUrl.toString(), {
    type: "svg",
    width: 720,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#171717",
      light: "#ffffff",
    },
  });

  await writeFile(resolve(outputDirectory, `mesa-${table}.svg`), svg, "utf8");
}

console.log(`Generated ${tableCount} table QR codes in ${outputDirectory}.`);
