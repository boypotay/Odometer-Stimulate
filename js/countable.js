(function ($) {
  /**
   * Auto update counter
   */
  Drupal.behaviors.updatableCounter = {
    attach: function (context, settings) {
      var complete = 0;
      $.fn.countTo = function(options) {
      // merge the default plugin settings with the custom options
      options = $.extend({}, $.fn.countTo.defaults, options || {});

      // how many times to update the value, and how much to increment the value on each update
      var loops = Math.ceil(options.speed / options.refreshInterval), increment = 1;
      //increment = (options.to - options.from) / loops;
      return $(this).each(function() {
        var _this = this,
        loopCount = 0,
        value = options.from,
        interval = setInterval(updateTimer, options.refreshInterval);

        function updateTimer() {
          value += increment;
          loopCount++;
          var custom = value.toFixed(options.decimals);
          $(_this).html(custom);
          // Set digits
          setDigits(custom);

          if (typeof(options.onUpdate) == 'function') {
            options.onUpdate.call(_this, value);
          }
          // Stop when from = to
          if (value == options.to) {
            clearInterval(interval);
            value = options.to;
            if (typeof(options.onComplete) == 'function') {
              options.onComplete.call(_this, value);
            }
          }

          if (loopCount >= loops) {
            clearInterval(interval);
            value = options.to;
            if (typeof(options.onComplete) == 'function') {
              options.onComplete.call(_this, value);
            }
          }
        }
        // Add commas to number
        function numberWithCommas(x) {
          x = x.replace(/,/g,'');
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var text = '';
          var array = parts.join(".").split('');
          for (i = 0; i < array.length; i++) {
            if(array[i] == ',') {
              text += '<span class="separator">,</span>';
            } else {
              text += '<span class="digit">' + array[i] + '</span>';
            }
          }
          return text;
        }
        // Set digit for span
        function setDigits(value) {
          var digits = value.toString().split('');
          // Add new number remove old number
          $('.counter', context).find('.digit').each(function(i, element){
            var offset = $(this).find('span:last-child').height();
            var $digit = $(this);
            if($digit.find("span:last-child").text() !== digits[i]){
              $digit.append('<span style="position:absolute; top:' + offset + 'px;">' + digits[i] + '</span>');
              $digit.addClass('changed');
            }

            if($digit.hasClass('changed')) {
              $digit.find('span').animate({
                top: '-=' + offset + 'px'
                }, 1000, function() {
                //$digit.removeClass('changed');
              });
            }

            $digit.removeClass('changed');
            if($digit.find('span').length > 3) {
              $digit.find("span:first-child").remove();
            }

          });
        }
      });
    };
    // Counter function
    var counter = Drupal.settings.odometer_stimulate.countable_values;
    if(counter.ok) {
      $('.timer', context).countTo({
        from: counter.from, // the number the element should start at
        to: counter.to, // the number the element should end at
        speed: counter.speed, // how long it should take to count between the target numbers
        refreshInterval: 1500, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        onComplete: function(value) { // callback method for when the element finishes updating
          complete = 1;
        }
      });
    }
    setInterval(function(){
      if(complete) {
        if(counter.ok) {
          $('.timer', context).countTo({
            from: counter.orifrom, // the number the element should start at
            to: counter.to, // the number the element should end at
            speed: counter.orispeed, // how long it should take to count between the target numbers
            refreshInterval: 1500, // how often the element should be updated
            decimals: 0, // the number of decimal places to show
            onComplete: function(value) { // callback method for when the element finishes updating
              complete = 1;
            }
          });
        }
        complete = 0;
      }
    }, 60000);

    }
  };
})(jQuery);
