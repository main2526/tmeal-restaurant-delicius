import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { isValidRestaurantTable } from "@/features/restaurant-menu/config/restaurant";

function getTableQrSecret() {
  return process.env.TABLE_QR_SECRET;
}

export function createTableAccessToken(table: string): string {
  const secret = getTableQrSecret();

  if (!secret || secret.length < 32) {
    throw new Error("TABLE_QR_SECRET must contain at least 32 characters.");
  }

  if (!isValidRestaurantTable(table)) {
    throw new Error(`Cannot create a token for invalid table ${table}.`);
  }

  return createHmac("sha256", secret).update(`restaurant-table:${table}`).digest("hex");
}

export function isValidTableAccess(table: string, token: string): boolean {
  if (!isValidRestaurantTable(table) || !/^[a-f0-9]{64}$/.test(token)) {
    return false;
  }

  try {
    const expected = Buffer.from(createTableAccessToken(table), "hex");
    const received = Buffer.from(token, "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}
