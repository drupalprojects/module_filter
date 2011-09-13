(function($) {

Drupal.behaviors.moduleFilter = {
  attach: function(context) {
    $('.module-filter-inputs-wrapper', context).once('module-filter', function() {
      var filterInput = $('input[name="module_filter[name]"]', context);
      var selector = '#system-modules table tbody tr.module';

      filterInput.moduleFilter(selector, {
        wrapper: $('#module-filter-modules'),
        delay: 300,
        striping: true,
        childSelector: 'td:nth(1)',
        rules: [
          function(moduleFilter, item) {
            if (moduleFilter.options.showEnabled) {
              if (item.status && !item.disabled) {
                return true;
              }
            }
            if (moduleFilter.options.showDisabled) {
              if (!item.status && !item.disabled) {
                return true;
              }
            }
            if (moduleFilter.options.showRequired) {
              if (item.status && item.disabled) {
                return true;
              }
            }
            if (moduleFilter.options.showUnavailable) {
              if (!item.status && item.disabled) {
                return true;
              }
            }
            return false;
          }
        ],
        buildIndex: [function(moduleFilter, item) {
          item.status = $('td.checkbox :checkbox', item.element).is(':checked');
          item.disabled = $('td.checkbox :checkbox', item.element).is(':disabled');
          return item;
        }],
        showEnabled: $('#edit-module-filter-show-enabled').is(':checked'),
        showDisabled: $('#edit-module-filter-show-disabled').is(':checked'),
        showRequired: $('#edit-module-filter-show-required').is(':checked'),
        showUnavailable: $('#edit-module-filter-show-unavailable').is(':checked')
      });

      var moduleFilter = filterInput.data('moduleFilter');

      moduleFilter.element.bind('moduleFilter:start', function(e, item) {
        var fieldset = $(item).parents('fieldset');
        if ($(fieldset).is(':hidden')) {
          fieldset.show();
        }
      });

      moduleFilter.element.bind('moduleFilter:finish', function(e, item) {
        var $item = $(item);
        if (!$item.is(':visible') && $item.siblings().filter(':visible').length == 0) {
          $item.parents('fieldset').hide();
        }
      });

      $('#edit-module-filter-show-enabled', context).change(function() {
        moduleFilter.options.showEnabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-disabled', context).change(function() {
        moduleFilter.options.showDisabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-required', context).change(function() {
        moduleFilter.options.showRequired = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-unavailable', context).change(function() {
        moduleFilter.options.showUnavailable = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
    });
  }
}

})(jQuery);
