/**
 * Created by nuintun on 2016/7/23.
 */

var $ = require('./jquery');
var Viewport = require('./viewport');

$(function (){
  var info = {};
  var nav = $('#nav');
  var navPlaceholder = nav.clone().removeAttr('id').empty();
  var viewport = new Viewport(window, { target: '.ui-body img[data-src]' });

  nav.find('span[data-info]').each(function (){
    var element = $(this);

    info[element.attr('data-info')] = element;
  });

  viewport.on('viewchange', function (e){
    for (var key in info) {
      info[key].text(e[key]);
    }

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
