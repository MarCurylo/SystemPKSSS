// HelpBubble.ts

// 1) Nápovědy jako šablony – čísla nahradíš :id, :id2...
const helpTexts: Record<string, string> = {
  "/": "Toto je hlavní stránka systému PKSSS. Pokud ještě nejste přihlášení, přihlaste se.",
  "#/login": "Tady se můžete zaregistrovat nebo přihlásit. K přihlášení použijte Uživatelské jméno Super a Heslo Abc123.",
  "#/admin-users": "Tady může admin přidávat a mazat uživatele a měnit jejich role.",
  "#services": "Zde vidíte přehled všech služeb. Klikněte na službu pro detail nebo si založte novou.",
  "#adminview": "SuperView: Statistiky a přehledy všech dat v systému. Pouze pro administrátory.",
  "#services#:id": "Detail služby. Zde vidíte informace o konkrétní službě. Můžete přidat tagy a podívat se na typy entit, které služba má. Pokud se díváte na Typ entity, v detailu, jí můžete přidat attributy. ",
  "#services#:id#entitytypes": "Typy entit v rámci této služby.",
  "#services#:id#entitytypes#:id2": "Detail typu entity",
  "#services#:id#entitytypes#:id2#attributedefinitions": "Seznam atributů pro vybraný typ entity. Zde upravíte vlastnosti a zobrazíte entity. Mlže to být text, ale také číslo, uzavřená volba, nebo třeba datum. Dvě vlastnosti se mohou zobrazovat v menu, jako jméno.",
  "#services#:id#entitytypes#:id2#entities": "Seznam entit tohoto typu.",
  "#services#:id#entitytypes#:id2#entities#:id3": "Detail konkrétní entity.",
  // ... přidej další patterns podle potřeb
};

// 2) Funkce pro převod aktuálního hashe na pattern:
function normalizeHashToPattern(hash: string): string {
  // Rozděl hash podle #
  const parts = hash.replace(/^#/, "").split("#");
  let pattern = "";
  let idCount = 1;
  for (const part of parts) {
    if (!part) continue;
    if (/^\d+$/.test(part)) {
      pattern += `#:id${idCount > 1 ? idCount : ""}`;
      idCount++;
    } else {
      pattern += `#${part}`;
    }
  }
  return pattern || "/";
}

// 3) Najdi nejlepší odpovídající šablonu
function getBestHelpText(hash: string): string {
  const pattern = normalizeHashToPattern(hash);
  let best = "/";
  for (const key of Object.keys(helpTexts)) {
    if (pattern.startsWith(key) && key.length > best.length) {
      best = key;
    }
  }
  return helpTexts[best] || "Zatím není připravena nápověda pro tuto sekci. (Doplníš ručně v HelpBubble.ts)";
}

// 4) Zobraz skleněnou bublinu vlevo dole
let helpBubble: HTMLElement | null = null;
export function showHelpBubble() {
  const hash = window.location.hash || "/";
  const text = getBestHelpText(hash);

  // Pokud už je otevřená bublina, zavři ji
  if (helpBubble) {
    helpBubble.remove();
    helpBubble = null;
  }

  helpBubble = document.createElement("div");
  helpBubble.style.position = "fixed";
  helpBubble.style.left = "80px";
  helpBubble.style.bottom = "80px";
  helpBubble.style.maxWidth = "380px";
  helpBubble.style.background = "rgba(255,255,255,0.88)";
  helpBubble.style.backdropFilter = "blur(11px)";
  helpBubble.style.borderRadius = "1em";
  helpBubble.style.boxShadow = "0 6px 44px 0 rgba(70,60,100,0.14)";
  helpBubble.style.padding = "1.2em 1.5em";
  helpBubble.style.zIndex = "2000";
  helpBubble.style.fontSize = "1.12em";
  helpBubble.style.color = "#222";
  helpBubble.style.animation = "fadeInHelp 0.2s";
  helpBubble.style.border = "1.5px solid #e4e1f7";
  helpBubble.innerHTML = `
    <div>${text}</div>
    <button id="help-bubble-close" style="
      display:block;margin:1.2em auto 0 auto;
      padding:6px 22px;
      font-size:1em;
      border-radius:1em;
      border:none;
      background:#d1d0f8;
      color:#372e6e;
      cursor:pointer;">Zavřít</button>
  `;
  document.body.appendChild(helpBubble);

  document.getElementById("help-bubble-close")?.addEventListener("click", () => {
    if (helpBubble) {
      helpBubble.remove();
      helpBubble = null;
    }
  });
}

// CSS animace bubliny
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeInHelp {
  from { opacity:0; transform:translateY(20px);}
  to { opacity:1; transform:translateY(0);}
}
`;
document.head.appendChild(style);
