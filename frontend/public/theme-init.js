(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Portfolio default — dark cosmic theme
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
