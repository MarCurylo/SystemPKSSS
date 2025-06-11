export async function createService(name: string, description: string) {
  const response = await fetch('/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, description })
  });

  if (!response.ok) {
    throw new Error("Nepoda�ilo se vytvo�it slu�bu");
  }

  return await response.json();
}
