/* Darkcista - Interceptor de Download (MAIN world) */
(function () {
  "use strict";
  var SIGNAL = "CD_ROBUST_DOWNLOAD";
  function toDownloadable(url){
    if(!url) return Promise.resolve(null);
    if(url.indexOf("blob:")===0||url.indexOf("data:")===0){
      return fetch(url).then(function(r){return r.blob();}).then(function(b){
        return new Promise(function(res){var fr=new FileReader();fr.onload=function(){res(fr.result);};fr.onerror=function(){res(null);};fr.readAsDataURL(b);});
      }).catch(function(){return null;});
    }
    return Promise.resolve(url);
  }
  function fnameFrom(a,url){var n="";try{n=(a&&a.getAttribute("download"))||"";}catch(e){}
    if(!n&&url){try{var u=new URL(url,location.href);n=(u.pathname.split("/").pop()||"").split("?")[0];}catch(e){}}return n||"";}
  function route(a,raw){if(!raw)return;toDownloadable(raw).then(function(p){if(!p)return;
    document.dispatchEvent(new CustomEvent(SIGNAL,{detail:{url:p,filename:fnameFrom(a,raw)}}));});}
  try{var nc=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){
    try{if(this.hasAttribute&&this.hasAttribute("download")){var h=this.href||this.getAttribute("href");if(h){route(this,h);return;}}}catch(e){}
    return nc.apply(this,arguments);};}catch(e){}
  document.addEventListener("click",function(ev){try{var a=ev.target&&ev.target.closest?ev.target.closest("a[download]"):null;
    if(a){var h=a.href||a.getAttribute("href");if(h){ev.preventDefault();ev.stopPropagation();route(a,h);}}}catch(e){}},true);
  try{var nr=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=function(u){setTimeout(function(){try{nr(u);}catch(e){}},8000);};}catch(e){}
})();
