let loaderInitialized = false;
let fadeExecuted = false;
let fadeAttempts = 0;

function revealFadeElementsFallback() {
  fadeExecuted = true;
  const elements = document.querySelectorAll(
    "[fade-up], [fade-nav], [fade-up-hero-delay], .tricksword, [fade-right], [fade-left]"
  );
  elements.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  const pageWrapper = document.querySelector(".page-wrapper");
  if (pageWrapper) {
    pageWrapper.style.opacity = "1";
  }
}

function triggerMyFade() {
  if (fadeExecuted) return;
  if (typeof window.myFade === "function") {
    fadeExecuted = true;
    try {
      window.myFade();
    } catch (e) {
      console.warn("Error running myFade, using fallback:", e);
      revealFadeElementsFallback();
    }
    if (typeof ScrollTrigger !== "undefined") {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  } else if (fadeAttempts < 20) {
    fadeAttempts++;
    setTimeout(triggerMyFade, 50);
  } else {
    // Safety fallback: reveal all content after 1s if myFade wasn't attached
    revealFadeElementsFallback();
  }
}

function s() {
  if (loaderInitialized) return;
  loaderInitialized = true;

  const loader = document.querySelector(".loader");
  if (!loader) {
    triggerMyFade();
    return;
  }

  // Safety fallback: ensure loader never blocks the page for more than 2 seconds
  setTimeout(() => {
    if (loader && loader.style.display !== "none") {
      loader.style.display = "none";
      triggerMyFade();
    }
  }, 2000);

  if (localStorage.getItem("loaderPlayed") === "true") {
    loader.style.display = "none";
    triggerMyFade();
    return;
  }

  localStorage.setItem("loaderPlayed", "true");
  const logo = document.querySelector(".logo-loader-gsap");
  const logoWrapper = document.querySelector(".loader__logo");
  const colors = ["#131313", "#faaafa", "#e0e055", "#8ddd8d", "#6066ee", "#FFFFFF"];

  if (!logo || typeof gsap === "undefined") {
    loader.style.display = "none";
    triggerMyFade();
    return;
  }

  if (logoWrapper) {
    gsap.set(logoWrapper, { y: 0 });
  }

  gsap.fromTo(
    logo,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        gsap.to(logo, {
          y: "-100%",
          duration: 0.3,
          ease: "power3.out",
          onComplete: () => cycleColors(0),
        });
      },
    }
  );

  function cycleColors(index = 0) {
    if (index >= colors.length) {
      finishLoader();
      return;
    }
    gsap.to(loader, {
      backgroundColor: colors[index],
      duration: 0.08,
      ease: "power1.inOut",
      onComplete: () => {
        index < colors.length - 1
          ? setTimeout(() => cycleColors(index + 1), 60)
          : finishLoader();
      },
    });
  }

  function finishLoader() {
    triggerMyFade();
    gsap.to(loader, {
      y: "-100%",
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        loader.style.display = "none";
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      },
    });
  }
}

function i(e = false) {
  const t = document.querySelector(".page-wrapper");
  if (!t || typeof gsap === "undefined") return Promise.resolve();
  return e
    ? (gsap.set(t, { opacity: 1, y: 0 }), Promise.resolve())
    : gsap.to(t, { opacity: 0, y: 50, duration: 1, ease: "power2.inOut" });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const t = e.target.closest("a");
    if (t) {
      const o = t.getAttribute("href");
      if (
        o &&
        (o.startsWith("/") ||
          o.includes("/projets") ||
          o.includes("/offres") ||
          o.includes("/blog"))
      ) {
        if (!o.startsWith("#") && !o.startsWith("http://") && !o.startsWith("https://")) {
          e.preventDefault();
          i().then(() => {
            window.location.href = o;
          });
        }
      }
    }
  });

  window.addEventListener("popstate", () => {
    i(true);
  });
});

function init() {
  s();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.onpageshow = function (e) {
  const t = document.querySelector(".page-wrapper");
  if (t && typeof gsap !== "undefined") {
    gsap.set(t, { opacity: 1, y: 0 });
  }
};

export { s as i };
