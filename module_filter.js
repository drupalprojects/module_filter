// $Id$

if (Drupal.jsEnabled) {
  var timeOut;
  var filterText = '';

  $(document).ready(function() {
    $("#module-filter-wrapper").show();
    $("#edit-module-filter").keyup(function() {
      if (filterText != $(this).val()) {
        if (timeOut) {
          clearTimeout(timeOut);
        }
        filterText = $(this).val();
        timeOut = setTimeout("moduleFilter('" + filterText + "')", 500);
      }
    });
  });
}

function moduleFilter(filter) {
  filterLowerCase = filter.toLowerCase();

  $("table.package tbody tr td strong label").each(function(i) {
    var parent = $(this).parent().parent().parent();
    var module = $(this).text();

    moduleLowerCase = module.toLowerCase();

    if (moduleLowerCase.match(filterLowerCase)) {
      if (parent.css('display') == 'none') {
        parent.show();
        if (parent.parent().parent().parent().parent().css('display') == 'none') {
          parent.parent().parent().parent().parent().show();
        }
      }
    } else {
      if (parent.css('display') != 'none') {
        parent.hide();
        if (parent.siblings(":visible").html() == null) {
          if (parent.parent().parent().parent().parent().css('display') != 'none') {
            parent.parent().parent().parent().parent().hide();
          }
        }
      }
    }
  });
}
