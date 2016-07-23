/**
 * Created by nuintun on 2016/7/23.
 */

var $ = require('./jquery');
var Viewport = require('./viewport');

$(function (){
  var info = {};
  var nav = $('#nav');
  var navItems = nav.find('.ui-body-nav li');
  var navPlaceholder = nav.clone().removeAttr('id').empty();

  nav.find('span[data-info]').each(function (){
    var element = $(this);

    info[element.attr('data-info')] = element;
  });

  var viewport = new Viewport(window, { target: '.ui-body .ui-panel', threshold: [-500, 0, 0], delay: 0 });

  viewport.on('viewchange', function (e){
    for (var key in info) {
      info[key].text(e[key]);
    }

    var panel = e.target.shift();

    if (panel) {
      navItems.removeClass('ui-active');
      $('#' + $(panel).attr('data-ref')).addClass('ui-active');
    }
  });

  viewport = new Viewport(window, { target: '.ui-body img[data-src]' });

  viewport.on('viewchange', function (e){
    $.each(e.target, function (i, element){
      element = $(element);

      var src = element.attr('data-src');

      if (!src) return;

      element.removeAttr('data-src');
      element.addClass('ui-loading');

      $('<img />').bind('load error', { image: element, src: src }, function (event){
        var image = event.data.image;
        var src = event.data.src;

        element.removeClass('ui-loading');

        image
          .hide()
          .attr('src', src)
          .fadeIn('fast');
      }).attr('src', src);
    });
  });

  var win = $(window);

  function navFixed(){
    var scrollTop = win.scrollTop();
    var fixed = nav.hasClass('ui-nav-fixed');

    if (scrollTop >= 20 && !fixed) {
      nav.addClass('ui-nav-fixed');
      nav.after(navPlaceholder);
    } else if (scrollTop < 20 && fixed) {
      navPlaceholder.remove();
      nav.removeClass('ui-nav-fixed');
    }
  }

  win.on('scroll', navFixed);

  navFixed();
});
