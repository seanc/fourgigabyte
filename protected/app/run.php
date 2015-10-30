<?php

session_cache_limiter(false);
session_start();

require('vendor/autoload.php');
require('protected/config/config.class.php');
require('protected/helpers/nocsrf.class.php');
require('protected/models/portfolio.class.php');
require('protected/helpers/json.class.php');

/* Initialize Slim & Configure */
$app = new \Slim\Slim([
  'view' => new \Slim\Views\Twig(),
  'debug' => true
]);

$app->config = function() {
  return new Config();
};
// $app->db = function() use ($app) { Not needed
//   $cfg = $app->config->get('database');
//   return new db('mysql:host=' . $cfg->host . ';dbname=' . $cfg->name, $cfg->user, $cfg->pass);
// };

/* Set Template Engine */
$view = $app->view();
$view->setTemplatesDirectory('protected/views');
$view->parserExtensions = [
  new \Slim\Views\TwigExtension()
];
// $view->appendData(array(
//   'csrf_token' => NoCSRF::generate('csrf_token')
// ));

/* Load Controllers */
if(!function_exists('glob_recursive')) {
  function glob_recursive($pattern, $flags = 0) {
    $files = glob($pattern, $flags);
    foreach(glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
      $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
  }
}
$controllers = glob_recursive('protected/controllers/*.controller.php');
foreach($controllers as $controller) {
  require($controller);
}
