/* ============================================================
   CINEVAULT — UI
   Funções puras de construção de interface. Recebem dados,
   devolvem elementos ou HTML — nunca buscam dados sozinhas.
   ============================================================ */

const CineVaultUI = (() => {
  const TYPE_ICON = {
    filme: "clapperboard",
    série: "tv",
    minissérie: "tv",
    anime: "sparkles",
    documentário: "camera",
  };

  function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Ver detalhes de ${item.title}`);

    const goToDetails = () => {
      const base = window.location.pathname.includes("/pages/") ? "" : "pages/";
      window.location.href = `${base}movie.html?id=${item.id}`;
    };
    card.addEventListener("click", goToDetails);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToDetails();
      }
    });

    card.innerHTML = `
      <div class="card__poster-wrap">
        <div class="card__poster skeleton" aria-hidden="true"></div>
        <span class="card__badge">
          <i data-lucide="${TYPE_ICON[item.type] || "clapperboard"}"></i>
          ${capitalize(item.type)}
        </span>
        <div class="card__overlay">
          <span class="card__cta">Ver detalhes</span>
        </div>
      </div>
      <div class="card__body">
        <h3 class="card__title">${item.title}</h3>
        <div class="card__meta">
          <span class="card__rating"><i data-lucide="star"></i>${item.rating.toFixed(1)}</span>
          <span>${item.year}</span>
        </div>
      </div>
    `;

    return card;
  }

  function renderCarousel(container, items) {
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    items.forEach((item) => fragment.appendChild(createCard(item)));
    container.appendChild(fragment);
  }

  function renderHero(container, hero) {
    container.querySelector(".hero__title").textContent = hero.title;
    container.querySelector(".hero__desc").textContent = hero.description;
    container.querySelector(".hero__rating").textContent = hero.rating.toFixed(1);
    container.querySelector(".hero__year").textContent = hero.year;
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  return { createCard, renderCarousel, renderHero, showToast, refreshIcons };
})();
