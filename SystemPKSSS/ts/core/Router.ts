import { renderAuthForms } from "./authModule.js";
import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
import { renderEntityTypeTab, renderEntityTypeDetail } from "../entityTypes/entityTypesView.js";
import { renderAttributeDefinitionTab } from "../AttributeDefinitions/attributeDefinitionsView.js";
import { renderEntityTap, renderEntityDetail } from "../Entities/entitiesView.js";
import { renderNotesSection } from "../Notes/notesView.js";
import { renderAdminUsersTab } from "../Users/adminUserView.js";
import { renderAdminView } from "../Users/superView.js";

export function handleHashChange() {
    const container = document.getElementById("main-container");
    if (!container) return;

    const hash = window.location.hash;

    // LOGIN / REGISTRACE
    if (hash === "#/login" || hash === "#/register") {
        renderAuthForms();
        return;
    }

    // ADMIN - SPRÁVA UŽIVATELŮ
    if (hash === "#/admin-users") {
        renderAdminUsersTab(container);
        return;
    }

    // ADMIN - SUPERVIEW
    if (hash === "#adminview") {
        renderAdminView(container);
        return;
    }
    const parts = window.location.hash.slice(1).split('#');
    const section = parts[0] ?? "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = parts[2] ?? "";
    const subId = parts[3] ? parseInt(parts[3]) : null;
    const subSubSection = parts[4] ?? "";
    const subSubId = parts[5] ? parseInt(parts[5]) : null;
    const extraSection = parts[6] ?? "";

    if (section === "services") {
        if (!id) {
            renderServicesTab(container);
        } else if (!subSection) {
            renderServiceDetail(id, container);
        } else if (subSection === "entitytypes") {
            if (!subId) {
                renderEntityTypeTab(id, container);
            } else if (!subSubSection) {
                renderEntityTypeDetail(id, subId, container);
            } else if (subSubSection === "attributedefinitions") {
                if (!subSubId) {
                    renderAttributeDefinitionTab(id, subId, container);
                } else {
                    // renderAttributeDefinitionDetail(id, subId, subSubId, container);
                }
            } else if (subSubSection === "entities") {
                if (!subSubId) {
                    renderEntityTap(id, subId, container);
                } else if (extraSection === "notes") {
                    renderNotesSection(id, subId, subSubId, container);
                } else {
                    renderEntityDetail(id, subId, subSubId, container);
                }
            } else {
                container.innerHTML = "<p>Neznámá podstránka typu entity.</p>";
            }
        } else {
            container.innerHTML = "<p>Neznámá podstránka služby.</p>";
        }
    } else {
        container.innerHTML = `
  <div style="max-width:740px;margin:2.5em auto 2em auto;background:#fffbe7;padding:2.5em 2.2em 2em 2.2em;border-radius:1.5em;box-shadow:0 5px 38px 0;">
    <h2 style="color:#95702c;margin-top:0;">Vítejte v systému PKSSS</h2>
    <p>
      Možná se vám bude hodit nápověda, najdete ji vlevo dole. Na každé stránce, kterou navštívíte, bude jiná Při loginu se v nápovědě zobrazují příhlašovací údaje.
    </p>
    <p>
      Tato aplikace slouží k evidenci, správě a vyhledávání dat v oblasti sociálních služeb. Je navržena jako jednoduché řešení pro běžnou každodenní práci – nahrazuje složité tabulky, sdílené dokumenty a ruční zápisy. Všechny potřebné údaje jsou přehledně na jednom místě.
    </p>
    <h3 style="margin-top:1.5em;">Hlavní funkce:</h3>
    <ul style="margin-bottom:1.5em;">
      <li>
        <b>Služby a typy entit:</b> Pro každou službu lze nastavit různé typy entit (například Klient, Zájemce, Matka). U každého typu entity je možné spravovat vlastní sadu údajů.
      </li>
      <li>
        <b>Správa osob a jejich údajů:</b> Ke každé osobě či záznamu můžete evidovat údaje podle zvolených atributů. Údaje lze kdykoliv upravit.
      </li>
      <li>
        <b>Zápisy:</b> K jednotlivým záznamům je možné přidávat zápisy (poznámky, kontakty, události), které je možné i upravovat nebo mazat.
      </li>
      <li>
        <b>Tagy:</b> Záznamy i služby lze označovat barevnými tagy pro lepší přehlednost a třídění.
      </li>
      <li>
        <b>Uživatelské role:</b> Systém rozlišuje běžné uživatele a administrátory. Administrátor může spravovat uživatele a nastavovat jejich práva.
      </li>
      <li>
        <b>Přehledy a SuperView:</b> Administrátor má k dispozici sekci SuperView s přehledem všech záznamů v systému.
      </li>
      <li>
        <b>Nápověda:</b> Vlevo dole najdete otazník s krátkou nápovědou k aktuální sekci.
      </li>
    </ul>
    <p style="margin-bottom:0;">
      <b>Pro koho je aplikace určena?</b><br>
      Pro pracovníky a organizace v sociálních službách, kteří potřebují snadno a přehledně evidovat osoby, služby a zápisy.
    </p>
  </div>
`;

    }
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
