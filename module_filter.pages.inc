<?php

/**
 * Wrapper function for update_status().
 *
 * @see update_status().
 */
function module_filter_update_status() {
  module_load_include('inc', 'update', 'update.report');
  $update_report = update_status();

  return array(
    'module_filter' => drupal_get_form('module_filter_update_status_form'),
    'update_report' => array(
      '#markup' => $update_report
    )
  );
}

function module_filter_update_status_form($form, &$form_state) {
  $form['module_filter'] = array(
    '#type' => 'module_filter',
    '#attached' => array(
      'css' => array(
        drupal_get_path('module', 'module_filter') . '/css/update_status.css'
      ),
      'js' => array(
        drupal_get_path('module', 'module_filter') . '/js/update_status.js'
      ),
    ),
  );
  $checkbox_defaults = array(
    ((isset($_GET['ok'])) ? $_GET['ok'] : 1) ? 'ok' : '',
    ((isset($_GET['warning'])) ? $_GET['warning'] : 1) ? 'warning' : '',
    ((isset($_GET['error'])) ? $_GET['error'] : 1) ? 'error' : '',
    ((isset($_GET['unknown'])) ? $_GET['unknown'] : 1) ? 'unknown' : '',
  );
  $form['module_filter']['show'] = array(
    '#type' => 'checkboxes',
    '#default_value' => array_filter($checkbox_defaults),
    '#options' => array('ok' => t('Up-to-Date'), 'warning' => t('Update available'), 'error' => t('Security update'), 'unknown' => t('Unknown')),
    '#prefix' => '<div id="module-filter-show-wrapper">',
    '#suffix' => '</div>'
  );
  return $form;
}
