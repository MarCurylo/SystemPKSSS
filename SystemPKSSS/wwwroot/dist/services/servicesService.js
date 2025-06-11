var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načti všechny služby
export function loadServices() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/services");
        if (!response.ok) {
            throw new Error("Failed to fetch services");
        }
        return yield response.json();
    });
}
// Vytvoř novou službu
export function createService(service) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/services", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
        });
        return yield response.json();
    });
}
// Update existující služby
export function updateService(service) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!service.id) {
            throw new Error("Service ID is required for update");
        }
        const response = yield fetch(`/services/${service.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
        });
        return yield response.json();
    });
}
// Smazání služby
export function deleteService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`/services/${id}`, { method: 'DELETE' });
    });
}
// Aktivace / deaktivace služby
export function toggleServiceActivation(id, activate) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${id}/activate?activate=${activate}`, { method: 'PUT' });
        return yield response.json();
    });
}
//# sourceMappingURL=servicesService.js.map