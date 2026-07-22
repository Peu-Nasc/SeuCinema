/* ============================================================
   CINEVAULT — APP
   Ponto de entrada. Cada página tem seu init próprio; este
   arquivo cuida do que é comum a todas (ícones, navbar, busca).
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  CineVaultUI.refreshIcons();

  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        CineVaultUI.showToast(`Busca por "${searchInput.value.trim()}" — em breve.`);
      }
    });
  }

  // Se a página tiver um inicializador próprio (ex: initHome), chama agora.
  if (typeof window.initHome === "function") {
    window.initHome();
  }
});
