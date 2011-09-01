(function ($) {

Drupal.ModuleFilter = function(element, selector, options) {
  var self = this;

  this.element = element;

  this.settings = Drupal.settings.moduleFilter;

  this.selector = selector;
  this.text = '';

  this.options = $.extend({
    striping: false,
    childSelector: null,
    rules: new Array()
  }, options);

  this.applyFilter = function() {
    var startTime = new Date();
    var textLowerCase = self.text.toLowerCase();
    var flip = { even: 'odd', odd: 'even' };
    var stripe = 'odd';

    $(selector).each(function() {
      var $item = $(this);
      var result = (self.options.childSelector) ? $(self.options.childSelector, this) : $(this);
      var name = result.text();
      var nameLowerCase = name.toLowerCase();

      if ($item.prev().length == 0) {
        self.element.trigger('moduleFilter:start', $item);
      }

      if (nameLowerCase.match(textLowerCase)) {
        var rulesResult = true;
        if (self.options.rules.length > 0) {
          for (var i in self.options.rules) {
            var func = self.options.rules[i];
            rulesResult = func(self, $item);
            if (rulesResult === null) {
              continue;
            }
            else {
              break;
            }
          }
        }
        if (rulesResult == true) {
          if (self.options.striping) {
            $item.removeClass('odd even');
            $item.addClass(stripe);
            $item.show();
            stripe = flip[stripe];
          }
          $item.show();
          if ($item.next().length == 0) {
            self.element.trigger('moduleFilter:finish', $item);
          }
          return true;
        }
      }

      $item.hide();
      if ($item.next().length == 0) {
        self.element.trigger('moduleFilter:finish', $item);
      }
    });

    var endTime = new Date();
    if (console != undefined) {
      console.log(endTime.getTime() - startTime.getTime());
    }
  };

  $(self.element).keyup(function() {
    if (self.text != $(this).val()) {
      self.text = $(this).val();
      if (self.timeOut) {
        clearTimeout(self.timeOut);
      }

      self.timeOut = setTimeout(self.applyFilter, 500);
    }
  });
};

$.fn.moduleFilter = function(selector, options) {
  $(this).parents('.module-filter-inputs-wrapper').show();
  $(this).focus();
  $(this).data('moduleFilter', new Drupal.ModuleFilter(this, selector, options));
};

})(jQuery);
