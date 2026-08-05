"use client";

import { Download, ExternalLink, FileText, Loader2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const tableCount = 12;

export function QrManager() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [qrUrls, setQrUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrls: string[] = [];
    let isCancelled = false;

    async function loadQrAssets() {
      const supabase = getSupabaseBrowserClient();
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
      const token = data.session?.access_token;

      if (!token) {
        setError("No se pudo validar la sesión para cargar los códigos QR.");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [pdfResponse, ...qrResponses] = await Promise.all([
          fetch("/api/admin/table-qrs", { headers }),
          ...Array.from({ length: tableCount }, (_, index) =>
            fetch(`/api/admin/table-qrs?mesa=${index + 1}`, { headers }),
          ),
        ]);

        const failedResponse = [pdfResponse, ...qrResponses].find((response) => !response.ok);
        if (failedResponse) {
          const payload = (await failedResponse.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "No se pudieron cargar los códigos QR.");
        }

        const pdfObjectUrl = URL.createObjectURL(await pdfResponse.blob());
        const qrObjectUrls = await Promise.all(
          qrResponses.map(async (response) => URL.createObjectURL(await response.blob())),
        );
        objectUrls.push(pdfObjectUrl, ...qrObjectUrls);

        if (!isCancelled) {
          setPdfUrl(pdfObjectUrl);
          setQrUrls(qrObjectUrls);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los códigos QR.");
        }
      }
    }

    void loadQrAssets();

    return () => {
      isCancelled = true;
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, []);

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Accesos rápidos</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Códigos QR por mesa</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">Consulta y descarga cada código por separado, o baja el documento completo listo para imprimir.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <FileText size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-neutral-950">Códigos QR de mesas</p>
          <p className="mt-1 text-sm text-neutral-500">PDF · 12 páginas · listo para impresión</p>
        </div>
        {pdfUrl ? (
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50">
              <ExternalLink size={16} /> Abrir
            </a>
            <a href={pdfUrl} download="codigos-qr-mesas.pdf" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700">
              <Download size={16} /> Descargar PDF
            </a>
          </div>
        ) : null}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">Listado individual</p>
            <h2 className="mt-1 text-xl font-black text-neutral-950">Un QR por mesa</h2>
          </div>
          <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-black text-neutral-600">12 mesas</span>
        </div>

        {qrUrls.length ? (
          <div className="grid grid-cols-1 gap-4">
            {qrUrls.map((qrUrl, index) => {
              const tableNumber = index + 1;

              return (
                <article key={tableNumber} className="flex flex-col items-center gap-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:p-6">
                  <div className="flex w-full items-center justify-center rounded-2xl bg-neutral-50 p-4 sm:w-auto">
                    {/* SVGs are generated locally and served only through the authenticated admin route. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt={`Código QR de la mesa ${tableNumber}`} className="h-52 w-52 rounded-xl bg-white sm:h-44 sm:w-44" />
                  </div>
                  <div className="w-full min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Acceso a la carta</p>
                    <h3 className="mt-1 text-2xl font-black text-neutral-950">Mesa {tableNumber}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Código único y firmado para identificar los pedidos de esta mesa.</p>
                  </div>
                  <a href={qrUrl} download={`qr-mesa-${tableNumber}.svg`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-red-600 sm:w-auto">
                    <Download size={17} /> Descargar SVG
                  </a>
                </article>
              );
            })}
          </div>
        ) : !error ? (
          <div className="flex min-h-52 items-center justify-center gap-3 rounded-3xl border border-neutral-200 bg-white text-sm font-bold text-neutral-500">
            <Loader2 className="animate-spin" size={20} /> Cargando códigos individuales...
          </div>
        ) : null}
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
        {error ? (
          <div className="flex min-h-80 items-center justify-center p-8 text-center text-sm font-bold text-red-700">{error}</div>
        ) : pdfUrl ? (
          <>
            <iframe title="Vista previa móvil de los códigos QR por mesa" src={`${pdfUrl}#page=1&view=Fit`} className="h-[72svh] min-h-[460px] w-full bg-white sm:hidden" />
            <iframe title="Vista previa de los códigos QR por mesa" src={`${pdfUrl}#page=1&view=FitH`} className="hidden h-[70vh] min-h-[520px] w-full bg-white sm:block" />
          </>
        ) : (
          <div className="flex min-h-80 items-center justify-center gap-3 text-sm font-bold text-neutral-500">
            <Loader2 className="animate-spin" size={20} /> Cargando vista previa...
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <QrCode className="mt-0.5 shrink-0" size={24} />
        <p className="text-sm font-bold">Estos códigos contienen accesos firmados de cada mesa. Compártelos solo con personal autorizado. Si algún QR se filtra, cambia <code>TABLE_QR_SECRET</code>, vuelve a generarlos y reemplaza los impresos.</p>
      </div>
    </section>
  );
}
