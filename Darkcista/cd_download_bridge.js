/* Darkcista - Ponte de Download (ISOLATED world) */
(function(){"use strict";
  document.addEventListener("CD_ROBUST_DOWNLOAD",function(ev){
    try{var d=(ev&&ev.detail)||{};if(!d.url)return;
      chrome.runtime.sendMessage({type:"CD_DOWNLOAD",url:d.url,filename:d.filename||""});}catch(e){}
  });
})();
