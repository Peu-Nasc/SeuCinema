/* ============================================================
   CINEVAULT — HOME (init)
   Só roda em index.html. Busca os dados via CineVaultAPI e
   entrega para CineVaultUI renderizar.
   ============================================================ */

window.initHome = async function initHome() {
  const hero = document.querySelector(".hero");
  const trendingEl = document.querySelector("#carousel-trending");
  const topRatedEl = document.querySelector("#carousel-top-rated");
  const moviesEl = document.querySelector("#carousel-movies");
  const seriesEl = document.querySelector("#carousel-series");

  try {
    const data = await CineVaultAPI.getHome();

    if (hero) CineVaultUI.renderHero(hero, data.hero);
    CineVaultUI.renderCarousel(trendingEl, data.trending);
    CineVaultUI.renderCarousel(topRatedEl, data.topRated);
    CineVaultUI.renderCarousel(moviesEl, data.movies);
    CineVaultUI.renderCarousel(seriesEl, data.series);

    CineVaultUI.refreshIcons();
  } catch (err) {
    console.error("Falha ao carregar a home:", err);
    CineVaultUI.showToast("Não foi possível carregar o conteúdo.");
  }
};
