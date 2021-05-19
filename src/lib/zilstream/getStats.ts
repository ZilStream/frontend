export default async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats`)
  return res.json()
}