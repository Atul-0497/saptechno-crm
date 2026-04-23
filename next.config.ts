import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/quotes",
        destination: "/QuotesMaster",
        permanent: false,
      },
      {
        source: "/quotes/add",
        destination: "/QuotesMaster/add",
        permanent: false,
      },
      {
        source: "/quotes/edit/:id",
        destination: "/QuotesMaster/edit/:id",
        permanent: false,
      },
      {
        source: "/purchase-orders",
        destination: "/PurchaseorderMaster",
        permanent: false,
      },
      {
        source: "/purchase-orders/add",
        destination: "/PurchaseorderMaster/add",
        permanent: false,
      },
      {
        source: "/purchase-orders/edit/:id",
        destination: "/PurchaseorderMaster/edit/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
