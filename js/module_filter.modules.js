/**
 * @file
 * Module filter behaviors.
 */

(function($, Drupal) {

  'use strict';

  /**
   * Filter enhancements.
   */
  Drupal.behaviors.moduleFilterModules = {
    attach: function(context, settings) {
      var $input = $('input.table-filter-text').once('module-filter');
      if ($input.length) {
        var selector = 'tbody tr';
        var wrapperId = $input.attr('data-table');
        var $wrapper = $(wrapperId);
        var $enabled = $('.table-filter [name="checkboxes[enabled]"]', $wrapper);
        var $disabled = $('.table-filter [name="checkboxes[disabled]"]', $wrapper);
        var $unavailable = $('.table-filter [name="checkboxes[unavailable]"]', $wrapper);
        var showEnabled = $enabled.is(':checked');
        var showDisabled = $disabled.is(':checked');
        var showUnavailable = $unavailable.is(':checked');

        $wrapper.children('details').wrapAll('<div class="modules-wrapper"></div>');
        var $modulesWrapper = $('.modules-wrapper', $wrapper);

        $input.winnow(wrapperId + ' ' + selector, {
          textSelector: 'td.module .module-name',
          emptyMessage: Drupal.t('No results'),
          clearLabel: Drupal.t('clear'),
          wrapper: $modulesWrapper,
          buildIndex: [
            function(item) {
              var $checkbox = $('td.checkbox :checkbox', item.element);
              item.status = ($checkbox.size() > 0) ? $checkbox.is(':checked') : null;
              return item;
            }
          ],
          additionalOperators: {
            description: function(string, item) {
              if (item.description == undefined) {
                // Soft cache.
                item.description = $('.module-description', item.element).text().toLowerCase();
              }

              if (item.description.indexOf(string) >= 0) {
                return true;
              }
            },
            requiredBy: function(string, item) {
              if (item.requiredBy === undefined) {
                // Soft cache.
                item.requiredBy = [];
                $('.admin-requirements.required-by li', item.element).each(function() {
                  var moduleName = $(this)
                    .text()
                    .toLowerCase()
                    .replace(/\([a-z]*\)/g, '');
                  item.requiredBy.push($.trim(moduleName));
                });
              }

              if (item.requiredBy.length) {
                for (var i in item.requiredBy) {
                  if (item.requiredBy[i].indexOf(string) >= 0) {
                    return true;
                  }
                }
              }
            },
            requires: function(string, item) {
              if (item.requires === undefined) {
                // Soft cache.
                item.requires = [];
                $('.admin-requirements.requires li', item.element).each(function() {
                  var moduleName = $(this)
                    .text()
                    .toLowerCase()
                    .replace(/\([a-z]*\)/g, '');
                  item.requires.push($.trim(moduleName));
                });
              }

              if (item.requires.length) {
                for (var i in item.requires) {
                  if (item.requires[i].indexOf(string) >= 0) {
                    return true;
                  }
                }
              }
            }
          },
          rules: [
            function(item) {
              if (showEnabled) {
                if (item.status === true) {
                  return true;
                }
              }
              if (showDisabled) {
                if (item.status === false) {
                  return true;
                }
              }
              if (showUnavailable) {
                if (item.status === null) {
                  return true;
                }
              }

              return false;
            }
          ]
        }).focus();

        var $details = $modulesWrapper.children('details');
        $input.bind('winnow:start', function() {
          // Note that we first open all <details> to be able to use ':visible'.
          // Mark the <details> elements that were closed before filtering, so
          // they can be reclosed when filtering is removed.
          $details.show().not('[open]').attr('data-module_filter-state', 'forced-open');
        });
        $input.bind('winnow:finish', function() {
          // Hide the package <details> if they don't have any visible rows.
          // Note that we first show() all <details> to be able to use ':visible'.
          $details.attr('open', true).each(function(index, element) {
            var $group = $(element);
            var $visibleRows = $group.find(selector + ':visible');
            $group.toggle($visibleRows.length > 0);
          });

          // Return <details> elements that had been closed before filtering
          // to a closed state.
          $details.filter('[data-module_filter-state="forced-open"]')
            .removeAttr('data-module_filter-state')
            .attr('open', false);

          Drupal.announce(
            Drupal.t(
              '!modules modules are available in the modified list.',
              {'!modules': $modulesWrapper.find(selector + ':visible').length}
            )
          );
        });

        var winnow = $input.data('winnow');
        $enabled.change(function() {
          showEnabled = $enabled.is(':checked');
          winnow.filter();
        });
        $disabled.change(function() {
          showDisabled = $disabled.is(':checked');
          winnow.filter();
        });
        $unavailable.change(function() {
          showUnavailable = $unavailable.is(':checked');
          winnow.filter();
        });
      }
    }
  };

})(jQuery, Drupal);
