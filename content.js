
/**
 * Lógica de extracción y clasificación de CSS
 */

(function() {
  let isPickerActive = false;
  let hoverOverlay = null;

  // --- Utilidades de Clasificación ---

  function classifyClasses(classList) {
    const bootstrap = [];
    const tailwind = [];
    const other = [];

    for (const cls of Array.from(classList)) {
      // Patrones típicos de Bootstrap
      if (/^(container|row|col-|btn|navbar|modal|form-control|card|d-|text-|fw-|gx-|gy-|align-|justify-|border-|rounded-|shadow-|p[trblxy]?-|m[trblxy]?-)/.test(cls) && 
          !cls.includes(':')) { // Bootstrap no suele usar ':' en clases base
        bootstrap.push(cls);
      } 
      // Patrones típicos de Tailwind (incluyendo modificadores md:, hover:, etc)
      else if (/^(m[trblxy]?-\d+|p[trblxy]?-\d+|text-[\w-]+|bg-[\w-]+|flex|grid|items-[\w-]+|justify-[\w-]+|w-\d+|h-\d+|sm:|md:|lg:|xl:|2xl:|hover:|focus:|group-|peer-)/.test(cls)) {
        tailwind.push(cls);
      } else {
        other.push(cls);
      }
    }
    return { bootstrap, tailwind, other };
  }

  function detectFrameworkFromSelector(selector) {
    const s = selector.toLowerCase();
    const bootstrapHints = [".container", ".row", ".col-", ".btn", ".navbar", ".modal", ".form-control", ".card", ".d-flex"];
    const tailwindRegexes = [/\.m[trblxy]?-\d/, /\.p[trblxy]?-\d/, /\.text-/, /\.bg-/, /\.flex\b/, /\.grid\b/, /\.md\\:/, /\.hover\\:/];

    if (bootstrapHints.some(h => s.includes(h))) return "bootstrap";
    if (tailwindRegexes.some(r => r.test(s))) return "tailwind";
    return "app";
  }

  // --- Lógica de Clonación ---

  function copyComputedStyles(src, dst) {
    const computed = window.getComputedStyle(src);
    let cssText = "";
    for (const prop of computed) {
      const value = computed.getPropertyValue(prop);
      cssText += `${prop}: ${value}; `;
    }
    dst.setAttribute("style", cssText.trim());
  }

  function cloneWithMetadata(node) {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createTextNode("");

    const clone = node.cloneNode(false);
    copyComputedStyles(node, clone);

    const { bootstrap, tailwind, other } = classifyClasses(node.classList);
    if (bootstrap.length) clone.setAttribute("data-origin-bootstrap", bootstrap.join(" "));
    if (tailwind.length) clone.setAttribute("data-origin-tailwind", tailwind.join(" "));
    if (other.length) clone.setAttribute("data-origin-app", other.join(" "));

    for (const child of node.childNodes) {
      clone.appendChild(cloneWithMetadata(child));
    }
    return clone;
  }

  function extractRules(root) {
    const allNodes = [root, ...root.querySelectorAll("*")];
    const buckets = { bootstrap: new Set(), tailwind: new Set(), app: new Set() };

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.type !== CSSRule.STYLE_RULE) continue;
          
          let matches = false;
          for (const el of allNodes) {
            if (el.matches(rule.selectorText)) {
              matches = true;
              break;
            }
          }

          if (matches) {
            const origin = detectFrameworkFromSelector(rule.selectorText);
            buckets[origin].add(`${rule.selectorText} { ${rule.style.cssText} }`);
          }
        }
      } catch (e) {
        // Ignorar hojas cross-origin inaccesibles
      }
    }
    return buckets;
  }

  // --- Selector Visual (Picker) ---

  function createOverlay() {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.zIndex = '2147483647';
    div.style.pointerEvents = 'none';
    div.style.border = '2px solid #3b82f6';
    div.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    div.style.transition = 'all 0.1s ease';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
  }

  function startPicker() {
    if (isPickerActive) return;
    isPickerActive = true;
    hoverOverlay = createOverlay();
    
    const onMouseMove = (e) => {
      const el = e.target;
      if (el === hoverOverlay) return;
      const rect = el.getBoundingClientRect();
      hoverOverlay.style.display = 'block';
      hoverOverlay.style.top = `${rect.top}px`;
      hoverOverlay.style.left = `${rect.left}px`;
      hoverOverlay.style.width = `${rect.width}px`;
      hoverOverlay.style.height = `${rect.height}px`;
    };

    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      stopPicker();
      processElement(e.target);
    };

    const stopPicker = () => {
      isPickerActive = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick, true);
      if (hoverOverlay) hoverOverlay.remove();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick, true);
  }

  function processElement(el) {
    const cloned = cloneWithMetadata(el);
    const rules = extractRules(el);

    const cssBlocks = Object.entries(rules)
      .filter(([, set]) => set.size > 0)
      .map(([fw, set]) => `/* === ${fw.toUpperCase()} === */\n${Array.from(set).join('\n')}`)
      .join('\n\n');

    const finalHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { padding: 2rem; font-family: sans-serif; }
    ${cssBlocks}
  </style>
</head>
<body>
  <!-- 
    EXPORTADO CON CSS ORIGIN EXPORTER
    Fidelidad visual: Estilos inline aplicados.
    Trazabilidad: Atributos data-origin-* incluidos.
  -->
  ${cloned.outerHTML}
</body>
</html>`;

    // Enviar al portapapeles
    navigator.clipboard.writeText(finalHtml).then(() => {
      alert("¡HTML con trazabilidad copiado al portapapeles!");
    });
  }

  // Escuchar mensajes del popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START_PICKER") startPicker();
  });

})();
