/**
 * Helper for brickwall.
 * Easilly set focus point of a picture.
 * 
 * @author Pierre CLÉMENT <pierrecle@gmail.com>
 * @version 1.0.0 
 * @licence LGPL V3
 */
;(function($, window, document, undefined) {
    var methods = {
        init: function(options) {
            return this.each(function() {
                var $this = $(this).clone();
                $this.settings = $.extend(true, {}, $.fn.brickwallFocusPointer.defaultSettings, options || {});
                $this.settings.focusPoints.x = Math.max($this.settings.focusPoints.x, 1);
                $this.settings.focusPoints.y = Math.max($this.settings.focusPoints.y, 1);
                var width = parseInt($this.attr("width"));
                var height = parseInt($this.attr("height"));
                var pointsX = $this.settings.focusPoints.x;
                var pointsY = $this.settings.focusPoints.y;
                
                var $div = $('<div></div>');
                $div.append($this);
                $div.css({'position': 'relative', 'margin': 0, 'padding': 0});
                var focusesWidth = width/pointsX;
                var focusesHeight = height/pointsY;
                for(i = 0; i < pointsY; i++) {
                    for(j = 0; j < pointsX; j++) {
                        var $tmpDiv = $("<div></div>");
                        $tmpDiv.attr({"focus-y": j, "focus-x": i, "focus": 0});
                        $tmpDiv.css({
                            '-webkit-box-sizing': 'border-box',
                            '-moz-box-sizing': 'border-box',
                            'box-sizing': 'border-box',
                            'position': 'absolute',
                            'width': focusesWidth,
                            'height': focusesHeight,
                            'top': focusesHeight*i,
                            'left': focusesWidth*j,
                            'border': $this.settings.borderSize+' solid '+$this.settings.borderColor
                        }).on("mouseenter", function() {
                            if(parseInt($(this).attr("focus")) != 1) {
                                $(this).css("background-color", $this.settings.hoverColor);
                            }
                        }).on("mouseleave", function() {
                            if(parseInt($(this).attr("focus")) != 1) {
                                $(this).css("background-color", "transparent");
                            }
                        }).on("click", function() {
                            $(this).parent().find("div[focus=1]").attr("focus", 0).css("background-color", "transparent");
                            $(this).attr("focus", 1).css("background-color", $this.settings.selectedColor);
                            $this.settings.onPointSelected.apply($this, [$(this).attr("focus-y"), $(this).attr("focus-x")]);
                        });
                        $div.append($tmpDiv);
                    }
                }
                $(this).replaceWith($div);
                var focusY = -1;
                var focusX = -1;
                if($(this).attr("focus-y")) {
                    focusY = parseInt($(this).attr("focus-y"));
                } 
                if(focusY >= pointsY || focusY < 0) {
                    focusY = Math.floor(pointsY/2);
                }
                if($(this).attr("focus-x")) {
                    focusX = parseInt($(this).attr("focus-x"));
                } 
                if(focusX >= pointsX || focusX < 0) {
                    focusX = Math.floor(pointsX/2);
                }
                $div.find("div[focus-y="+focusY+"][focus-x="+focusX+"]").click();
            });
        }
    };

    $.fn.brickwallFocusPointer = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.brickwallFocusPointer');
        }
    };

    $.fn.brickwallFocusPointer.defaultSettings = {
    	'focusPoints': {'x': 5, 'y': 5},
        'hoverColor': 'rgba(255, 0, 0, 0.5)',
        'borderSize': '1px',
        'borderColor': '#555',
        'selectedColor': 'rgba(0, 200, 0, 0.5)',
        'onPointSelected': function(focusX, focusY) {
            alert("focus-x: "+focusX+", focus-y:"+focusY);
        }
    };
})(jQuery, window, document);