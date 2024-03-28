/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ordinalslite.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ordinalslite.com",
      },
    ],
  },
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/litescribe/:slug*",
        destination: "https://litescribe.io/api/:slug*",
      },
      {
        source: "/ordinalslite/:slug*",
        destination: "https://ordinalslite.xyz/:slug*",
      },
      {
        source: "/chainz/:slug*",
        destination: "https://chainz.cryptoid.info/:slug*",
      },
      {
        source: "/searchInscription/:slug*",
        destination: "http://217.76.63.90:3000/:slug*",
      },
      {
        source: "/ordinalsExplorer/:slug*",
        destination: "https://ordinalslite.com/:slug*",
      },
      {
        source: "/dpay.wallet/:slug*",
        destination: "https://wallet-api.dogeord.io/:slug*",
      },
      {
        source: "/unspent.dogeord/:slug*",
        destination: "https://unspent.dogeord.io/api/v1/:slug*",
      },
      {
        source: "/drc20.explorer/:slug*",
        destination: "https://d20-api2.dogeord.io/:slug*",
      },
      {
        source: "/drc20/:slug*",
        destination: "https://www.drc20.xyz/:slug*",
      },
      {
        source: "/coinranking/:slug*",
        destination: "https://coinranking.com/:slug*",
      },
    ];
  },
};


module.exports = nextConfig;
