// ubg235 Server
ubg235Server= function() {
  const REDIRECT_GUIDE= {
    
  }
  
  let loadJS= function(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");
  
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  
  document.body.appendChild(scriptEle);
  
  // Success
  scriptEle.addEventListener("load", () => {
    console.log("URL loaded!");
  });
  
   // Error
  scriptEle.addEventListener("error", () => {
    console.log("URL load error!");
  });
  }
  
  
  let isInFrame= function () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }
  
  
  let isBotBrowser= function() {
  try {
    return navigator.webdriver
  } catch (e) {
      return true;
  }
  }
  

  if (!isInFrame() && !isBotBrowser()) {
    for (const [game, page] of Object.entries(REDIRECT_GUIDE)) {
        console.log(`${game} => ${page}`);
        if (window.location.href.indexOf(game)> 0) {
            // page_url= `https://ub.games235.com/${page}.html`;
            page_url= page;
            page_url= page_url.replace("(html5)", "https://ubg98.github.io/");
            page_url= page_url.replace("(unity)", "https://ubg44.github.io/");
            page_url= page_url.replace("(flash)", "https://ubg89.github.io/");
            page_url= page_url.replace("(io)", "https://ubg17.github.io/");            
            if (page_url.indexOf(".html")< 0) {
              page_url+= ".html";
            }
            window.location= page_url;
            break;
        }
    }
  }
  
  
  let screenWidth= window.screen.width;
  let screenHeight= window.screen.height;
  let webURL= "https://ubg235.pages.dev/na/";
  try {
    webURL= window?.top?.location?.href;
  } catch (e) {}
  let frameURL= window.location.href;
  let own_site= true;
  let need_log= false;

  if (own_site && webURL.indexOf("-unblockedz.html")> -1) {
    need_log= true;
  }
  if (!own_site) {
    need_log= true;
  }
  
  if (need_log) {
    loadJS(`https://ubg235.pages.dev/logs/?w=${screenWidth}&h=${screenHeight}&l=${encodeURIComponent(frameURL)}&p=${encodeURIComponent(webURL)}`, false);
  }
}

ubg235Server();
