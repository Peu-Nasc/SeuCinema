/* ============================================================
   CINEVAULT — LISTS (init)
   Só roda em pages/lists.html. Sem ?list= mostra a grade de
   listas; com ?list=<id> mostra o conteúdo daquela lista.
   ============================================================ */

window.initLists = async function initLists() {
  const params = new URLSearchParams(window.location.search);
  const listId = params.get("list");

  const overview = document.querySelector("#lists-overview");
  const detail = document.querySelector("#list-detail");

  try {
    if (listId) {
      await renderDetail(listId);
    } else {
      await renderOverview();
    }
  } catch (err) {
    console.error("Falha ao carregar as listas:", err);
    CineVaultUI.showToast("Não foi possível carregar suas listas.");
  }

  CineVaultUI.refreshIcons();

  async function renderOverview() {
    overview.hidden = false;
    detail.hidden = true;

    const lists = await CineVaultAPI.getLists();
    const grid = document.querySelector("#lists-grid");
    grid.innerHTML = "";

    lists.forEach((list) => {
      const el = document.createElement("article");
      el.className = "list-card";
      el.tabIndex = 0;
      el.setAttribute("role", "link");
      el.setAttribute("aria-label", `Abrir lista ${list.name}`);
      el.addEventListener("click", () => {
        window.location.href = `lists.html?list=${list.id}`;
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = `lists.html?list=${list.id}`;
        }
      });

      el.innerHTML = `
        <div class="list-card__preview">
          ${list.items.slice(0, 4).map(() => "<div></div>").join("")}
        </div>
        <div class="list-card__body">
          <h3 class="list-card__title"><i data-lucide="${list.icon}"></i> ${list.name}</h3>
          <p class="list-card__desc">${list.description}</p>
          <span class="list-card__count">${list.items.length} título${list.items.length === 1 ? "" : "s"}</span>
        </div>
      `;
      grid.appendChild(el);
    });

    const newCard = document.createElement("button");
    newCard.className = "list-card list-card--new";
    newCard.innerHTML = `<i data-lucide="plus" class="icon"></i><span>Criar nova lista</span>`;
    newCard.addEventListener("click", () => CineVaultUI.showToast("Criar listas — em breve."));
    grid.appendChild(newCard);
  }

  async function renderDetail(id) {
    overview.hidden = true;
    detail.hidden = false;

    const list = await CineVaultAPI.getListById(id);

    if (!list) {
      detail.innerHTML = `
        <div class="empty-state">
          <i data-lucide="folder-x"></i>
          <p>Esta lista não existe ou foi removida.</p>
        </div>
      `;
      CineVaultUI.refreshIcons();
      return;
    }

    document.title = `${list.name} — CineVault`;
    document.querySelector("#list-detail-icon").setAttribute("data-lucide", list.icon);
    document.querySelector("#list-detail-name").textContent = list.name;
    document.querySelector("#list-detail-desc").textContent = list.description;

    const grid = document.querySelector("#list-detail-grid");
    if (list.items.length) {
      CineVaultUI.renderCarousel(grid, list.items);
    } else {
      grid.innerHTML = `
        <div class="empty-state">
          <i data-lucide="film"></i>
          <p>Essa lista ainda não tem títulos.</p>
        </div>
      `;
    }
  }
};
