/* ============================================================
   CINEVAULT — SETTINGS (init)
   Só roda em pages/settings.html. Sem persistência real ainda —
   troca de aba é local, "salvar" só confirma com um toast.
   ============================================================ */

window.initSettings = function initSettings() {
  const navLinks = document.querySelectorAll(".settings-nav__link[data-settings-tab]");
  const panels = document.querySelectorAll("[data-settings-panel]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.settingsTab;

      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");

      panels.forEach((p) => {
        p.hidden = p.dataset.settingsPanel !== target;
      });
    });
  });

  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", () => {
      CineVaultUI.showToast("Alterações salvas.");
    });
  });

  const deleteBtn = document.querySelector("#delete-account");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      CineVaultUI.showToast("Exclusão de conta — em breve.");
    });
  }
};
