export default async function sendGovernanceMessage(message: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  return await res.json()
}