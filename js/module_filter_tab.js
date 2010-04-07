// $Id$

Drupal.ModuleFilter = Drupal.ModuleFilter || {};
Drupal.ModuleFilter.tabsHeight;
Drupal.ModuleFilter.textFilter = '';
Drupal.ModuleFilter.timeout;
Drupal.ModuleFilter.tabs = {};

Drupal.behaviors.moduleFilter = function() {
  // Set the focus on the module filter textfield.
  $('#edit-module-filter').focus();

  // Determine the height for the tabs div.
  Drupal.ModuleFilter.tabsHeight = $('#module-filter-tabs').height();
  // Set the spacer height.
  Drupal.ModuleFilter.setSpacerHeight();

  $('#module-filter-left a.project-tab').each(function(i) {
    Drupal.ModuleFilter.tabs[$(this).attr('id')] = new Drupal.ModuleFilter.Tab(this);
  });

  // Move anchors to top of tabs.
  $('a.anchor', $('#module-filter-left')).remove().prependTo('#module-filter-tabs');

  $("#edit-module-filter").keyup(function() {
    if (Drupal.ModuleFilter.textFilter != $(this).val()) {
      Drupal.ModuleFilter.textFilter = this.value;
      if (Drupal.ModuleFilter.timeout) {
        clearTimeout(Drupal.ModuleFilter.timeout);
      }
      Drupal.ModuleFilter.timeout = setTimeout("Drupal.ModuleFilter.filter('" + Drupal.ModuleFilter.textFilter + "')", 500);
    }
  });

  // Check for anchor.
  var url = document.location.toString();
  if (url.match('#')) {
    // Make tab active based on anchor.
    var anchor = '#' + url.split('#')[1];
    $('a[href="' + anchor + '"]').click();
  }
}

Drupal.ModuleFilter.setSpacerHeight = function() {
  var rightHeight = $("#module-filter-squeeze").height();
  if (Drupal.ModuleFilter.tabsHeight <= rightHeight) {
    $("#module-filter-spacer").height($("#module-filter-squeeze").height());
  }
  else {
    $("#module-filter-spacer").height($("#module-filter-tabs").height() - 1);
  }
}

Drupal.ModuleFilter.filter = function(string) {
  var stringLowerCase = string.toLowerCase();
  var flip = 'odd';

  if (Drupal.ModuleFilter.activeTab.id == 'all-tab') {
    var selector = '#projects tbody tr td > strong';
    $("#projects tbody tr td > strong").each(function(i) {
      _moduleFilter(stringLowerCase, this, flipper);
    });
  }
  else {
    var selector = '#projects tbody tr.' + Drupal.ModuleFilter.activeTab.id + '-content td > strong';
  }

  $(selector).each(function(i) {
    var $parent = $(this).parent().parent();
    var module = $(this).text();
    var moduleLowerCase = module.toLowerCase();

    if (moduleLowerCase.match(stringLowerCase)) {
      $parent.removeClass('odd even');
      $parent.addClass(flip.flip);
      $parent.show();
      flip = (flip == 'odd') ? 'even' : 'odd';
    }
    else {
      $parent.hide();
    }
  });

  Drupal.ModuleFilter.setSpacerHeight();
}

Drupal.ModuleFilter.Tab = function(element) {
  this.id = $(element).attr('id');
  this.element = element;

  $(this.element).click(function() {
    Drupal.ModuleFilter.tabs[$(this).attr('id')].setActive();
  });
}

Drupal.ModuleFilter.Tab.prototype.setActive = function() {
  if (Drupal.ModuleFilter.activeTab) {
    $(Drupal.ModuleFilter.activeTab.element).parent().removeClass('active');
  }
  // Assume the default active tab is #all-tab. Remove its active class.
  else {
    $('#all-tab').parent().removeClass('active');
  }

  Drupal.ModuleFilter.activeTab = this;
  $(Drupal.ModuleFilter.activeTab.element).parent().addClass('active');
  Drupal.ModuleFilter.activeTab.displayRows();
}

Drupal.ModuleFilter.Tab.prototype.displayRows = function() {
  var flip = 'odd';

  // Clear value in module filter textfield, if any.
  $('#edit-module-filter').val('');

  if (Drupal.ModuleFilter.activeTab.id == 'all-tab') {
    // Display all rows.
    $('#projects tbody tr').each(function(i) {
      $(this).removeClass('odd even');
      $(this).addClass(flip);
      flip = (flip == 'odd') ? 'even' : 'odd';
    });
    $('#projects tbody tr').show();
  }
  else {
    $('#projects tbody tr').hide();
    $('#projects tbody tr').removeClass('odd even');
    $('#projects tbody tr.' + this.id + '-content').each(function(i) {
      $(this).addClass(flip);
      flip = (flip == 'odd') ? 'even' : 'odd';
    });
    $('#projects tbody tr.' + this.id + '-content').show();
  }

  // Adjust spacer height.
  Drupal.ModuleFilter.setSpacerHeight();
}

