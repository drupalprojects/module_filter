
Drupal.behaviors.moduleFilterDynamicPosition = function() {
  $(window).scroll(function() {
    var top = $('#module-filter-tabs').offset().top;
    var bottom = top + $('#module-filter-tabs').height();
    var windowHeight = $(window).height();
    if (((bottom - windowHeight) > ($(window).scrollTop() - $('#module-filter-submit').height())) && $(window).scrollTop() + windowHeight - $('#module-filter-submit').height() - $('#all-tab').height() > top) {
      $('#module-filter-submit').removeClass('fixed-top').addClass('fixed fixed-bottom');
    }
    else if (bottom < $(window).scrollTop()) {
      $('#module-filter-submit').removeClass('fixed-bottom').addClass('fixed fixed-top');
    }
    else {
      $('#module-filter-submit').removeClass('fixed fixed-bottom fixed-top');
    }
  });
  $(window).trigger('scroll');
  $(window).resize(function() {
    $(window).trigger('scroll');
  });
}
