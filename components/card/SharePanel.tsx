"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import html2canvas from "html2canvas";
import { Download, ExternalLink, Link2, QrCode, Share2, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

interface SharePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  username: string;
  isFlipped: boolean;
  cardRef?: RefObject<HTMLElement | null>;
  frontRef?: RefObject<HTMLElement | null>;
  backRef?: RefObject<HTMLElement | null>;
  className?: string;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

async function captureElement(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  clone.style.opacity = "1";
  clone.style.transform = "none";
  clone.style.pointerEvents = "none";
  clone.style.margin = "0";
  clone.style.width = `${element.offsetWidth}px`;
  clone.style.height = `${element.offsetHeight}px`;
  document.body.appendChild(clone);

  try {
    return await html2canvas(clone, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
  } finally {
    document.body.removeChild(clone);
  }
}

async function canvasToDownload(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function buildEmbedCode(username: string) {
  return `<iframe src="https://btouch.dev/${username}" width="420" height="600" frameborder="0"></iframe>`;
}

function SharePanelBody({
  open,
  url,
  username,
  isFlipped,
  cardRef,
  frontRef,
  backRef,
  onOpenChange,
}: SharePanelProps) {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportBothSides, setExportBothSides] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const embedCode = useMemo(() => buildEmbedCode(username), [username]);

  async function handleQrDownload() {
    const node = qrRef.current;
    if (!node) {
      return;
    }

    setIsExporting(true);
    try {
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      await canvasToDownload(canvas, `btouch-qr-${username}.png`);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleCardDownload() {
    setIsExporting(true);

    try {
      const currentFace = isFlipped ? backRef?.current : frontRef?.current;
      const fallbackFace = cardRef?.current;

      if (exportBothSides && frontRef?.current && backRef?.current) {
        const [frontCanvas, backCanvas] = await Promise.all([
          captureElement(frontRef.current),
          captureElement(backRef.current),
        ]);

        const canvas = document.createElement("canvas");
        canvas.width = frontCanvas.width + backCanvas.width;
        canvas.height = Math.max(frontCanvas.height, backCanvas.height);

        const context = canvas.getContext("2d");
        if (!context) {
          return;
        }

        context.drawImage(frontCanvas, 0, 0);
        context.drawImage(backCanvas, frontCanvas.width, 0);
        await canvasToDownload(canvas, `btouch-${username}.png`);
        return;
      }

      const target = currentFace ?? fallbackFace;
      if (!target) {
        return;
      }

      const canvas = await captureElement(target);
      await canvasToDownload(canvas, `btouch-${username}.png`);
    } finally {
      setIsExporting(false);
    }
  }

  function handleLinkedInShare() {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=Check+out+my+developer+card`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function handleTwitterShare() {
    const shareUrl = `https://twitter.com/intent/tweet?text=Check+out+my+developer+card+%F0%9F%92%BB&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  const panel = (
    <div
      className="flex max-h-[85vh] w-full max-w-[420px] flex-col gap-5 overflow-hidden border border-white/10 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur-2xl"
      style={{
        borderRadius: 24,
      }}
      aria-busy={isExporting ? "true" : "false"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Share</p>
          <h2 className="mt-2 text-lg font-semibold">Share your card</h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close share panel"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          ×
        </button>
      </div>

      <div className="grid gap-4 overflow-y-auto pr-1">
        <section className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link2 className="h-4 w-4 text-white/60" aria-hidden="true" />
            Link
          </div>
          <input
            readOnly
            value={url}
            className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Public card URL"
          />
          <CopyButton value={url} label="Copy link" className="w-full" />
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <QrCode className="h-4 w-4 text-white/60" aria-hidden="true" />
            QR Code
          </div>
          <div className="flex items-center justify-between gap-3">
            <div
              ref={qrRef}
              className="rounded-2xl bg-white p-2"
              aria-label="Public card QR code"
            >
              <QRCodeSVG value={url} size={120} includeMargin />
            </div>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => void handleQrDownload()}
                disabled={isExporting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download QR
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Share2 className="h-4 w-4 text-white/60" aria-hidden="true" />
            Share
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleLinkedInShare}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              LinkedIn
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleTwitterShare}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              X / Twitter
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-white/60" aria-hidden="true" />
            Export
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={exportBothSides}
              onChange={(event) => setExportBothSides(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-white focus:ring-white/40"
            />
            Export both sides
          </label>
          <button
            type="button"
            onClick={() => void handleCardDownload()}
            disabled={isExporting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {isExporting ? "Exporting..." : "Download card as PNG"}
          </button>
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link2 className="h-4 w-4 text-white/60" aria-hidden="true" />
            Embed
          </div>
          <textarea
            readOnly
            value={embedCode}
            className="min-h-24 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Embed iframe code"
          />
          <CopyButton value={embedCode} label="Copy embed" className="w-full" />
        </section>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[680px] p-4 outline-none"
          >
            {panel}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={12}
          className="z-50 outline-none"
        >
          {panel}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function SharePanel(props: SharePanelProps) {
  return <SharePanelBody {...props} />;
}
