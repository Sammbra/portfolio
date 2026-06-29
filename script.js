const nav = document.querySelector(".header__nav");
const navToggle = document.querySelector(".nav__toggle");
const headerMenu = nav?.querySelector(".header__menu") || null;
const navLinks = nav?.querySelectorAll(".header__menu a") || [];

const setMenuState = (isOpen) => {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.toggle("nav--open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

const isSamePageLink = (href) => {
  if (!href || href.startsWith("#")) {
    return true;
  }

  try {
    const url = new URL(href, window.location.origin);
    return url.pathname === window.location.pathname;
  } catch {
    return false;
  }
};

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("nav--open");
    setMenuState(willOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!nav.classList.contains("nav--open")) {
        return;
      }

      const href = link.getAttribute("href") || "";

      if (!isSamePageLink(href) && headerMenu) {
        headerMenu.style.transition = "none";
      }

      setMenuState(false);
    });
  });
}

if (navToggle) {
  let fixedPosition = null;

  const clearFixedPosition = () => {
    navToggle.classList.remove("nav__toggle--fixed");
    navToggle.style.top = "";
    navToggle.style.left = "";
  };

  const setFixedPosition = () => {
    if (!fixedPosition) {
      const rect = navToggle.getBoundingClientRect();
      fixedPosition = { top: rect.top, left: rect.left };
    }

    navToggle.classList.add("nav__toggle--fixed");
    navToggle.style.top = `${fixedPosition.top}px`;
    navToggle.style.left = `${fixedPosition.left}px`;
  };

  const updateToggleSticky = () => {
    if (window.scrollY > 0) {
      setFixedPosition();
      return;
    }

    fixedPosition = null;
    clearFixedPosition();
  };

  updateToggleSticky();
  window.addEventListener("scroll", updateToggleSticky, { passive: true });
  window.addEventListener("resize", () => {
    fixedPosition = null;
    updateToggleSticky();
  });
}
