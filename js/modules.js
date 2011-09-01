(function($) {

Drupal.behaviors.moduleFilter = {
  attach: function(context) {
    $('.module-filter-inputs-wrapper', context).once('module-filter', function() {
      if (!Drupal.settings.moduleFilter.tabs) {
        $('input[name="module_filter[name]"]', context).moduleFilter('#system-modules table tbody tr', {
          striping: true,
          childSelector: 'td:nth(1)',
          rules: [
            function(moduleFilter, row) {
              if (moduleFilter.options.showEnabled) {
                if ($('td.checkbox :checkbox', row).is(':checked') && !$('td.checkbox :checkbox', row).is(':disabled')) {
                  return true;
                }
              }
              if (moduleFilter.options.showDisabled) {
                if (!$('td.checkbox :checkbox', row).is(':checked') && !$('td.checkbox :checkbox', row).is(':disabled')) {
                  return true;
                }
              }
              if (moduleFilter.options.showRequired) {
                if ($('td.checkbox :checkbox', row).is(':checked') && $('td.checkbox :checkbox', row).is(':disabled')) {
                  return true;
                }
              }
              if (moduleFilter.options.showUnavailable) {
                if (!$('td.checkbox :checkbox', row).is(':checked') && $('td.checkbox :checkbox', row).is(':disabled')) {
                  return true;
                }
              }
              return false;
            }
          ],
          showEnabled: $('#edit-module-filter-show-enabled').is(':checked'),
          showDisabled: $('#edit-module-filter-show-disabled').is(':checked'),
          showRequired: $('#edit-module-filter-show-required').is(':checked'),
          showUnavailable: $('#edit-module-filter-show-unavailable').is(':checked')
        });
      }

      var moduleFilter = $('input[name="module_filter[name]"]', context).data('moduleFilter');

      $(moduleFilter.element).bind('moduleFilter:start', function(e, item) {
        var fieldset = $(item).parents('fieldset');
        if ($(fieldset).is(':hidden')) {
          $(fieldset).show();
        }
      });

      $(moduleFilter.element).bind('moduleFilter:finish', function(e, item) {
        if (!$(item).is(':visible') && $(item).siblings().filter(':visible').size() <= 0) {
          $(item).parents('fieldset').hide();
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