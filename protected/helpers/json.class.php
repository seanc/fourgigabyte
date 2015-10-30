<?php

class JSONResponse {

  private static $json;

  public static function send($res) {
    self::$json = $res;
    return json_encode(self::$json);
  }

}
