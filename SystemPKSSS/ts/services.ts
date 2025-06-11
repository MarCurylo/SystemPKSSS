export async function loadServices() {
  const response = await fetch('/services');
  return await response.json();
}

export async function createService(name: string, description: string, isActive: boolean) {
  const response = await fetch('/services', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, description, isActive})
  });
  return await response.json();
}

export async function updateService(id: number, name: string, description: string, isActive: boolean) {
  const response = await fetch(`/services/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id, name, description, isActive})
  });
  return await response.json();
}

export async function deleteService(id: number) {
  await fetch(`/services/${id}`, { method: 'DELETE' });
}

export async function toggleServiceActivation(id: number, activate: boolean) {
  const response = await fetch(`/services/${id}/activate?activate=${activate}`, { method: 'PUT' });
  return await response.json();
}
