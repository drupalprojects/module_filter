<?php

/**
 * @file
 *
 * @author greenSkin
 */

/*******************************************************************************
 * Callback Functions, Forms, and Tables
 ******************************************************************************/

function module_filter_autocomplete($string) {
  $files = module_rebuild_cache();
  $matches = array();
  $count = 1;
  foreach (module_rebuild_cache() as $id => $module) {
    if ($count > 10) {
      break;
    }

    $name = $module->info['name'];
    if (ereg(strtolower($string), strtolower($name)) && strtolower($string) != strtolower($name)) {
      $matches[$name] = $name;
      $count++;
    }
  }
  print drupal_to_js($matches);
  exit();
}

/**
 * Settings form for module filter.
 */
function module_filter_settings() {
  $form['module_filter_tabs'] = array(
    '#type' => 'checkbox',
    '#title' => t('Tabs'),
    '#description' => t('Themes module list into tabs.'),
    '#default_value' => variable_get('module_filter_tabs', 1)
  );
  $form['module_filter_autocomplete'] = array(
    '#type' => 'checkbox',
    '#title' => t('Autocomplete'),
    '#description' => t('Enable this to provide autocomplete suggestions of existing module names in the module filter textfield. Currently only works if tabs are disabled below.'),
    '#default_value' => variable_get('module_filter_autocomplete', 0)
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
  $form['tabs']['module_filter_dynamic_save_position'] = array(
    '#type' => 'checkbox',
    '#title' => t('Save dynamic positioning'),
    '#description' => t("DEVELOPMENTAL: For sites with lots of tabs, enable to help keep the 'Save configuration' button more accessible."),
    '#default_value' => variable_get('module_filter_dynamic_save_position', 0)
  );
  return system_settings_form($form);
}
