"use client";

import { QrCode } from "lucide-react";

export function QrManager() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Accesos rápidos</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Códigos QR por mesa</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">Por seguridad, los QR firmados no se publican en Internet. Genéralos localmente con <code className="font-bold">npm run generate:qrs</code> y encontrarás los 12 SVG en la carpeta <code className="font-bold">generated-qrs</code>.</p>
      </div>
      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <QrCode className="mt-0.5 shrink-0" size={24} />
        <p className="text-sm font-bold">No compartas la carpeta de QR ni publiques sus archivos. Si alguno se filtra, cambia <code>TABLE_QR_SECRET</code>, vuelve a generarlos y reemplaza los impresos.</p>
      </div>
    </section>
  );
}
