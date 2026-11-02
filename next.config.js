/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Mallen medgivande-organdonation togs bort 2026-11-02 (önskemål om
      // organdonation anmäls i Socialstyrelsens donationsregister).
      // permanent: true ger statuskod 308.
      {
        source: '/mallar/vard-omsorg/medgivande-organdonation',
        destination: '/mallar?category=vard-omsorg',
        permanent: true,
      },
      {
        source: '/skapa/medgivande-organdonation',
        destination: '/mallar?category=vard-omsorg',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
