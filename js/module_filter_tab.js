
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
      $('#module-filter-wrapper table', context).once('module-filter-tabs', function() {
        var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
        var table = $(this);

        $('thead', table).show();

        // Remove package header rows.
        $('tr.admin-package-header', table).remove();

        // Build tabs from package title rows.
        var tabs = '<ul class="module-filter-tabs">';
        $('tr.admin-package-title', table).each(function(i) {
          var name = $.trim($(this).text());
          tabs += '<li id="' + moduleGetID(name) + '-tab" class="project-tab"><a href="#"><strong>' + name + '</strong><span class="summary"></span></a></li>';
          $(this).remove();
        });
        tabs += '</ul>';
        $('#module-filter-modules').before(tabs);

        // Click event for tabs.
        $('ul.module-filter-tabs li a').click(function() {
          if (Drupal.ModuleFilter.activeTab != undefined) {
            Drupal.ModuleFilter.activeTab.removeClass('selected');
            if (Drupal.ModuleFilter.activeTab.get(0) === $(this).parent().get(0)) {
              // The active tab was clicked.
              delete Drupal.ModuleFilter.activeTab;
              moduleFilter.applyFilter();
              return false;
            }
          }
          Drupal.ModuleFilter.activeTab = $(this).parent();
          Drupal.ModuleFilter.activeTab.addClass('selected');
          moduleFilter.applyFilter();
          return false;
        });

        // Add filter rule to limit by active tab.
        moduleFilter.options.rules.push(function(moduleFilter, item) {
          if (Drupal.ModuleFilter.activeTab != undefined) {
            if (!$(item.element).hasClass(Drupal.ModuleFilter.activeTab.attr('id'))) {
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
      });
    }
  }
}

})(jQuery);
