"use client";

import { Download, ExternalLink, QrCode } from "lucide-react";

/* eslint-disable @next/next/no-img-element -- QR assets are generated as static SVG files. */

const TABLES = Array.from({ length: 12 }, (_, index) => index + 1);
const MENU_URL = "https://tdelicius.vercel.app";

export function QrManager() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Accesos rápidos</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Códigos QR por mesa</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">Cada código abre tu menú con la mesa ya identificada. Descarga o imprime el QR correspondiente.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TABLES.map((table) => {
          const menuUrl = `${MENU_URL}/?mesa=${table}`;
          return (
            <article key={table} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-neutral-400">Identificador</p><h2 className="mt-1 text-xl font-black">Mesa {table}</h2></div><QrCode className="text-red-600" size={24} /></div>
              <div className="mt-5 flex justify-center rounded-xl bg-neutral-50 p-4"><img src={`/qr/mesa-${table}.svg`} alt={`Código QR de la mesa ${table}`} className="h-36 w-36" /></div>
              <div className="mt-4 grid grid-cols-2 gap-2"><a href={`/qr/mesa-${table}.svg`} download={`mesa-${table}.svg`} className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-3 py-2.5 text-xs font-black text-white hover:bg-red-600"><Download size={14} /> Descargar</a><a href={menuUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-xs font-black text-neutral-700 hover:border-red-200 hover:text-red-600"><ExternalLink size={14} /> Probar</a></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
