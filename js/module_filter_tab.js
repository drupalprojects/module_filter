
(function ($) {

moduleGetID = function(text) {
  var id = text.toLowerCase();
  id = id.replace(/[^a-z0-9]+/g, '-');
  id = id.replace(/-$/, '');
  return id;
};

Drupal.behaviors.moduleFilterTabs = {
  attach: function(context) {
    if (Drupal.settings.moduleFilter.tabs) {
      $('#module-filter-wrapper table:not(.sticky-header)', context).once('module-filter-tabs', function() {
        var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
        var table = $(this);

        $('thead', table).show();

        // Remove package header rows.
        $('tr.admin-package-header', table).remove();

        // Build tabs from package title rows.
        var tabs = '<ul class="module-filter-tabs">';
        $('tr.admin-package-title', table).each(function(i) {
          var name = $.trim($(this).text());
          var id = moduleGetID(name);
          tabs += '<li id="' + id + '-tab" class="project-tab"><a href="#' + id + '"><strong>' + name + '</strong><span class="summary"></span></a></li>';
          $(this).remove();
        });
        tabs += '</ul>';
        $('#module-filter-modules').before(tabs);

        // Click event for tabs.
        $('ul.module-filter-tabs li a').click(function() {
          if ($(this).parent().hasClass('selected')) {
            // Clear the active tab.
            window.location.hash = '';
            return false;
          }
        });

        // Add filter rule to limit by active tab.
        moduleFilter.options.rules.push(function(moduleFilter, item) {
          if (Drupal.ModuleFilter.activeTab != undefined) {
            if (!$(item.element).hasClass(Drupal.ModuleFilter.activeTab.id + '-tab')) {
              return false;
            }
          }
          return true;
        });

        // Move the submit button just below the tabs.
        $('#module-filter-modules').before($('#module-filter-submit'));

        // Sort rows.
        var rows = $('tbody tr.module', table).get();
        rows.sort(function(a, b) {
          var compA = $('td:nth(1)', a).text().toLowerCase();
          var compB = $('td:nth(1)', b).text().toLowerCase();
          return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(rows, function(idx, itm) { table.append(itm); });

        // Re-stripe rows.
        $('tr.module', table)
          .removeClass('odd even')
          .filter(':odd').addClass('even').end()
          .filter(':even').addClass('odd');

        $('#module-filter-modules').css('min-height', $('ul.module-filter-tabs').height() + $('#module-filter-submit').height());

        $(window).bind('hashchange.module-filter', $.proxy(Drupal.ModuleFilter, 'eventHandlerOperateByURLFragment')).triggerHandler('hashchange.module-filter');
      });
    }
  }
}

Drupal.ModuleFilter.eventHandlerOperateByURLFragment = function(event) {
  if (Drupal.ModuleFilter.activeTab != undefined) {
    Drupal.ModuleFilter.activeTab.element.removeClass('selected');
  }

  var id = $.param.fragment();
  if (id) {
    Drupal.ModuleFilter.activeTab = {
      id: id,
      element: $('#' + id + '-tab')
    };
    Drupal.ModuleFilter.activeTab.element.addClass('selected');
  }
  else {
    delete Drupal.ModuleFilter.activeTab;
  }

  var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
  moduleFilter.applyFilter();
};

})(jQuery);
