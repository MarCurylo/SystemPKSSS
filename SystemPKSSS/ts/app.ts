import { createService } from './service.js';

document.getElementById('create-service-btn')?.addEventListener('click', async () => {
    const nameInput = <HTMLInputElement>document.getElementById('service-name');
    const descriptionInput = <HTMLInputElement>document.getElementById('service-description');

    try {
        const result = await createService(nameInput.value, descriptionInput.value);
        alert(`Slu�ba vytvo�ena s ID: ${result.id}`);
    } catch (error) {
        alert("Chyba p�i vytv��en� slu�by");
    }
});
