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
        const query = encodeURIComponent(searchInput.value.trim());
        // Descobre se já estamos dentro da pasta pages/ ou na raiz
        const base = window.location.pathname.includes("/pages/") ? "" : "pages/";
        window.location.href = `${base}search.html?q=${query}`;
      }
    });
  }

  // Se a página tiver um inicializador próprio (ex: initHome), chama agora.
  if (typeof window.initHome === "function") {
    window.initHome();
  }
});
