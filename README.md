# brickwall #

jQuery plugin to display image gallery as a brickwall, smarter.
Your images will be display like Google image or Flickr, ie every images will have the same height.
All the available width will be used. 

## Smarter? ##

To obtain that kind of result, your images will be resized and some parts of pictures can be hidden if necessary.
In most image, a part is more important than the rest of the picture. This plugin insure you to always display this point, called focus point in the plugin.

## Bonus ##

If you take a look at the source directory, you will see another jQuery plugin (brickwallFocusPointer). It will help you to choose the focus point of your pictures.
See the demo for more details.

## Licence ##

LGPL V3 (you, this is for glory only ;))

## Authors and Contributors ##
Pierre CLÉMENT <pierrecle@gmail.com>.

## Demos ##

# Documentation #

## brickwall ##

### HTML prerequisites ###

Your "wall" must be in a defined element. Each "brick" of the wall must be a child element of the wall. Finally just add your image in the "brick" or any "brick" child. The basic structure is a list (ul/li/img), but it *should* work with every structure.
**Last thing,** your image must have their width and height attributes with the good values.

**Samples of structure that works:**

```html
<ul>
    <li><img src="picture1.jpg" width="500" height="300" alt="Picture 1"/></li>
    <li><img src="picture2.jpg" width="200" height="200" alt="Picture 2"/></li>
</ul>
```

```html
<ul>
     <li><a href="#"><img src="picture1.jpg" width="500" height="300" alt="Picture 1"/></a></li>
     <li><a href="#"><img src="picture2.jpg" width="200" height="200" alt="Picture 2"/></a></li>
</ul>
```

```html
<div>
     <a href="#"><img src="picture1.jpg" width="500" height="300" alt="Picture 1"/></a>
     <a href="#"><img src="picture2.jpg" width="200" height="200" alt="Picture 2"/></a>
</div>
```

### CSS prerequisites ###

Nothing.

### API documentation ###

#### Options ####

- **focusPoints**: *Object; default: {x: 5, y: 5}* The number of elements to define the focus points grid.
- **progressiveDisplay**: *bool; default true* If at start the lines are displayed one after the other.
- **displayTime**: *int; default: 500* The time of the line display animation.
- **waiting**: *int; default: 100* The time to wait until start the next line display animation.
- **updateOnWindowResize**: *bool; default: true* Whether the wall must be updated on window resize or not.
- **lineHeight**: *'auto'|int; default: 'auto'* The height of the lines (same for every lines). If auto, the height will be the smallest height of images.
- **margin**: *int; default: 3* The margin around each image.
- **resizeLast**: *bool; default: true* Whether the last line must be resized or not.

#### Methods ####

- **update**: Updates the wall (compute new lines, sizes and resize images).

#### Usage ####

Just a basic example on how to use brickwallFocusPointer:

```javascript
$('img').brickwall();
```

To use update:

```javascript
$('img').brickwall("update");
```

## brickwallFocusPointer ##

### HTML prerequisites ###

Only an image with defined width and height:

```html
<img src="photo.jpg" width="500" height="300" />
```

### CSS prerequisites ###

Nothing.

### API documentation ###

#### Options ####

- **focusPoints**: *Object; default: {x: 5, y: 5}* The number of elements to define the focus points grid.
- **hoverColor**: *string; default: rgba(255, 0, 0, 0.5)* The color of the point when the mouse is hover.
- **borderSize**: *string; default: 1px* The size of the border of each element of the focus grid.
- **borderColor**: *string; default: #555* Color of the border of each element of the focus grid.
- **selectedColor**: *string; default: rgba(0, 200, 0, 0.5)* The color of the point when it's selected as the focus point.
- **onPointSelected**: *function; default function(focusX, focusY) { alert("focus-x: "+focusX+", focus-y:"+focusY); }* The function called when a point is selected.

### Usage ###

Just a basic example on how to use brickwallFocusPointer:

```javascript
$('img').brickwallFocusPointer();
```

See the demo for a more advanced sample.

Todo/planned
============

- [X] update the wall (if images are added etc.)
- [ ] infinite scroll?