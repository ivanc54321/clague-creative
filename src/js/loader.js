function s() {
  const loader = document.querySelector(".loader");
  if (!loader) {
    if (typeof myFade === "function") myFade();
    return;
  }

  if (localStorage.getItem("loaderPlayed") === "true") {
    loader.style.display = "none";
    if (typeof myFade === "function") {
      myFade();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }
    return;
  }

  const logo = document.querySelector(".logo-loader-gsap");
  const colors = ["#131313", "#faaafa", "#e0e055", "#8ddd8d", "#6066ee", "#FFFFFF"];

  if (!logo || typeof gsap === "undefined") {
    loader.style.display = "none";
    if (typeof myFade === "function") myFade();
    return;
  }

  setTimeout(() => {
    gsap.fromTo(
      logo,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(logo, {
            y: "-100%",
            duration: 1,
            ease: "power3.out",
            onComplete: cycleColors,
          });
        },
      }
    );
  }, 200);

  function cycleColors(index = 0) {
    if (index >= colors.length) {
      finishLoader();
      return;
    }
    gsap.to(loader, {
      backgroundColor: colors[index],
      duration: 0.2,
      ease: "power1.inOut",
      onComplete: () => {
        index < colors.length - 1
          ? setTimeout(() => cycleColors(index + 1), 300)
          : finishLoader();
      },
    });
  }

  function finishLoader() {
    gsap.to(loader, {
      y: "-100%",
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        loader.style.display = "none";
        if (typeof myFade === "function") {
          myFade();
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        }
        localStorage.setItem("loaderPlayed", "true");
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
