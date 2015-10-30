<?php

$app->group('/api', function() use ($app) {

  $app->get('/', function() use ($app) {

  });

  $app->group('/contact', function() use ($app) {

    $app->post('/submit', function() use ($app) {
      $app->response->headers->set('Content-Type', 'application/json');

      try {
        NoCSRF::check('csrf_token', $app->request->post(), true, 60*10, false);

        $errors = '';

        $name = $app->request->post('name');
        $email = $app->request->post('email');
        $message = $app->request->post('message');

        if(empty($name) || !preg_match("/^[a-zA-Z ]*$/", $name)) {
          $errors .= "Please enter a valid name \n";
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          $errors .= "Please enter a valid email \n";
        }
        if(empty($message) || !preg_match("/^[a-zA-Z ]*$/", $message)) {
          $errors .= "Please enter a valid message \n";
        }

        if(!empty($errors)) {
          $json = array(
            'error' => $errors
          );
          echo JSONResponse::send($json);
          return;
        }

        $sendgrid = new SendGrid('API_KEY_HERE');
        $email = new SendGrid\Email();

        $email
          ->addTo($app->config->get('smtp')->to)
          ->setFrom('inquiry@fourgigabyte.com')
          ->setSubject('Inquiry from ' . $name)
          ->setText($message);

          try {
            $sendgrid->send($email);
          } catch (\SendGrid\Exception $e) {
            $json = array(
              'error' => ''
            );
            foreach($e->getErrors() as $err) {
              $json['error'] .= $err . "\n";
            }
            echo JSONResponse::send($json);
          }

        $json = array(
          'message' => 'success'
        );
        echo JSONResponse::send($json);

      } catch (Exception $e) {
        $json = array(
          'error' => $e->getMessage()
        );
        echo JSONResponse::send($json);
      }

    });

  });

});
