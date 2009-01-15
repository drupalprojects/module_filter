// $Id$

if (Drupal.jsEnabled) {
  var moduleFilterTimeOut;
  var moduleFilterLeftHeight;
  var moduleFilterTextFilter = '';
  var moduleFilterActiveTab = 'all-tab';

  $(document).ready(function() {
    moduleFilterLeftHeight = $("#module-filter-left").height();
    _moduleFilterSpacerHeight();
    $("#edit-module-filter").focus();
    $("#module-filter-left a.project-tab").each(function(i) {
      $(this).click(function() {
        if ($(this).attr('id') != moduleFilterActiveTab) {
          $('#' + moduleFilterActiveTab).parent().toggleClass('active');
          moduleFilterActiveTab = $(this).attr('id');
          $('#' + moduleFilterActiveTab).parent().toggleClass('active');

          // Filter rows depending on tab selected.
          moduleFilterTabLoad();
        }
        return false;
      });
    });
    $("#edit-module-filter").keyup(function() {
      if (moduleFilterTextFilter != $(this).val()) {
        moduleFilterTextFilter = this.value;
        if (moduleFilterTimeOut) {
          clearTimeout(moduleFilterTimeOut);
        }
        moduleFilterTimeOut = setTimeout("moduleFilter('" + moduleFilterTextFilter + "')", 500);
      }

      if (moduleFilterClosedFieldsets == '') {
        $("fieldset.collapsed").each(function(i) {
          $(this).removeClass('collapsed');
          moduleFilterClosedFieldsets.push($(this).children('legend').text());
        });
      }
    });
  });
}

function moduleFilterTabLoad() {
  var flip = 'odd';

  if (moduleFilterActiveTab == 'all-tab') {
    $("#projects tbody tr").each(function(i) {
      $(this).removeClass('odd');
      $(this).removeClass('even');
      $(this).addClass(flip);
      flip = (flip == 'odd') ? 'even' : 'odd';
    });
    $("#projects tbody tr").show();
  }
  else {
    $("#projects tbody tr").hide();
    $("#projects tbody tr").each(function(i) {
      $(this).removeClass('odd');
      $(this).removeClass('even');
    });
    $("#projects tbody tr." + moduleFilterActiveTab + "-content").each(function(i) {
      $(this).addClass(flip);
      flip = (flip == 'odd') ? 'even' : 'odd';
    });
    $("#projects tbody tr." + moduleFilterActiveTab + "-content").show();
  }

  _moduleFilterSpacerHeight();
}

function moduleFilter(string) {
  stringLowerCase = string.toLowerCase();

  if (moduleFilterActiveTab == 'all-tab') {
    $("#projects tbody tr td strong").each(function(i) {
      _moduleFilter(stringLowerCase, this);
    });
  }
  else {
    $("#projects tbody tr." + moduleFilterActiveTab + "-content td strong").each(function(i) {
      _moduleFilter(stringLowerCase, this);
    });
  }

  _moduleFilterSpacerHeight();
}

function _moduleFilter(stringLowerCase, item) {
  var parent = $(item).parent().parent();
  var module = $(item).text();
  var moduleLowerCase = module.toLowerCase();
  if (moduleLowerCase.match(stringLowerCase)) {
    parent.show();
  }
  else {
    parent.hide();
  }
}

function _moduleFilterSpacerHeight() {
  var rightHeight = $("#module-filter-right").height();
  if (moduleFilterLeftHeight < rightHeight) {
    $("#module-filter-spacer").height($("#module-filter-right").height());
  }
  else {
    $("#module-filter-spacer").height($("#module-filter-left").height());
  }
}
