/**
 * Contents:
 *
 * 1.0 Core Functionality
 *     1.1 Basic Functions
 *     1.2 Debouncers + Throttlers
 *
 */

window.$ = window.jQuery = require('jquery'); // eslint-disable-line no-multi-assign

jQuery(document).ready(($) => {
    /**
     * 1.0 Core Functionality
     */

    /** 1.1 Basic Functions */

    // TODO (jamie@hexdigital.com): Temporarily removed as 'fallback' is not
    // defined - unsure what the correct use case is for this
    // if (!Modernizr.svg) $('img[src$=\'.svg\']').attr('src', fallback);

    function scrollTo(pixels, duration = 400) { // eslint-disable-line no-unused-vars
        if (pixels === undefined) return false;
        $('html, body').animate({ scrollTop: pixels }, duration);
        return true;
    }

    function scrollToElement($element) { // eslint-disable-line no-unused-vars
        if (!$element.length) return false;
        scrollTo($element.offset().top);
        return true;
    }

    $('a[href^="#"]').click((event) => {
        event.preventDefault();
        if ($(this).attr('href').substr(1) && $(this.hash).offset() !== undefined) {
            $('html, body').animate({ scrollTop: $(this.hash).offset().top }, 200);
        }
    });

    $('a[href="#top"]').click(() => {
        scrollTo(0);
    });

    /**
     * Use this throttle function to prevent a function from being called more
     * than once during a certain amount of time.
     */
    function throttle(func, delay = 250, scope) { // eslint-disable-line no-unused-vars
        let lastCall;
        let deferTimer;

        return (...args) => {
            const context = scope || this;
            const now = +new Date();

            if (lastCall && now < lastCall + delay) {
                // Throttle, and call once at end of delay
                clearTimeout(deferTimer);
                deferTimer = setTimeout(() => {
                    lastCall = now;
                    func.apply(context, ...args);
                }, (lastCall + delay) - now);
            } else {
                lastCall = now;
                func.apply(context, ...args);
            }
        };
    }

    /*
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * https://davidwalsh.name/javascript-debounce-function
     */
    function debounce(func, wait, immediate, scope) { // eslint-disable-line no-unused-vars
        let timeout;
        return (...args) => {
            const context = scope || this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, ...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, ...args);
            }
        };
    }

    /** 1.2 Debouncers + Throttlers */

    /** Window resize debouncer */
    /*
    $(window).resize(function() {
        if (this.resizeEvent) clearTimeout(this.resizeEvent);
        this.resizeEvent = setTimeout(function() {
            $(this).trigger('windowResize');
        }, 500);
    });

    $(window).bind('windowResize', function() {
        doStuff();
    });
    */

    /** Window scroll throttler */
    /*
    $(window).on('scroll', throttle(function() {
        doStuff();
    }, 300));
    */
});
