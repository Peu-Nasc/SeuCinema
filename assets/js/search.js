/* ============================================================
   CINEVAULT — SEARCH (init)
   Só roda em pages/search.html. Filtra e ordena no cliente;
   quando ligar TMDB, isso vira query params na chamada da API.
   ============================================================ */

window.initSearch = async function initSearch() {
  const grid = document.querySelector("#results-grid");
  const countEl = document.querySelector("#results-count");
  const searchInput = document.querySelector("#search-input");
  const typeChips = document.querySelectorAll("[data-filter-type]");
  const genreChips = document.querySelectorAll("[data-filter-genre]");
  const minRating = document.querySelector("#min-rating");
  const minRatingLabel = document.querySelector("#min-rating-label");
  const sortSelect = document.querySelector("#sort-select");
  const clearBtn = document.querySelector("#filters-clear");

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialType = params.get("type") || "todos";

  const state = { query: initialQuery, type: initialType, genre: "todos", minRating: 0, sort: "relevance" };
  
  if (initialQuery) searchInput.value = initialQuery;
  if (initialType !== "todos") {
    typeChips.forEach(c => c.classList.toggle("is-active", c.dataset.filterType === initialType));
  }

  let catalog = [];
  try {
    // Se a página já carregar com uma pesquisa na URL (ex: ?q=Vingadores), busca no TMDB
    if (state.query.trim() !== "") {
      catalog = await CineVaultAPI.searchCatalog(state.query);
    } else {
      catalog = await CineVaultAPI.getCatalog();
    }
  } catch (err) {
    console.error("Falha ao carregar o catálogo:", err);
    CineVaultUI.showToast("Não foi possível carregar o catálogo.");
  }

  function applyFilters() {
    let results = catalog.filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(state.query.toLowerCase());
      const matchesType = state.type === "todos" || item.type === state.type;
      const matchesGenre = state.genre === "todos" || item.genres.includes(state.genre);
      const matchesRating = item.rating >= state.minRating;
      return matchesQuery && matchesType && matchesGenre && matchesRating;
    });

    if (state.sort === "rating") {
      results = results.sort((a, b) => b.rating - a.rating);
    } else if (state.sort === "year") {
      results = results.sort((a, b) => b.year - a.year);
    } else if (state.sort === "title") {
      results = results.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    render(results);
  }

  function render(results) {
    countEl.innerHTML = `<strong>${results.length}</strong> título${results.length === 1 ? "" : "s"} encontrado${results.length === 1 ? "" : "s"}`;

    if (results.length === 0) {
      grid.innerHTML = "";
      grid.insertAdjacentHTML(
        "afterend",
        `<div class="empty-state" id="empty-state">
           <i data-lucide="search-x"></i>
           <p>Nenhum título encontrado com esses filtros.</p>
         </div>`
      );
    } else {
      document.querySelector("#empty-state")?.remove();
      CineVaultUI.renderCarousel(grid, results);
    }

    CineVaultUI.refreshIcons();
  }

  let searchTimeout;
  
  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    
    // Limpa o cronômetro anterior se o usuário continuar digitando
    clearTimeout(searchTimeout);
    
    // Espera 500ms após o usuário parar de digitar para chamar a API
    searchTimeout = setTimeout(async () => {
      try {
        if (state.query.trim() !== "") {
          catalog = await CineVaultAPI.searchCatalog(state.query);
        } else {
          catalog = await CineVaultAPI.getCatalog(); // Volta para os destaques se apagar o texto
        }
        applyFilters();
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }, 500); 
  });

  typeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      typeChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.type = chip.dataset.filterType;
      applyFilters();
    });
  });

  genreChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      genreChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.genre = chip.dataset.filterGenre;
      applyFilters();
    });
  });

  minRating.addEventListener("input", (e) => {
    state.minRating = Number(e.target.value);
    minRatingLabel.textContent = state.minRating.toFixed(1);
    applyFilters();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    applyFilters();
  });

  clearBtn.addEventListener("click", () => {
    state.query = "";
    state.type = "todos";
    state.genre = "todos";
    state.minRating = 0;
    state.sort = "relevance";

    searchInput.value = "";
    minRating.value = 0;
    minRatingLabel.textContent = "0.0";
    sortSelect.value = "relevance";
    typeChips.forEach((c) => c.classList.toggle("is-active", c.dataset.filterType === "todos"));
    genreChips.forEach((c) => c.classList.toggle("is-active", c.dataset.filterGenre === "todos"));

    applyFilters();
  });

  applyFilters();
};
