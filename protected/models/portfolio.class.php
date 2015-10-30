<?php

class Portfolio {

  private $app;

  public function __construct($app) {
    $this->app = $app;
  }

  public function getPortfolio() {
    $file = __DIR__ . '/../config/portfolio.json';
    $file = file_get_contents($file);
    $json = json_decode($file, true);

    return $json;
  }

}
