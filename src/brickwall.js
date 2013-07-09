/**
 * Display picture gallery like a brick wall, smarter.
 * It allows you to set the focus point of your picture, this point will always be displayed.
 * 
 * @author Pierre CLÉMENT <pierrecle@gmail.com>
 * @version 1.0.0 
 * @licence LGPL V3
 */
;(function($, window, document, undefined) {
	/**
	 * Apply CSS rules to the grid.
	 */
	function applyGridCss() {
		var $this = this;

		$this.elts.css({"display": "block", "float": "left", "margin": $this.settings.margin, "overflow": "hidden"});
	}

	/**
	 * Defines object's attributes:
	 *    - elts: DOM Elements of the elements wrapper (li)
	 *    - imgs: DOM Elements, the images
	 *    - hideImages: whether the images has to be hidden when resizing
	 */
	function setAttributes() {
        var $this = this;
    	$this.elts = $this.find('> *');
    	$this.imgs = $this.elts.find('img');
    	$this.hideImages = true;
	}

	/**
	 * Compute the height of the line (ie smallest height of images).
	 */
	function computeLineHeight() {
        var $this = this;
        var min = 1000000;
        $this.imgs.each(function(i, element) {
        	var height = parseInt($(element).attr("height"));
        	if(height < min) {
        		min = height;
        	}
        });
        return min;
	}

	/**
	 * Defines objects lines attribute, the lines of the grid.
	 * Also define the available width and the height of a line.
	 */
	function setWallLines() {
		var $this = this;

		$this.lineWidth = $this.innerWidth();
		if($this.settings.lineHeight == "auto") {
			$this.lineHeight = computeLineHeight.apply($this);
		}
		else {
			$this.lineHeight = $this.settings.lineHeight;
		}
		$this.elts.height($this.lineHeight);

		// Compute lines
		$this.lines = [{width: 0, elements: []}];
		var curLine = 0;
		$this.elts.each(function(i, element){
			var $img = $(element).find('img');
			var imgWidth = parseInt($img.attr("width"));
			var totalImgLength = imgWidth + $this.settings.margin*2;
			if(imgWidth >= $this.lineWidth || $this.lines[curLine].width + totalImgLength > $this.lineWidth) {
				curLine ++;
				$this.lines.push({width: totalImgLength, elements: []});
			}
			else {
				$this.lines[curLine].width += totalImgLength;
			}
			$this.lines[curLine].elements.push(element);
		});
		// Compute missing length
		for(i = 0; i < $this.lines.length; i++) {
			$this.lines[i].missing = $this.lineWidth - $this.lines[i].width;
		}
		$this.lines[$this.lines.length - 1].missing = $this.settings.resizeLast ? $this.lines[$this.lines.length - 1].missing : 0;
	}

	/**
	 * Update the grid.
	 */
	function update() {
	    var $this = this;
		setWallLines.apply($this);

		var style = $this.hideImages ? "opacity: 0" : "";
	    $this.imgs.attr("style", style);

		$this.imgs.height($this.lineHeight);
		for(var i = 0; i < $this.lines.length; i++) {
			var line = $this.lines[i];
			for(var j = 0; j < line.elements.length; j++) {
				resize.apply($this, [$this.lines[i].elements[j], line]);
			}
		}

		if($this.hideImages) {
			if($this.settings.progressiveDisplay) {
				progressiveDisplay.apply($this);
			}
			else {
				$this.imgs.animate({"opacity": 1}, $this.settings.displayTime);
			}
		}
	}

	/**
	 * @param Object elt The element in the line.
	 * @param Array line The line of the element in the grid.
	 */
	function resize(elt, line) {
		var $this = this;
		var $elt = $(elt);
		var $img = $elt.find('img');
		var initWidth = parseInt($img.attr("width"));
		var initHeight = parseInt($img.attr("height"));
		var focusY = -1;
        var focusX = -1;
        var focusPointsY = $this.settings.focusPoints.y;
        var focusPointsX = $this.settings.focusPoints.x;
		if($img.attr("focus-y")) {
			focusY = parseInt($img.attr("focus-y"));
		}
       	if(focusY >= focusPointsY|| focusY < 0) {
        	focusY = Math.floor(focusPointsY/2);
    	}
        if($img.attr("focus-x")) {
            focusX = parseInt($img.attr("focus-x"));
        } 
        if(focusX >= focusPointsX || focusX < 0) {
            focusX = Math.floor(focusPointsX/2);
        }

		// Resize the image
		var ratio = 1;
		var finalWidth = ($this.lineWidth - $this.settings.margin*2);
		// Image larger than line
		if(line.missing < 0) {
			ratio = initWidth / finalWidth;
		}
		else {
			finalWidth = initWidth + line.missing*((initWidth+$this.settings.margin*2)/line.width);
			ratio = finalWidth / initWidth;
		}
		// Firefox round pixels and can cause undesired line-breaks, so, let's floor
		$elt.width(Math.floor(finalWidth));
		$img.width(initWidth*ratio).height(initHeight*ratio);

		// Focus point
		var marginTop = (initHeight*ratio) - $this.lineHeight;
		var marginLeft = (initWidth*ratio) - $this.finalWidth;

		marginTop = - (marginTop * (focusY/Math.max(focusPointsY, 1)));
		marginLeft = - (marginLeft * (focusX/Math.max(focusPointsX, 1)));
		$img.css({"margin-top": marginTop, "margin-left": marginLeft});
	}

	/**
	 * Display lines progressively.
	 */
	function progressiveDisplay() {
	    var $this = this;
	    var delay = $this.settings.waiting;
	    var fadeTime = $this.settings.displayTime;
	    for(curLine = 0; curLine < $this.lines.length; curLine++) {
	    	var $imgs = $($this.lines[curLine].elements).find('img');
	    	$imgs.delay(curLine*delay).animate({"opacity": 1}, fadeTime);
		}
	}

	/**
	 * Function to call for window resize event
	 */
	function onWindowResize() {
		var $this = this;

		$this.hideImages = false;
		update.apply($this);
		$this.hideImages = true;
	}

    var methods = {
        init: function(options) {
            return this.each(function() {
                var $this = $(this);
                $this.settings = $.extend(true, {}, $.fn.brickwall.defaultSettings, options || {});
                $this.settings.focusPoints.x = Math.max($this.settings.focusPoints.x, 1);
                $this.settings.focusPoints.y = Math.max($this.settings.focusPoints.y, 1);
                $this.data("brickwallSettings", $this.settings);

	        	setAttributes.apply($this);

	        	if($this.hideImages) {
	        		$this.imgs.attr("style", "opacity: 0");
	        	}
	        	if($this.settings.lineHeight != 'auto') {
	        		$this.imgs.height($this.settings.lineHeight);
	        	}
				applyGridCss.apply($this);
				update.apply($this);

				if($this.settings.updateOnWindowResize) {
					$(window).resize(function(){ onWindowResize.apply($this) });
				}
            });
        },
        update: function() {
            return this.each(function() {
            	var $this = $(this);
            	$this.settings = $this.data("brickwallSettings");

            	setAttributes.apply($this);
				applyGridCss.apply($this);
            	$this.hideImages = false;
                update.apply($this);
            });
        }
    };

    $.fn.brickwall = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.brickWall');
        }
    };

    $.fn.brickwall.defaultSettings = {
    	'focusPoints': {'x': 5, 'y': 5},
        'progressiveDisplay': true,
        'displayTime': 500,
        'waiting': 100,
        'updateOnWindowResize': true,
        'lineHeight': 'auto',
        'margin': 3,
        'resizeLast': true
    };
})(jQuery, window, document);