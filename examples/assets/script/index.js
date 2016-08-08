define("is",[],function(n,r,e){"use strict";var t=Object.prototype.toString,i={type:function(n,r){if(r=(r+"").toLowerCase(),"array"===r&&Array.isArray)return Array.isArray(n);var e=t.call(n).toLowerCase();switch(r){case"nan":return"[object number]"===e&&n!==n;default:return e==="[object "+r+"]"}},string:function(n){return i.type(n,"string")},array:function(n){return i.type(n,"array")},number:function(n){return i.type(n,"number")},nan:function(n){return i.number(n)&&n!==n},infinite:function(n){return n===1/0||n===-(1/0)},element:function(n){return void 0!==n&&"undefined"!=typeof HTMLElement&&n instanceof HTMLElement&&1===n.nodeType}};e.exports=i});define("viewport",["./is","jquery"],function(e,t,r){"use strict";function n(e,t){if(!s.number(e)||s.nan(e)||s.infinite(e))if(s.array(e)){for(var r,n=[],i=e.length,o=0;o<i&&n.length<4;o++)r=e[o],!s.number(r)||s.nan(r)||s.infinite(r)||n.push(t?Math.abs(r):r);switch(n.length){case 0:e=[0,0,0,0];break;case 1:e=[n[0],n[0],n[0],n[0]];break;case 2:e=[n[0],n[1],n[0],n[1]];break;case 3:e=[n[0],n[1],n[2],n[1]];break;default:e=n}}else e=[0,0,0,0];else t&&(e=Math.abs(e)),e=[e,e,e,e];return e}function i(e){return e===window?"CSS1Compat"===document.compatMode?document.documentElement:document.body:e}function o(e,t){if(window!==window&&s.element(e))throw new Error("Viewport must be window or a HTMLElement");var r=this;r.events={},r.id=a++,r.viewport=l(e),r.__viewport=l(i(e)),r.__initOptions(t),r.__findTarget(),r.__init()}var s=e("./is"),l=e("jquery"),a=0;o.prototype={__initOptions:function(e){e=l.extend({delay:150,target:null,threshold:0,skipHidden:!0,thresholdBorderReaching:0},e);var t=e.delay;t=!s.number(t)||s.nan(t)||s.infinite(t)?0:Math.abs(t),e.delay=t,e.threshold=n(e.threshold),e.thresholdBorderReaching=n(e.thresholdBorderReaching,!0),this.options=e},__findTarget:function(){var e=this,t=e.options,r=t.target,n=e.__viewport;r=s.string(r)?n.find(r):s.element(r)&&l.contains(n[0],r)?l(r):r instanceof l?r.filter(function(){return l.contains(n[0],this)}):null,e.target=r},__filterTargetInViewport:function(e,t){var r=[],n=this,i=n.target;if(!(i instanceof l)||0===i.length)return r;var o=n.options,s=o.threshold,a=o.skipHidden,c=0,f=0,h=n.viewport;if(h[0]!==window){var p=h[0].getBoundingClientRect();c=p.top+(Math.round(parseFloat(h.css("border-top-width")))||0),f=p.left+(Math.round(parseFloat(h.css("border-left-width")))||0)}return i.each(function(n,i){var o=i.getBoundingClientRect();if(0==o.top&&0==o.bottom&&0==o.left&&0==o.right)a||r.push(i);else{var l=o.top-c,h=o.bottom-c,p=o.left-f,d=o.right-f;l-s[2]>=t||d+s[3]<=0||h+s[0]<=0||p-s[1]>=e||r.push(i)}}),r},__changeViewport:function(e,t,r){var n=this,i=n.options,o=n.viewport,s=n.__viewport,l=i.thresholdBorderReaching;if(o[0]===window||o.is(":visible")){var a=o.innerWidth(),c=o.innerHeight(),f=s[0].scrollWidth,h=s[0].scrollHeight,p={};return p.scrollTop=o.scrollTop(),p.scrollLeft=o.scrollLeft(),p.offsetY=p.scrollTop-t,p.offsetX=p.scrollLeft-r,p.emitter=e,p.type="viewchange",p.viewport=[a,c,f,h],p.target=n.__filterTargetInViewport(a,c),p.top=p.scrollTop-l[0]<=0,p.right=a+p.scrollLeft+l[1]>=f,p.bottom=c+p.scrollTop+l[2]>=h,p.left=p.scrollLeft-l[3]<=0,n.emit(p.type,p),p}},__init:function(){function e(e){var t=r.__changeViewport(e.type,s,l);t&&(s=t.scrollTop,l=t.scrollLeft)}var t,r=this,n=r.id,i=r.options,o=r.viewport,s=o.scrollTop(),l=o.scrollLeft(),a=".viewport-"+n;if(i.delay){var c;t=function(t){clearTimeout(c),c=setTimeout(function(){e(t)},i.delay)}}else t=e;o.on("scroll"+a+" resize"+a,t),r.__changeViewport("init",s,l)},on:function(e,t){var r=this;return r.events[e]=r.events[e]||l.Callbacks("memory stopOnFalse"),r.events[e].add(t),r},off:function(e,t){var r=this;switch(arguments.length){case 0:r.events={};break;case 1:delete r.events[e];break;default:r.events[e]&&r.events[e].remove(t)}return r},emit:function(e){var t=this,r=[].slice.call(arguments,1);return t.events[e]=t.events[e]||l.Callbacks("memory stopOnFalse"),this.events[e].fireWith(t,r),t},refresh:function(e){var t=this,r=t.viewport;return arguments.length&&s.type(e,"object")&&t.__initOptions(l.extend(t.options,e)),t.__findTarget(),t.__changeViewport("refresh",r.scrollTop(),r.scrollLeft()),t},destroy:function(){var e=this,t=e.viewport,r=".viewport-"+e.id;t.off("scroll"+r),t.off("resize"+r)}},r.exports=o});define("index",["./jquery","./viewport"],function(a,t,e){"use strict";var i=a("./jquery"),r=a("./viewport");i(function(){function a(){var a=s.scrollTop(),t=e.hasClass("ui-nav-fixed");a>=20&&!t?(e.addClass("ui-nav-fixed"),e.after(o)):a<20&&t&&(o.remove(),e.removeClass("ui-nav-fixed"))}var t={},e=i("#nav"),n=e.find(".ui-body-nav li"),o=e.clone().removeAttr("id").empty(),d=new r(window,{target:".ui-body .ui-panel[data-ref]",threshold:[-164,0,0],delay:1});d.on("viewchange",function(a){var t=a.target.shift();t&&(n.removeClass("ui-active"),i("#"+i(t).attr("data-ref")).addClass("ui-active"))}),e.find("span[data-info]").each(function(){var a=i(this);t[a.attr("data-info")]=a}),d=new r(window,{target:".ui-body img[data-src]"}),d.on("viewchange",function(a){var e;for(var r in t)t.hasOwnProperty(r)&&(e=a[r],"viewport"===r&&(e=e.join(", ")),t[r].text(e));i.each(a.target,function(a,t){t=i(t);var e=t.attr("data-src");e&&(t.removeAttr("data-src"),t.addClass("ui-loading"),i("<img />").on("load error",{image:t,src:e},function(a){var t=a.data.image,e=a.data.src;t.hide().removeClass("ui-loading").attr("src",e).fadeIn("fast")}).attr("src",e))})});var s=i(window);s.on("scroll",a),a();var v=i("html, body");e.on("click",".ui-body-nav li",function(a){a.preventDefault();var t=this.id,e=i("[data-ref="+t+"]");v.animate({scrollTop:e.offset().top})})})});