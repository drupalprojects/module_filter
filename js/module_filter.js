(function ($) {

Drupal.ModuleFilter = {};

Drupal.ModuleFilter.Filter = function(element, selector, options) {
  var self = this;

  this.element = element;

  this.settings = Drupal.settings.moduleFilter;

  this.selector = selector;
  this.text = '';

  this.options = $.extend({
    delay: 500,
    striping: false,
    childSelector: null,
    rules: new Array()
  }, options);

  this.applyFilter = function() {
    var textLowerCase = self.text.toLowerCase();
    var flip = { even: 'odd', odd: 'even' };
    var stripe = 'odd';

    if (self.index == undefined) {
      self.buildIndex();
    }

    $.each(self.index, function(key, value) {
      var $item = $(value.element);

      if ($item.prev().length == 0) {
        self.element.trigger('moduleFilter:start', $item);
      }

      if (value.text.indexOf(textLowerCase) >= 0) {
        var rulesResult = true;
        if (self.options.rules.length > 0) {
          for (var i in self.options.rules) {
            var func = self.options.rules[i];
            rulesResult = func(self, value);
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
  };

  $(self.element).keyup(function() {
    if (self.text != $(this).val()) {
      self.text = $(this).val();
      if (self.timeOut) {
        clearTimeout(self.timeOut);
      }

      self.timeOut = setTimeout(self.applyFilter, self.options.delay);
    }
  });
};

Drupal.ModuleFilter.Filter.prototype.buildIndex = function() {
  var self = this;
  var index = new Array();
  $(this.selector).each(function(i) {
    var text = (self.options.childSelector) ? $(self.options.childSelector, this).text() : $(this).text();
    var item = {
      key: i,
      element: this,
      text: text.toLowerCase()
    };
    for (var j in self.options.buildIndex) {
      var func = self.options.buildIndex[j];
      item = $.extend(func(self, item), item);
    }
    index.push(item);
    delete item;
  });
  this.index = index;
}

$.fn.moduleFilter = function(selector, options) {
  $(this).parents('.module-filter-inputs-wrapper').show();
  $(this).focus();
  $(this).data('moduleFilter', new Drupal.ModuleFilter.Filter(this, selector, options));
};

})(jQuery);
