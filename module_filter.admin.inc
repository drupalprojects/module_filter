<?php
// $Id$

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
    '#description' => t('Themes module list into tabs.'),
    '#default_value' => variable_get('module_filter_tabs', 1)
  );
  $form['module_filter_autocomplete'] = array(
    '#type' => 'checkbox',
    '#title' => t('Autocomplete'),
    '#description' => t('Enable this to provide autocomplete suggestions of existing module names in the module filter textfield. Currently only works if tabs are disabled below.'),
    '#default_value' => variable_get('module_filter_autocomplete', 0)
  );
  return system_settings_form($form);
}
