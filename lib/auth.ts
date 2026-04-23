// ADMIN LOGIN
export async function adminLogin(email: string, password: string) {
  
  const res = await fetch('/api/admin/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
  console.log("res",res);
  

  if (!res.ok) {
    throw new Error('Login failed')
  }

  const data = await res.json()
  return data
}