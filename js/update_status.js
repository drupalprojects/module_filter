(function($) {

Drupal.behaviors.moduleFilterUpdateStatus = {
  attach: function(context) {
    $('#module-filter-update-status-form').once('update-status', function() {
      var filterInput = $('input[name="module_filter[name]"]', context);
      filterInput.moduleFilter('table.update > tbody > tr', {
        wrapper: $('table.update:first').parent(),
        delay: 300,
        childSelector: 'div.project a',
        rules: [
          function(moduleFilter, item) {
            if (moduleFilter.options.showOk && item.state == 'ok') {
              return true;
            }
            if (moduleFilter.options.showWarning && item.state == 'warning') {
              return true;
            }
            if (moduleFilter.options.showError && item.state == 'error') {
              return true;
            }
            if (moduleFilter.options.showUnknown && item.state == 'unknown') {
              return true;
            }
            return false;
          }
        ],
        buildIndex: [
          function(moduleFilter, item) {
            if (item.element.is('.ok')) {
              item.state = 'ok';
            }
            else if (item.element.is('.warning')) {
              item.state = 'warning';
            }
            else if (item.element.is('.error')) {
              item.state = 'error';
            }
            else if (item.element.is('.unknown')) {
              item.state = 'unknown';
            }
            return item;
          }
        ],
        showOk: $('#edit-module-filter-show-ok', context).is(':checked'),
        showWarning: $('#edit-module-filter-show-warning', context).is(':checked'),
        showError: $('#edit-module-filter-show-error', context).is(':checked'),
        showUnknown: $('#edit-module-filter-show-unknown', context).is(':checked')
      });

      var moduleFilter = filterInput.data('moduleFilter');

      $('#edit-module-filter-show-ok', context).change(function() {
        moduleFilter.options.showOk = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-warning', context).change(function() {
        moduleFilter.options.showWarning = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-error', context).change(function() {
        moduleFilter.options.showError = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-unknown', context).change(function() {
        moduleFilter.options.showUnknown = $(this).is(':checked');
        moduleFilter.applyFilter();
      });

      moduleFilter.element.bind('moduleFilter:start', function(e, item) {
        $('table.update').each(function() {
          $(this).show().prev('h3').show();
        });
      });

      moduleFilter.element.bind('moduleFilter:finish', function(e, item) {
        $('table.update').each(function() {
          var $table = $(this);
          if ($('tbody tr', $(this)).filter(':visible').length == 0) {
            $table.hide().prev('h3').hide();
          }
        });
      });

      moduleFilter.element.bind('moduleFilter:keyup', function() {
        if (moduleFilter.clearOffset == undefined) {
          moduleFilter.inputWidth = filterInput.width();
          moduleFilter.clearOffset = moduleFilter.element.parent().find('.module-filter-clear a').width();
        }
        if (moduleFilter.text) {
          filterInput.width(moduleFilter.inputWidth - moduleFilter.clearOffset - 5).parent().css('margin-right', moduleFilter.clearOffset + 5);
        }
        else {
          filterInput.width(moduleFilter.inputWidth).parent().css('margin-right', 0);
        }
      });

      moduleFilter.element.parent().find('.module-filter-clear a').click(function() {
        filterInput.width(moduleFilter.inputWidth).parent().css('margin-right', 0);
      });

      moduleFilter.applyFilter();
    });
  }
};

})(jQuery);
