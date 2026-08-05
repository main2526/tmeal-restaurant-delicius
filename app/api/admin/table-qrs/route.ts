import { readFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";

import { RESTAURANT_CONFIG } from "@/features/restaurant-menu/config/restaurant";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createTableAccessToken } from "@/lib/table-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pdfPath = join(
  process.cwd(),
  "output",
  "pdf",
  "codigos-qr-mesas.pdf",
);

function createTableUrl(request: Request, tableNumber: number) {
  const menuUrl = new URL(
    process.env.RESTAURANT_MENU_URL ?? new URL(request.url).origin,
  );
  const table = String(tableNumber);

  menuUrl.searchParams.set("mesa", table);
  menuUrl.searchParams.set("token", createTableAccessToken(table));

  return menuUrl;
}

function generateTableQr(request: Request, tableNumber: number) {
  return QRCode.toString(createTableUrl(request, tableNumber).toString(), {
    type: "svg",
    width: 720,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#171717",
      light: "#ffffff",
    },
  });
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const supabase = getSupabaseAdminClient();

  if (!token || !supabase) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return Response.json(
      { error: "La sesión no es válida." },
      { status: 401 },
    );
  }

  const { data: admin, error: adminError } = await supabase
    .from("restaurant_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return Response.json(
      { error: "Acceso de administrador requerido." },
      { status: 403 },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const tableParam = searchParams.get("mesa");

  if (searchParams.get("todos") === "1") {
    try {
      const codes = await Promise.all(
        Array.from(
          { length: RESTAURANT_CONFIG.tableCount },
          (_, index) => generateTableQr(request, index + 1),
        ),
      );

      return Response.json(
        { codes },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    } catch {
      return Response.json(
        { error: "No se pudieron generar los códigos QR de las mesas." },
        { status: 500 },
      );
    }
  }

  if (tableParam !== null) {
    const tableNumber = Number(tableParam);

    if (
      !Number.isInteger(tableNumber) ||
      tableNumber < 1 ||
      tableNumber > RESTAURANT_CONFIG.tableCount
    ) {
      return Response.json(
        { error: "La mesa solicitada no es válida." },
        { status: 400 },
      );
    }

    try {
      const svg = await generateTableQr(request, tableNumber);

      return new Response(svg, {
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Disposition": `inline; filename="qr-mesa-${tableNumber}.svg"`,
          "Content-Length": String(Buffer.byteLength(svg)),
          "Content-Type": "image/svg+xml; charset=utf-8",
        },
      });
    } catch {
      return Response.json(
        { error: `No se pudo generar el código QR de la mesa ${tableNumber}.` },
        { status: 500 },
      );
    }
  }

  try {
    const pdf = await readFile(pdfPath);

    return new Response(pdf, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'inline; filename="codigos-qr-mesas.pdf"',
        "Content-Length": String(pdf.byteLength),
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return Response.json(
      { error: "El PDF de códigos QR no está disponible." },
      { status: 404 },
    );
  }
}
