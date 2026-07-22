/* ============================================================
   CINEVAULT — PROFILE (init)
   Só roda em pages/profile.html.
   ============================================================ */

window.initProfile = async function initProfile() {
  const grids = {
    watched: document.querySelector("#grid-watched"),
    favorites: document.querySelector("#grid-favorites"),
    watchlist: document.querySelector("#grid-watchlist"),
  };
  const achievementsGrid = document.querySelector("#grid-achievements");
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll("[data-panel]");

  try {
    const profile = await CineVaultAPI.getProfile();

    // Header
    document.querySelector(".profile-header__avatar").src = profile.avatar;
    document.querySelector("#navbar-avatar").src = profile.avatar;
    document.querySelector(".profile-header__level").textContent = profile.level;
    document.querySelector(".profile-header__name").textContent = profile.name;
    document.querySelector(".profile-header__handle").textContent = profile.handle;

    const pct = Math.round((profile.xp / profile.xpNext) * 100);
    document.querySelector(".level-progress__fill").style.width = `${pct}%`;
    document.querySelector(".level-progress__labels").innerHTML =
      `<span>${profile.xp} XP</span><span>${profile.xpNext} XP para o nível ${profile.level + 1}</span>`;

    // Estatísticas rápidas
    document.querySelector("#stat-movies").textContent = profile.stats.movies;
    document.querySelector("#stat-series").textContent = profile.stats.series;
    document.querySelector("#stat-hours").textContent = `${profile.stats.hours}h`;
    document.querySelector("#stat-achievements").textContent = profile.stats.achievements;

    // Grades de títulos
    CineVaultUI.renderCarousel(grids.watched, profile.watched);
    CineVaultUI.renderCarousel(grids.favorites, profile.favorites);
    CineVaultUI.renderCarousel(grids.watchlist, profile.watchlist);

    document.querySelector('[data-tab-count="watched"]').textContent = profile.watched.length;
    document.querySelector('[data-tab-count="favorites"]').textContent = profile.favorites.length;
    document.querySelector('[data-tab-count="watchlist"]').textContent = profile.watchlist.length;

    // Conquistas
    achievementsGrid.innerHTML = "";
    profile.achievements.forEach((a) => {
      const el = document.createElement("div");
      el.className = `achievement ${a.unlocked ? "" : "achievement--locked"}`;
      el.innerHTML = `
        <span class="achievement__icon"><i data-lucide="${a.icon}"></i></span>
        <span>
          <span class="achievement__title">${a.title}</span><br/>
          <span class="achievement__desc">${a.desc}</span>
        </span>
      `;
      achievementsGrid.appendChild(el);
    });

    CineVaultUI.refreshIcons();
  } catch (err) {
    console.error("Falha ao carregar o perfil:", err);
    CineVaultUI.showToast("Não foi possível carregar o perfil.");
  }

  // Alternância de abas
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const target = tab.dataset.tab;
      panels.forEach((p) => {
        p.hidden = p.dataset.panel !== target;
      });
    });
  });
};
