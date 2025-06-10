"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const services_js_1 = require("./services.js");
(_a = document.getElementById('create-service-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const nameInput = document.getElementById('service-name');
    const descriptionInput = document.getElementById('service-description');
    try {
        const result = yield (0, services_js_1.createService)(nameInput.value, descriptionInput.value);
        alert(`Slu�ba vytvo�ena s ID: ${result.id}`);
    }
    catch (error) {
        alert("Chyba p�i vytv��en� slu�by");
    }
}));
//# sourceMappingURL=app.js.map