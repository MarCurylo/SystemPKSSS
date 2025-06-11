import { Service } from "./servicesModel.js";
// Načti všechny služby
export async function loadServices(): Promise<Service[]> {
    const response = await fetch("/services");
    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }
    return await response.json();
}

// Vytvoř novou službu
export async function createService(service: Service): Promise<Service> {
    const response = await fetch("/services", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    });
    return await response.json();
}

// Update existující služby
export async function updateService(service: Service): Promise<Service> {
    if (!service.id) {
        throw new Error("Service ID is required for update");
    }

    const response = await fetch(`/services/${service.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    });
    return await response.json();
}

// Smazání služby
export async function deleteService(id: number) {
    await fetch(`/services/${id}`, { method: 'DELETE' });
}

// Aktivace / deaktivace služby
export async function toggleServiceActivation(id: number, activate: boolean): Promise<Service> {
    const response = await fetch(`/services/${id}/activate?activate=${activate}`, { method: 'PUT' });
    return await response.json();
}
