import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pdfPath = join(process.cwd(), "output", "pdf", "codigos-qr-mesas.pdf");
const qrDirectory = join(process.cwd(), "generated-qrs");
const tableCount = 12;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const supabase = getSupabaseAdminClient();

  if (!token || !supabase) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return Response.json({ error: "La sesión no es válida." }, { status: 401 });
  }

  const { data: admin, error: adminError } = await supabase
    .from("restaurant_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return Response.json({ error: "Acceso de administrador requerido." }, { status: 403 });
  }

  try {
    const tableParam = new URL(request.url).searchParams.get("mesa");

    if (tableParam !== null) {
      const tableNumber = Number(tableParam);

      if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > tableCount) {
        return Response.json({ error: "La mesa solicitada no es válida." }, { status: 400 });
      }

      const svg = await readFile(join(qrDirectory, `mesa-${tableNumber}.svg`));

      return new Response(svg, {
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Disposition": `inline; filename="qr-mesa-${tableNumber}.svg"`,
          "Content-Length": String(svg.byteLength),
          "Content-Type": "image/svg+xml; charset=utf-8",
        },
      });
    }

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
