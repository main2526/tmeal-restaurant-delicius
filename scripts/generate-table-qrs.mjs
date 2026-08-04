import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHmac } from "node:crypto";

import nextEnv from "@next/env";
import QRCode from "qrcode";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const tableCount = 12;
const restaurantMenuUrl =
  process.env.RESTAURANT_MENU_URL ?? "https://tmeal.vercel.app";
// Signed QRs must never be deployed as predictable public assets.
const outputDirectory = resolve("generated-qrs");
const tableQrSecret = process.env.TABLE_QR_SECRET;

if (!tableQrSecret || tableQrSecret.length < 32) {
  throw new Error("TABLE_QR_SECRET must contain at least 32 characters.");
}

await mkdir(outputDirectory, { recursive: true });

for (let table = 1; table <= tableCount; table += 1) {
  const tableUrl = new URL(restaurantMenuUrl);
  tableUrl.searchParams.set("mesa", String(table));
  const token = createHmac("sha256", tableQrSecret)
    .update(`restaurant-table:${table}`)
    .digest("hex");
  tableUrl.searchParams.set("token", token);

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
