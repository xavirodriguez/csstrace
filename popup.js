document.getElementById('startBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url.startsWith('chrome://')) {
    alert('No se puede ejecutar en páginas internas de Chrome.');
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "START_PICKER" });
  window.close(); // Cerrar el popup para permitir la interacción
});
