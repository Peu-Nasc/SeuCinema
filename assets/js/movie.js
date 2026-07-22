/* ============================================================
   CINEVAULT — MOVIE (init)
   Só roda em pages/movie.html. Lê ?id= da URL.
   ============================================================ */

window.initMovie = async function initMovie() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "10";
  const mediaType = params.get("type") || "movie";

  const els = {
    title: document.querySelector(".movie-hero__title"),
    tagline: document.querySelector(".movie-hero__tagline"),
    type: document.querySelector("#pill-type"),
    year: document.querySelector("#meta-year"),
    runtime: document.querySelector("#meta-runtime"),
    genres: document.querySelector("#meta-genres"),
    rating: document.querySelector("#hero-rating"),
    desc: document.querySelector(".movie-hero__desc"),
    poster: document.querySelector(".movie-hero__poster img"),
    backdrop: document.querySelector(".movie-hero__backdrop"),
    cast: document.querySelector("#cast-grid"),
    similar: document.querySelector("#similar-carousel"),
  };

  try {
    const movie = await CineVaultAPI.getMovie(id, mediaType);

    document.title = `${movie.title} — CineVault`;
    els.title.textContent = movie.title;
    els.tagline.textContent = movie.tagline;
    els.tagline.hidden = !movie.tagline;
    els.type.textContent = capitalize(movie.type);
    els.year.textContent = movie.year;
    els.runtime.textContent = movie.runtime;
    els.genres.textContent = movie.genres.join(" · ") || "—";
    els.rating.textContent = movie.rating.toFixed(1);
    els.desc.textContent = movie.description;
    els.poster.src = movie.poster || "";
    els.poster.alt = `Pôster de ${movie.title}`;
    els.backdrop.src = movie.backdrop || "";

    // Elenco
    els.cast.innerHTML = "";
    movie.cast.forEach((person) => {
      const card = document.createElement("div");
      card.className = "cast-card";
      
      const photoHtml = person.photo 
        ? `<img src="${person.photo}" alt="${person.name}" loading="lazy" />` 
        : ``; // Mantém o fundo cinza se não tiver foto

      card.innerHTML = `
        <div class="cast-card__photo skeleton">
          ${photoHtml}
        </div>
        <div class="cast-card__name">${person.name}</div>
        <div class="cast-card__role">${person.role}</div>
      `;
      els.cast.appendChild(card);
    });

    if (movie.cast.length === 0) {
      els.cast.innerHTML = `<p style="color: var(--text-muted); font-size: var(--fs-sm);">Elenco não disponível.</p>`;
    }

    // Títulos parecidos (agora já vem pronto da API)
    const similarItems = movie.similar || [];
    
    if (similarItems.length) {
      CineVaultUI.renderCarousel(els.similar, similarItems);
    } else {
      els.similar.closest(".section").hidden = true;
    }

    // Widget de avaliação pessoal (1 a 5, clique define, hover pré-visualiza)
    setupRateWidget();

    CineVaultUI.refreshIcons();
  } catch (err) {
    console.error("Falha ao carregar o título:", err);
    CineVaultUI.showToast("Não foi possível carregar este título.");
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupRateWidget() {
  const buttons = document.querySelectorAll(".rate-widget button");
  let current = 0;

  function paint(value) {
    buttons.forEach((btn, i) => btn.classList.toggle("is-active", i < value));
  }

  buttons.forEach((btn, index) => {
    btn.addEventListener("mouseenter", () => paint(index + 1));
    btn.addEventListener("click", () => {
      current = index + 1;
      paint(current);
      CineVaultUI.showToast(`Você avaliou este título com ${current} de 5.`);
    });
  });

  document.querySelector(".rate-widget").addEventListener("mouseleave", () => paint(current));
}