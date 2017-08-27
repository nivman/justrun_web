<?php

//Sanitize for html
function h($string){
    return htmlspecialchars($string);
}

//Sanitize for JavaScript
function j($string){
    return json_encode($string);
}

//Sanitize for url
function u($string){
    return urlencode($string);
}