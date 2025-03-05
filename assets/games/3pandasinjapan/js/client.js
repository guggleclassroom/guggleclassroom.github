function loadJS(FILE_URL, async = true) {
  const scriptEle = document.createElement("script");
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  document.body.appendChild(scriptEle);
}

window.addEventListener("load", function () {
  // loadJS("./js/server.js", true);
});
