
(function ($) {

moduleGetID = function(text) {
  var id = text.toLowerCase();
  id = id.replace(/[^a-z0-9]+/g, '-');
  id = id.replace(/-$/, '');
  return id;
};

Drupal.ModuleFilter.tabs = {};
Drupal.ModuleFilter.enabling = {};
Drupal.ModuleFilter.disabling = {};

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
        var tabs = '<ul id="module-filter-tabs">';
        $('tr.admin-package-title', table).each(function(i) {
          var name = $.trim($(this).text());
          var id = moduleGetID(name);
          var summary = (Drupal.settings.moduleFilter.countEnabled) ? Drupal.ModuleFilter.countSummary(id) : '';
          tabs += '<li id="' + id + '-tab" class="project-tab"><a href="#' + id + '"><strong>' + name + '</strong><span class="summary">' + summary + '</span></a></li>';
          $(this).remove();
        });
        tabs += '</ul>';
        $('#module-filter-modules').before(tabs);

        // Index tabs.
        $('#module-filter-tabs li').each(function() {
          var $tab = $(this);
          var id = $tab.attr('id');
          Drupal.ModuleFilter.tabs[id] = new Drupal.ModuleFilter.Tab($tab, id);
        });

        if (Drupal.settings.moduleFilter.visualAid) {
          $('#module-filter-modules tbody td.checkbox input').change(function() {
            var $checkbox = $(this);
            var type = ($checkbox.is(':checked')) ? 'enable' : 'disable';
            Drupal.ModuleFilter.updateVisualAid(type, $checkbox.parents('tr'));
          });
        }

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

        $('#module-filter-modules').css('min-height', $('#module-filter-tabs').height() + $('#module-filter-submit').height());

        $(window).bind('hashchange.module-filter', $.proxy(Drupal.ModuleFilter, 'eventHandlerOperateByURLFragment')).triggerHandler('hashchange.module-filter');
      });
    }
  }
}

Drupal.ModuleFilter.Tab = function(element, id) {
  var self = this;

  this.id = id.substring(0, id.length - 4);
  this.element = element;

  $('a', this.element).click(function() {
    if (self.element.hasClass('selected')) {
      // Clear the active tab.
      window.location.hash = 'all';
      return false;
    }
  });
}

Drupal.ModuleFilter.eventHandlerOperateByURLFragment = function(event) {
  if (Drupal.ModuleFilter.activeTab != undefined) {
    Drupal.ModuleFilter.activeTab.element.removeClass('selected');
  }

  var id = $.param.fragment();
  if (id != 'all') {
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

Drupal.ModuleFilter.countSummary = function(id) {
  return Drupal.t('@enabled of @total', { '@enabled': Drupal.settings.moduleFilter.enabledCounts[id].enabled, '@total': Drupal.settings.moduleFilter.enabledCounts[id].total });
}

Drupal.ModuleFilter.Tab.prototype.updateEnabling = function(amount) {
  this.enabling = this.enabling || 0;
  this.enabling += amount;
  if (this.enabling == 0) {
    delete this.enabling;
  }
}

Drupal.ModuleFilter.Tab.prototype.updateDisabling = function(amount) {
  this.disabling = this.disabling || 0;
  this.disabling += amount;
  if (this.disabling == 0) {
    delete this.disabling;
  }
}

Drupal.ModuleFilter.Tab.prototype.updateVisualAid = function() {
  var visualAid = '';
  if (this.enabling != undefined) {
    visualAid += '<span class="enabling">' + Drupal.t('+@count', { '@count': this.enabling });
  }
  if (this.disabling != undefined) {
    visualAid += '<span class="disabling">' + Drupal.t('-@count', { '@count': this.disabling });
  }

  if (this.visualAid == undefined) {
    $('a', this.element).prepend('<span class="visual-aid"></span>');
    this.visualAid = $('span.visual-aid', this.element);
  }

  this.visualAid.empty().append(visualAid);
}

Drupal.ModuleFilter.updateVisualAid = function(type, $row) {
  var id = $row.data('moduleFilterTabID');
  if (!id) {
    // Find the tab ID.
    var classes = $row.attr('class').split(' ');
    for (var i in classes) {
      if (Drupal.ModuleFilter.tabs[classes[i]] != undefined) {
        id = classes[i];
      }
    }
  }

  if (!id) {
    return false;
  }

  var tab = Drupal.ModuleFilter.tabs[id];
  var name = $('td:nth(1)', $row).text();
  switch (type) {
    case 'enable':
      if (Drupal.ModuleFilter.disabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.disabling[id + name];
        tab.updateDisabling(-1);
        $row.removeClass('disabling');
      }
      else {
        Drupal.ModuleFilter.enabling[id + name] = name;
        tab.updateEnabling(1);
        $row.addClass('enabling');
      }
      break;
    case 'disable':
      if (Drupal.ModuleFilter.enabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.enabling[id + name];
        tab.updateEnabling(-1);
        $row.removeClass('enabling');
      }
      else {
        Drupal.ModuleFilter.disabling[id + name] = name;
        tab.updateDisabling(1);
        $row.addClass('disabling');
      }
      break;
  }

  tab.updateVisualAid();
}

})(jQuery);
