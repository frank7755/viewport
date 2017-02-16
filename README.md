viewport
=========

>A library for get a callback when any element becomes visible in a viewport (window or custom viewport)

##Introduction
```js
// image lazy load
$(function() {
  var viewport = new Viewport(window, {
    delay: 150,
    threshold: 0,
    skipHidden: true,
    thresholdBorderReaching: 0,
    target: 'img[data-src]'
  });

  viewport.on('viewchange', function(e) {
    $.each(e.target, function(i, image) {
      image = $(image);

      var src = image.attr('data-src');

      if (!src) return;

      image.removeAttr('data-src');
      image.addClass('ui-loading');

      $('<img />').on('load error', { image: image, src: src }, function(event) {
        var image = event.data.image;
        var src = event.data.src;

        image
          .hide()
          .removeClass('ui-loading')
          .attr('src', src)
          .fadeIn('fast');
      }).attr('src', src);
    });
  });
});
```

## API
### Viewport(viewport[, options])
###### viewport - ```HTMLElement|window```
> The viewport element

###### options
- *target* - ```String|jQueryElement|HTMLElement```
> The elements want to be watched in viewport

- *threshold* - ```Number|Array```
> With this value you can increase or decrease the threshold range viewport detection
> The value will parsed like css margin and padding

- *skipHidden* - ```Boolean```
> Skip hidden element in target

- *delay* - ```Number```
> The delay of viewchange event emit frequency

- *thresholdBorderReaching* - ```Number```
> With this value you can increase or decrease the threshold range viewport border reaching detection
> The value will parsed like css margin and padding but only accept positive number

### Method
###### on
> Add a event listener

###### off
> Remove a event listener

###### emit(event[, data])
> Trigger a event

###### refresh([options])
> Refresh viewport

###### destroy()
> Destroy viewport


### Event
###### viewchange
> When viewport on scroll and resize, it will emit viewchange event

### Event Data
- *type*
> Event type, always ```viewchange```

- *emitter*
> The emitter of triggered viewchange, maybe ```init|refresh|scroll|resize```

- *target*
> The element appear into viewport now

- *offsetX*
> The scrollbar offset x

- *offsetY*
> The scrollbar offset y

- *scrollTop*
> The scrollbar scroll top

- *scrollLeft*
> The scrollbar scroll left

- *viewport*
> The viewport size [width, height, scrollWidth, scrollHeight]

- *top*
> Is scrollbar reached viewport top

- *right*
> Is scrollbar reached viewport right

- *bottom*
> Is scrollbar reached viewport bottom

- *left*
> Is scrollbar reached viewport left

##Demo
#### [Viewport scroll spy and viewport image lazyload](https://nuintun.github.io/viewport/examples/index.html)
