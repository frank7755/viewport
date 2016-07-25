/**
 * Created by nuintun on 2016/7/23.
 */

'use strict';

var $ = require('./jquery');
var Viewport = require('./viewport');

$(function (){
  var info = {};
  var nav = $('#nav');
  var navItems = nav.find('.ui-body-nav li');
  var navPlaceholder = nav.clone().removeAttr('id').empty();
  var viewport = new Viewport(window, {
    target: '.ui-body .ui-panel[data-ref]',
    threshold: [-164, 0, 0], delay: 1
  });

  viewport.on('viewchange', function (e){
    var panel = e.target.shift();

    if (panel) {
      navItems.removeClass('ui-active');
      $('#' + $(panel).attr('data-ref')).addClass('ui-active');
    }
  });

  nav.find('span[data-info]').each(function (){
    var element = $(this);

    info[element.attr('data-info')] = element;
  });

  viewport = new Viewport(window, { target: '.ui-body img[data-src]' });

  viewport.on('viewchange', function (e){
    var infoText;

    for (var key in info) {
      if (info.hasOwnProperty(key)) {
        infoText = e[key];

        if (key === 'viewport') {
          infoText = infoText.join(', ');
        }

        info[key].text(infoText);
      }
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

  var html = $('html, body');

  nav.on('click', '.ui-body-nav li', function (e){
    e.preventDefault();

    var id = this.id;
    var panel = $('[data-ref=' + id + ']');

    html.animate({
      scrollTop: panel.offset().top
    });
  });
});
