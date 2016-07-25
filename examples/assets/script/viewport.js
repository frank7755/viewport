define("viewport",["./is","jquery"],function(e,t,r){"use strict";function o(e,t){if(!s.number(e)||s.nan(e)||s.infinite(e))if(s.array(e)){for(var r,o=[],n=e.length,i=0;i<n&&o.length<4;i++)r=e[i],!s.number(r)||s.nan(r)||s.infinite(r)||o.push(t?Math.abs(r):r);switch(o.length){case 0:e=[0,0,0,0];break;case 1:e=[o[0],o[0],o[0],o[0]];break;case 2:e=[o[0],o[1],o[0],o[1]];break;case 3:e=[o[0],o[1],o[2],o[1]];break;default:e=o}}else e=[0,0,0,0];else t&&(e=Math.abs(e)),e=[e,e,e,e];return e}function n(e){return e===window?"CSS1Compat"===document.compatMode?document.documentElement:document.body:e}function i(e,t){if(window!==window&&s.element(e))throw new Error("Viewport must be window or a HTMLElement");var r=this;r.events={},r.id=a++,r.viewport=l(e),r.__viewport=l(n(e)),r.__initOptions(t),r.__findTarget(),r.__init()}var s=e("./is"),l=e("jquery"),a=0;i.prototype={__initOptions:function(e){e=l.extend({delay:150,target:null,threshold:0,skipHidden:!0,thresholdBorderReaching:0},e),e.delay=Math.max(0,e.delay),e.threshold=o(e.threshold),e.thresholdBorderReaching=o(e.thresholdBorderReaching,!0),this.options=e},__findTarget:function(){var e=this,t=e.options,r=t.target,o=e.__viewport;r=s.string(r)?o.find(r):s.element(r)&&l.contains(o[0],r)?l(r):r instanceof l?l.grep(r,function(e){return l.contains(o[0],e)}):null,e.target=r},__filterTargetInViewport:function(e,t){var r=[],o=this,n=o.target;if(null===n)return r;var i=o.options,s=i.threshold,l=i.skipHidden,a=0,c=0,f=o.viewport;if(f[0]!==window){var h=f[0].getBoundingClientRect();a=h.top+(Math.round(parseFloat(f.css("border-top-width")))||0),c=h.left+(Math.round(parseFloat(f.css("border-left-width")))||0)}return n.each(function(o,n){var i=n.getBoundingClientRect();if(0==i.top&&0==i.bottom&&0==i.left&&0==i.right)l||r.push(n);else{var f=i.top-a,h=i.bottom-a,p=i.left-c,d=i.right-c;f-s[2]>=t||d+s[3]<=0||h+s[0]<=0||p-s[1]>=e||r.push(n)}}),r},__changeViewport:function(e,t,r){var o=this,n=o.options,i=o.viewport,s=o.__viewport,l=n.thresholdBorderReaching;if(i[0]===window||i.is(":visible")){var a=i.innerWidth(),c=i.innerHeight(),f=s[0].scrollWidth,h=s[0].scrollHeight,p={};return p.scrollTop=i.scrollTop(),p.scrollLeft=i.scrollLeft(),p.offsetY=p.scrollTop-t,p.offsetX=p.scrollLeft-r,p.emitter=e,p.type="viewchange",p.viewport=[a,c,f,h],p.target=o.__filterTargetInViewport(a,c),p.top=p.scrollTop-l[0]<=0,p.right=a+p.scrollLeft+l[1]>=f,p.bottom=c+p.scrollTop+l[2]>=h,p.left=p.scrollLeft-l[3]<=0,o.emit(p.type,p),p}},__init:function(){function e(e){var t=r.__changeViewport(e.type,s,l);t&&(s=t.scrollTop,l=t.scrollLeft)}var t,r=this,o=r.id,n=r.options,i=r.viewport,s=i.scrollTop(),l=i.scrollLeft(),a=".viewport-"+o;if(n.delay){var c;t=function(t){clearTimeout(c),c=setTimeout(function(){e(t)},n.delay)}}else t=e;i.on("scroll"+a+" resize"+a,t),r.__changeViewport("init",s,l)},on:function(e,t){var r=this;return r.events[e]=r.events[e]||l.Callbacks("memory stopOnFalse"),r.events[e].add(t),r},off:function(e,t){var r=this;switch(arguments.length){case 0:r.events={};break;case 1:delete r.events[e];break;default:r.events[e]&&r.events[e].remove(t)}return r},emit:function(e){var t=this,r=[].slice.call(arguments,1);return t.events[e]=t.events[e]||l.Callbacks("memory stopOnFalse"),this.events[e].fireWith(t,r),t},refresh:function(e){var t=this,r=t.viewport;return arguments.length&&s.type(e,"object")&&t.__initOptions(l.extend(t.options,e)),t.__findTarget(),t.__changeViewport("refresh",r.scrollTop(),r.scrollLeft()),t},destroy:function(){var e=this,t=e.viewport,r=".viewport-"+e.id;t.off("scroll"+r),t.off("resize"+r)}},r.exports=i});