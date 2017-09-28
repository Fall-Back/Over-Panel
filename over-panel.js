/*!
    Fall-Back Over-Panel v2.0.0
    https://github.com/Fall-Back/Over-Panel
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }


    /* From Modernizr */
    var whichTransitionEvent = function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

	var over_panel = {

        init: function() {
            var over_panels = document.querySelectorAll('.over-panel');
            var over_panel_js_classname           = 'js-over-panel';
            var over_panel_control_js_classname   = 'js-over-panel-control';
            var over_panel_is_open_classname      = 'js-over-panel_is-open';
            var over_panel_is_animating_classname = 'js-over-panel_is-animating';

            var transitionEvent = whichTransitionEvent();

            // Note that `getComputedStyle` on psuedo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the unenhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(over_panels[0], ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );

            if (css_is_loaded) {
                Array.prototype.forEach.call(over_panels, function(over_panel, i) {


                    // Find corresponding controls:
                    var over_panel_id = over_panel.getAttribute('id');
                    var over_panel_control = document.querySelector('[aria-controls="' + over_panel_id + '"]');

                    // Check we've got a corresponding control. If not we can't proceed so skip:
                    if (!over_panel_control) {
                        return;
                    }

                    // Add the JS class names ...
                    // ... to the panel: ...
                    if (over_panel.classList) {
                        over_panel.classList.add(over_panel_js_classname);
                    } else {
                        over_panel.className += ' ' + over_panel_js_classname;
                    }
                    // ... and the control:
                    if (over_panel_control.classList) {
                        over_panel_control.classList.add(over_panel_control_js_classname);
                    } else {
                        over_panel_control.className += ' ' + over_panel_control_js_classname;
                    }

                    // Main toggle button:
                    over_panel_control.addEventListener('click', function() {
                        
                        if (over_panel.classList) {
                            over_panel.classList.add(over_panel_is_animating_classname);
                        } else {
                            over_panel.className += ' ' + over_panel_is_animating_classname;
                        }

                        // Invert the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Toggle the `is_open` class:
                        if (!expanded) {
                            if (over_panel.classList) {
                                over_panel.classList.add(over_panel_is_open_classname);
                            } else {
                                over_panel.className += ' ' + over_panel_is_open_classname;
                            }
                        } else {
                            if (over_panel.classList) {
                                over_panel.classList.remove(over_panel_is_open_classname);
                            } else {
                                over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_open_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                            }
                        }

                        // Set the focus to the first link if submenu newly opened:
                        /*if (!expanded) {
                        var first_link = document.querySelector('#' + button_id + '--target .subnav__link');
                        first_link.focus();
                        }*/

                    });

                    // Remove `animating` class at transition end.

                    transitionEvent && over_panel.addEventListener(transitionEvent, function() {
                        if (over_panel.classList) {
                            over_panel.classList.remove(over_panel_is_animating_classname);
                        } else {
                            console.log('Animation ended');
                            over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_animating_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                        }
                    });
                    
                    
                    // Focus trap inspired by:
					// http://heydonworks.com/practical_aria_examples/progressive-hamburger.html
                    var over_panel_contents = over_panel.querySelector('.over-panel__contents');
                    var links               = over_panel_contents.querySelectorAll('a');
                    var first_link          = links[0];
                    var last_link           = links[links.length - 1];
                    
                    // At end of navigation block, return focus to navigation menu button                   
                    last_link.addEventListener('keydown', function(e) {
                        if (e.keyCode === 9 && !e.shiftKey) {
							e.preventDefault();
							over_panel_control.focus();
                        }
                    });

                    // At start of navigation block, refocus close button on SHIFT+TAB
                    over_panel_control.addEventListener('keydown', function(e) {
                        if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && e.shiftKey) {
                            e.preventDefault();
                            last_link.focus();
                        }
                    });
                    
                    /*first_link.addEventListener('keydown', function(e) {
                        if (e.keyCode === 9) {
                            if (e.shiftKey) {
                                e.preventDefault();
                                over_panel_control.focus();
                            }
                        }
                    });*/

                    // If the menu is visible, always TAB into it from the menu button
                    /*over_panel_control.addEventListener('keydown', function(e) {
                        if (e.keyCode === 9) {
                            if (this.getAttribute('aria-expanded') == 'true') {
                                if (!e.shiftKey) {
                                    e.preventDefault();
                                    first_link.focus();
                                }
                            }/* else {
                                if (e.shiftKey) {
                                    e.preventDefault();
                                    first_link.focus();
                                }
                            }*
                        }
                    });*/
                    
                    
                    /*
                    $('[aria-expanded]').on('keydown', function(e) {
                      if (e.keyCode === 9) {
                        if ($(this).attr('aria-expanded') == 'true') {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            $('#navigation li:first-child a').focus();
                          } else {
                            if (e.shiftKey) {
                              e.preventDefault();
                              $('.content').focus();
                            }
                          }
                        }
                      }
                    });*/
                });
            }
        }
	}

	ready(over_panel.init);
})();