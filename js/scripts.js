const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.querySelector(".close-sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

// Abrir/fechar sidebar ao clicar no botão de menu
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    document.body.classList.toggle("sidebar-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Fechar sidebar ao clicar no botão X
if (closeSidebar && sidebar) {
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
}

// Fechar sidebar ao clicar em um link
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Fechar sidebar ao clicar no backdrop
document.body.addEventListener("click", (e) => {
  if (e.target === document.body && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
// aniamç~cao
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Quando entra na tela
        entry.target.classList.add("show");
      } else {
        // Quando sai da tela (permite repetir a animação ao subir/descer)
        entry.target.classList.remove("show");
      }
    });
  },
  {
    // Ajuste o threshold para 0.2 para a animação começar
    // apenas quando 20% do card estiver visível
    // threshold: 0.1
  },
);

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
