import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/admin/table-qrs": ["./output/pdf/codigos-qr-mesas.pdf"],
  },
};

export default nextConfig;
