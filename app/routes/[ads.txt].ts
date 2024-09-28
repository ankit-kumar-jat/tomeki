export async function loader() {
  const adsText = `
    google.com, pub-6892126566030270, DIRECT, f08c47fec0942fa0
    `
  return new Response(adsText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `public, max-age=30`,
    },
  })
}
