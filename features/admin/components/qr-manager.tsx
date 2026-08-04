"use client";

import { Download, ExternalLink, FileText, Loader2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function QrManager() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isCancelled = false;

    async function loadPdf() {
      const supabase = getSupabaseBrowserClient();
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
      const token = data.session?.access_token;

      if (!token) {
        setError("No se pudo validar la sesión para cargar el PDF.");
        return;
      }

      try {
        const response = await fetch("/api/admin/table-qrs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "No se pudo cargar el PDF.");
        }

        objectUrl = URL.createObjectURL(await response.blob());
        if (!isCancelled) setPdfUrl(objectUrl);
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el PDF.");
        }
      }
    }

    void loadPdf();

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Accesos rápidos</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Códigos QR por mesa</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">Previsualiza el documento con los 12 códigos QR y descárgalo listo para imprimir.</p>
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

      <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
        {error ? (
          <div className="flex min-h-80 items-center justify-center p-8 text-center text-sm font-bold text-red-700">{error}</div>
        ) : pdfUrl ? (
          <>
            <iframe
              title="Vista previa móvil de los códigos QR por mesa"
              src={`${pdfUrl}#page=1&view=Fit`}
              className="h-[72svh] min-h-[460px] w-full bg-white sm:hidden"
            />
            <iframe
              title="Vista previa de los códigos QR por mesa"
              src={`${pdfUrl}#page=1&view=FitH`}
              className="hidden h-[70vh] min-h-[520px] w-full bg-white sm:block"
            />
          </>
        ) : (
          <div className="flex min-h-80 items-center justify-center gap-3 text-sm font-bold text-neutral-500">
            <Loader2 className="animate-spin" size={20} /> Cargando vista previa...
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <QrCode className="mt-0.5 shrink-0" size={24} />
        <p className="text-sm font-bold">Este documento contiene accesos firmados de cada mesa. Compártelo solo con personal autorizado. Si algún QR se filtra, cambia <code>TABLE_QR_SECRET</code>, vuelve a generarlos y reemplaza los impresos.</p>
      </div>
    </section>
  );
}
