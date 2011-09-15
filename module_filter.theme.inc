<?php

/**
 * @file
 *
 * @author greenSkin
 */

function theme_module_filter($variables) {
  $element = $variables['element'];
  return '<div class="module-filter-inputs-wrapper">' . drupal_render_children($element) . '</div>';
}

/**
 * A router theme function.
 *
 * Appropriately themes the system modules page with alterations and based on
 * set variables
 *
 * @param $form
 *   An associative array containing the structure of the form.
 *
 * @return
 *   An output string.
 */
function theme_module_filter_system_modules($variables) {
  $form = $variables['form'];

  $output = '';
  if (variable_get('module_filter_tabs', 1)) {
    $form['module_filter']['#attached']['css'][] = drupal_get_path('module', 'module_filter') .'/css/module_filter_tab.css';
    $form['module_filter']['#attached']['js'][] = 'misc/jquery.ba-bbq.js';
    $form['module_filter']['#attached']['js'][] = drupal_get_path('module', 'module_filter') .'/js/module_filter_tab.js';

    if (variable_get('module_filter_dynamic_save_position', 1)) {
      $form['module_filter']['#attached']['js'][] = drupal_get_path('module', 'module_filter') .'/js/dynamic_position.js';
    }

    $output .= theme('module_filter_system_modules_tabs', $form);
  }
  else {
    $form['#theme'] = 'system_modules';

    $output .= drupal_render($form['module_filter']);
    $output .= drupal_render($form['modules']);
    $output .= drupal_render($form['actions']);
  }

  return $output;
}

/**
 * Theme callback for the modules tabbed form.
 */
function theme_module_filter_system_modules_tabs($variables) {
  $form = $variables['form'];

  $form['actions']['#prefix'] = '<div id="module-filter-submit">';
  $form['actions']['#suffix'] = '</div>';

  $header = array(
    t('Enabled'),
    t('Name'),
    t('Version'),
    t('Description')
  );
  $rows = array();
  $flip = array('even' => 'odd', 'odd' => 'even');
  foreach (element_children($form['modules']) as $package) {
    $rows[] = array('data' => array(array('data' => '<h3>' . $form['modules'][$package]['#title'] . '</h3>', 'colspan' => 4)), 'class' => array('admin-package-title'));
    $rows[] = array('data' => $header, 'class' => array('admin-package-header'));

    $class = 'odd';
    $enabled[$package] = array();
    foreach (element_children($form['modules'][$package]) as $key) {
      $module = &$form['modules'][$package][$key];

      $enabled[$package][] = $module['enable']['#default_value'];

      $row = array();
      unset($module['enable']['#title']);
      $row[] = array('class' => array('checkbox'), 'data' => drupal_render($module['enable']));
      $label = '<label';
      if (isset($module['enable']['#id'])) {
        $label .= ' for="' . $module['enable']['#id'] . '"';
      }
      $row[] = array('class' => array('name'), 'data' => $label . '><strong>' . drupal_render($module['name']) . '</strong></label>');
      $row[] = array('class' => array('version'), 'data' => drupal_render($module['version']));
      // Add the description, along with any modules it requires and any
      // operation links.
      $description = drupal_render($module['description']);
      $items = array();
      foreach (array('help', 'permissions', 'configure') as $link) {
        $data = drupal_render($module['links'][$link]);
        if (!empty($data)) {
          $items[] = array('data' => $data);
        }
      }
      if (!empty($items)) {
        $description .= '<div class="admin-operations">' . theme('item_list', array('items' => $items, 'attributes' => array('class' => array('links', 'inline')))) . '</div>';
      }
      $description .= drupal_render($module['links']);
      if ($module['#requires']) {
        $description .= '<div class="admin-requirements">' . t('Requires: !module-list', array('!module-list' => implode(', ', $module['#requires']))) . '</div>';
      }
      if ($module['#required_by']) {
        $description .= '<div class="admin-requirements">' . t('Required by: !module-list', array('!module-list' => implode(', ', $module['#required_by']))) . '</div>';
      }
      $row[] = array('data' => $description, 'class' => array('description'));
      $rows[] = array('data' => $row, 'no_striping' => TRUE, 'class' => array(module_filter_get_id($package) . '-tab', 'module', $class));
      $class = $flip[$class];
    }

    // Set the package as printed.
    $form['modules'][$package]['#printed'] = TRUE;
  }

  if (variable_get('module_filter_count_enabled', 1)) {
    $enabled_counts = array();
    foreach ($enabled as $package => $value) {
      $enabled_counts[module_filter_get_id($package)] = array(
        'enabled' => count(array_filter($value)),
        'total' => count($value),
      );
    }
    drupal_add_js(array(
      'moduleFilter' => array(
        'enabledCounts' => $enabled_counts
      )
    ), 'setting');
  }

  // Add first and last class to rows.
  $rows[0]['class'][] = 'first';
  $rows[count($rows) - 1]['class'][] = 'last';

  $output = '<div id="module-filter-wrapper">';
  $output .= '<div id="module-filter-modules">' . drupal_render($form['module_filter']);
  $output .= theme('table', array('header' => $header, 'rows' => $rows));
  $output .= '</div>';
  $output .= drupal_render_children($form) . '</div>';
  return $output;
}
