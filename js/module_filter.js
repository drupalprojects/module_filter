// $Id$

if (Drupal.jsEnabled) {
  var moduleFilterTimeOut;
  var moduleFilterTextFilter = '';

  $(document).ready(function() {
    $("#module-filter-wrapper").show();
    $("#edit-module-filter-name").focus();
    $("#edit-module-filter-name").keyup(function() {
      if (moduleFilterTextFilter != $(this).val()) {
        moduleFilterTextFilter = this.value;
        if (moduleFilterTimeOut) {
          clearTimeout(moduleFilterTimeOut);
        }
        moduleFilterTimeOut = setTimeout("moduleFilter('" + moduleFilterTextFilter + "')", 500);
      }
    });
  });
}

function moduleFilter(string) {
  stringLowerCase = string.toLowerCase();

  $("table.package tbody tr td > strong").each(function(i) {
    var $row = $(this).parent().parent();
    var module = $(this).text();
    var moduleLowerCase = module.toLowerCase();
    var $fieldset = $row.parents('fieldset');

    if (moduleLowerCase.match(stringLowerCase)) {
      if (!$row.is(':visible')) {
        $row.show();
        if ($fieldset.hasClass('collapsed')) {
          $fieldset.removeClass('collapsed');
        }
        if (!$fieldset.is(':visible')) {
          $fieldset.show();
        }
      }
    }
    else {
      if ($row.css('display') != 'none') {
        $row.hide();
        if ($row.siblings(":visible").html() == null) {
          $fieldset.hide();
        }
      }
    }
  });
}
