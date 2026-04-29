import QRCode from "qrcode";

export async function generateQrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    color: { dark: "#111111", light: "#e3ddd3" },
    margin: 1,
    width: 44,
    errorCorrectionLevel: "M",
  });
}
