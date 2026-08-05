"use client";

import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  QrCode,
} from "lucide-react";
import { useEffect, useState } from "react";

import { RESTAURANT_CONFIG } from "@/features/restaurant-menu/config/restaurant";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

async function getResponseError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return payload?.error ?? fallback;
}

export function QrManager() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [qrUrls, setQrUrls] = useState<string[]>([]);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrls = new Set<string>();
    let isCancelled = false;

    function createObjectUrl(blob: Blob) {
      const objectUrl = URL.createObjectURL(blob);

      if (isCancelled) {
        URL.revokeObjectURL(objectUrl);
        return null;
      }

      objectUrls.add(objectUrl);
      return objectUrl;
    }

    async function loadQrAssets() {
      const supabase = getSupabaseBrowserClient();
      const { data } = (await supabase?.auth.getSession()) ?? {
        data: { session: null },
      };
      const token = data.session?.access_token;

      if (!token) {
        const sessionError =
          "No se pudo validar la sesión para cargar los códigos QR.";
        setPdfError(sessionError);
        setQrError(sessionError);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const pdfRequest = fetch("/api/admin/table-qrs", { headers })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              await getResponseError(response, "No se pudo cargar el PDF."),
            );
          }

          const objectUrl = createObjectUrl(await response.blob());
          if (objectUrl) setPdfUrl(objectUrl);
        })
        .catch((loadError: unknown) => {
          if (!isCancelled) {
            setPdfError(
              loadError instanceof Error
                ? loadError.message
                : "No se pudo cargar el PDF.",
            );
          }
        });

      const qrRequest = fetch("/api/admin/table-qrs?todos=1", { headers })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              await getResponseError(
                response,
                "No se pudieron cargar los códigos QR.",
              ),
            );
          }

          const payload = (await response.json()) as { codes?: unknown };
          const codes = payload.codes;

          if (
            !Array.isArray(codes) ||
            codes.length !== RESTAURANT_CONFIG.tableCount ||
            !codes.every((code) => typeof code === "string")
          ) {
            throw new Error("La respuesta de códigos QR no es válida.");
          }

          const urls = codes.map((svg) =>
            createObjectUrl(
              new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
            ),
          );

          if (!isCancelled) setQrUrls(urls.filter((url) => url !== null));
        })
        .catch((loadError: unknown) => {
          if (!isCancelled) {
            setQrError(
              loadError instanceof Error
                ? loadError.message
                : "No se pudieron cargar los códigos QR.",
            );
          }
        });

      await Promise.all([pdfRequest, qrRequest]);
    }

    void loadQrAssets();

    return () => {
      isCancelled = true;
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
      objectUrls.clear();
    };
  }, []);

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
          Accesos rápidos
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
          Códigos QR por mesa
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Consulta y descarga cada código por separado, o baja el documento
          completo listo para imprimir.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <FileText size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-neutral-950">Códigos QR de mesas</p>
          <p className="mt-1 text-sm text-neutral-500">
            PDF · {RESTAURANT_CONFIG.tableCount} páginas · listo para impresión
          </p>
        </div>
        {pdfUrl ? (
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
            >
              <ExternalLink size={16} /> Abrir
            </a>
            <a
              href={pdfUrl}
              download="codigos-qr-mesas.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
            >
              <Download size={16} /> Descargar PDF
            </a>
          </div>
        ) : pdfError ? (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 sm:max-w-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={16} />
            <span>
              {pdfError} Los códigos individuales siguen disponibles abajo.
            </span>
          </div>
        ) : (
          <Loader2 className="animate-spin text-neutral-400" size={20} />
        )}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
              Listado individual
            </p>
            <h2 className="mt-1 text-xl font-black text-neutral-950">
              Un QR por mesa
            </h2>
          </div>
          <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-black text-neutral-600">
            {RESTAURANT_CONFIG.tableCount} mesas
          </span>
        </div>

        {qrUrls.length ? (
          <div className="grid grid-cols-1 gap-4">
            {qrUrls.map((qrUrl, index) => {
              const tableNumber = index + 1;

              return (
                <article
                  key={tableNumber}
                  className="flex flex-col items-center gap-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:p-6"
                >
                  <div className="flex w-full items-center justify-center rounded-2xl bg-neutral-50 p-4 sm:w-auto">
                    {/* The authenticated route generates these SVGs on demand. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl}
                      alt={`Código QR de la mesa ${tableNumber}`}
                      className="h-52 w-52 rounded-xl bg-white sm:h-44 sm:w-44"
                    />
                  </div>
                  <div className="w-full min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                      Acceso a la carta
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-neutral-950">
                      Mesa {tableNumber}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      Código único y firmado para identificar los pedidos de esta
                      mesa.
                    </p>
                  </div>
                  <a
                    href={qrUrl}
                    download={`qr-mesa-${tableNumber}.svg`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-red-600 sm:w-auto"
                  >
                    <Download size={17} /> Descargar SVG
                  </a>
                </article>
              );
            })}
          </div>
        ) : !qrError ? (
          <div className="flex min-h-52 items-center justify-center gap-3 rounded-3xl border border-neutral-200 bg-white text-sm font-bold text-neutral-500">
            <Loader2 className="animate-spin" size={20} /> Cargando códigos
            individuales...
          </div>
        ) : (
          <div className="flex min-h-52 items-center justify-center gap-3 rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-sm font-bold text-red-700">
            <AlertCircle className="shrink-0" size={20} /> {qrError}
          </div>
        )}
      </div>

      <div className="mb-6 hidden overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm sm:block">
        {pdfUrl ? (
          <iframe
            title="Vista previa de los códigos QR por mesa"
            src={`${pdfUrl}#page=1&view=FitH`}
            className="h-[70vh] min-h-[520px] w-full bg-white"
          />
        ) : !pdfError ? (
          <div className="flex min-h-80 items-center justify-center gap-3 text-sm font-bold text-neutral-500">
            <Loader2 className="animate-spin" size={20} /> Cargando vista previa...
          </div>
        ) : null}
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <QrCode className="mt-0.5 shrink-0" size={24} />
        <p className="text-sm font-bold">
          Estos códigos contienen accesos firmados de cada mesa. Compártelos solo
          con personal autorizado. Si algún QR se filtra, cambia{" "}
          <code>TABLE_QR_SECRET</code>, vuelve a generarlos y reemplaza los
          impresos.
        </p>
      </div>
    </section>
  );
}
