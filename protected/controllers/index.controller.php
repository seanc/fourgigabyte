<?php

$app->get('/', function() use ($app) {
  $work = new Portfolio($app);

  $app->render('index.twig', ['portfolio' => $work->getPortfolio(), 'csrf_token' => NoCSRF::generate('csrf_token')]);
});
