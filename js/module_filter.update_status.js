/**
 * @file
 * Module filter behaviors.
 */

(function($, Drupal) {

  'use strict';

  /**
   * Filter enhancements.
   */
  Drupal.behaviors.moduleFilterUpdateStatus = {
    attach: function(context, settings) {
      var $input = $('input.table-filter-text').once('module-filter');
      if ($input.length) {
        var selector = 'tbody tr';
        var wrapperId = $input.attr('data-table');
        var $wrapper = $(wrapperId);

        $input.winnow(wrapperId + ' ' + selector, {
          textSelector: 'td .project-update__title a',
          emptyMessage: Drupal.t('No results'),
          clearLabel: Drupal.t('clear'),
          wrapper: $wrapper
        }).focus();

        var $titles = $('h3', $wrapper);
        $input.bind('winnow:finish', function() {
          $titles.each(function(index, element) {
            var $title = $(element);
            var $table = $title.next();
            if ($table.is('table')) {
              var $visibleRows = $table.find(selector + ':visible');
              $title.toggle($visibleRows.length > 0);
            }
          });

          Drupal.announce(
            Drupal.formatPlural(
              $wrapper.find(selector + ':visible').length,
              '1 project is available in the modified list.',
              '@count projects are available in the modified list.'
            )
          );
        });
      }
    }
  };

})(jQuery, Drupal);
