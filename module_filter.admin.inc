<?php

/**
 * @file
 *
 * @author greenSkin
 */

/*******************************************************************************
 * Callback Functions, Forms, and Tables
 ******************************************************************************/

/**
 * Settings form for module filter.
 */
function module_filter_settings() {
  $form['module_filter_tabs'] = array(
    '#type' => 'checkbox',
    '#title' => t('Tabs'),
    '#description' => t('Alternate tabbed theme that restructures packages into tabs.'),
    '#default_value' => variable_get('module_filter_tabs', 1)
  );
  $form['tabs'] = array(
    '#type' => 'fieldset',
    '#title' => t('Tabs'),
    '#description' => t('Settings used with the tabs view of the modules page.'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE
  );
  $form['tabs']['module_filter_count_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('Number of enabled modules'),
    '#description' => t('Display the number of enabled modules in the active tab along with the total number of modules.'),
    '#default_value' => variable_get('module_filter_count_enabled', 1)
  );
  $form['tabs']['module_filter_visual_aid'] = array(
    '#type' => 'checkbox',
    '#title' => t('Visual aids'),
    '#description' => t('When enabling/disabling modules, the module name will display in the tab summary.<br />When filtering, a count of results for each tab will be presented.'),
    '#default_value' => variable_get('module_filter_visual_aid', 1)
  );
  $form['tabs']['module_filter_hide_empty_tabs'] = array(
    '#type' => 'checkbox',
    '#title' => t('Hide tabs with no results'),
    '#description' => t('When a filter returns no results for a tab, the tab is hidden. This is dependent on visual aids being enabled.'),
    '#default_value' => variable_get('module_filter_hide_empty_tabs', 0)
  );
  $form['tabs']['module_filter_dynamic_save_position'] = array(
    '#type' => 'checkbox',
    '#title' => t('Dynamic Save position'),
    '#description' => t("For sites with lots of tabs, enable to help keep the 'Save configuration' button more accessible."),
    '#default_value' => variable_get('module_filter_dynamic_save_position', 1)
  );
  return system_settings_form($form);
}
