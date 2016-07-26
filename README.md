viewport
=========

>A library for get a callback when any element becomes visible in a viewport (window or custom viewport)

###Introduction
```js
'use strict';

var $ = require('jquery');
var Viewport = require('./viewport');

// image lazy load
$(function (){
  var viewport = new Viewport(window, {
    delay: 150,
    threshold: 0,
    skipHidden: true,
    thresholdBorderReaching: 0,
    target: 'img[data-src]'
  });

  viewport.on('viewchange', function (e){
    $.each(e.target, function (i, image){
      image = $(image);

      var src = image.attr('data-src');

      if (!src) return;

      image.removeAttr('data-src');
      image.addClass('ui-loading');

      $('<img />').on('load error', { image: image, src: src }, function (event){
        var image = event.data.image;
        var src = event.data.src;

        image.removeClass('ui-loading');

        image
          .hide()
          .attr('src', src)
          .fadeIn('fast');
      }).attr('src', src);
    });
  });
});
```

### API
###### options
- *mails*
> The email domain list

- *width*
> The pupup tip's width, if set ```input``` the tip's width will equal input width else the width will equal set or auto

- *onselected*
> The callback on selected a email

- *offsetTop*
> The offset top relative default position

- *offsetLeft*
> The offset left relative default position

- *zIndex*
> z-index of popup tip

###Demo
#### [Demo](https://nuintun.github.io/viewport/examples/index.html)
