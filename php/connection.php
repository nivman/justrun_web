<?php



header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header("Content-Type: text/html; charset=utf-8");

define("UPLOAD_DIR", "/home/nimadral/public_html/justrun/files/");
define("Image_DIR", "/home/nimadral/public_html/justrun/images/profile/");
define("Files_DIR", "justrun/files");
$db = new PDO("mysql:host=localhost;dbname=nimadral_justrun", 'nimadral_justrun', 'cLapRla25eni');
$db->exec("SET NAMES UTF8");
$db->setAttribute( PDO::ATTR_EMULATE_PREPARES, false );


//$dir =  __DIR__.'/functions/';
//foreach(glob($dir.'*.php') as $file) {
//    include_once $file;
//}