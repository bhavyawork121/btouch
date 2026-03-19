"use client";

import { Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function QRExport({ url, title, compact = false }: { url: string; title: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur ${compact ? "p-2" : "p-4"}`}>
      <div className="flex items-center justify-between gap-4">
        {!compact ? (
          <div>
            <p className="text-sm text-slate-300">{title}</p>
            <p className="text-xs text-slate-500">Scan or download the share QR.</p>
          </div>
        ) : null}
        <div className="rounded-2xl bg-white p-2">
          <QRCodeSVG value={url} size={compact ? 52 : 80} includeMargin />
        </div>
        {!compact ? (
          <a
            href={url}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            <QrCode className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
