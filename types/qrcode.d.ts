declare module "qrcode" {
  interface SvgOptions {
    type: "svg";
    width?: number;
    margin?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    color?: {
      dark?: string;
      light?: string;
    };
  }

  interface QRCodeApi {
    toString(text: string, options: SvgOptions): Promise<string>;
  }

  const QRCode: QRCodeApi;
  export default QRCode;
}
