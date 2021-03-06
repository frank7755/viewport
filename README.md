# viewport

> A library for get a callback when any element becomes visible in a viewport (window or custom viewport)
>
> [![Dependencies][david-image]][david-url]

## Introduction

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

      $('<img />')
        .on('load error', { image: image, src: src }, function(event) {
          var image = event.data.image;
          var src = event.data.src;

          image
            .hide()
            .removeClass('ui-loading')
            .attr('src', src)
            .fadeIn('fast');
        })
        .attr('src', src);
    });
  });
});
```

## API

### Viewport(viewport[, options])

###### viewport - `HTMLElement|window`

> The viewport element

###### options

* _target_ - `String|jQueryElement|HTMLElement`

  > The elements want to be watched in viewport

* _threshold_ - `Number|Array`

  > With this value you can increase or decrease the threshold range viewport detection
  > The value will parsed like css margin and padding

* _skipHidden_ - `Boolean`

  > Skip hidden element in target

* _delay_ - `Number`

  > The delay of viewchange event emit frequency

* _thresholdBorderReaching_ - `Number`
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

* _type_

  > Event type, always `viewchange`

* _emitter_

  > The emitter of triggered viewchange, maybe `init|refresh|scroll|resize`

* _target_

  > The element appear into viewport now

* _offsetX_

  > The scrollbar offset x

* _offsetY_

  > The scrollbar offset y

* _scrollTop_

  > The scrollbar scroll top

* _scrollLeft_

  > The scrollbar scroll left

* _viewport_

  > The viewport size [width, height, scrollWidth, scrollHeight]

* _top_

  > Is scrollbar reached viewport top

* _right_

  > Is scrollbar reached viewport right

* _bottom_

  > Is scrollbar reached viewport bottom

* _left_
  > Is scrollbar reached viewport left

## Demo

#### [Viewport scroll spy and viewport image lazyload](https://nuintun.github.io/viewport/examples/index.html)

[david-image]: https://img.shields.io/david/dev/nuintun/viewport.svg?style=flat-square
[david-url]: https://david-dm.org/nuintun/viewport?type=dev
