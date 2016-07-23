/**
 * Created by nuintun on 2016/7/23.
 */

var $ = require('./jquery');
var Viewport = require('./viewport');

$(function (){
  var viewport = new Viewport(window, { target: '.ui-body img[data-src]' });

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
});
