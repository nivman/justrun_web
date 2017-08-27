<?php
//GET requests should not make changes
//Only POST requests should make changes


function request_isget(){
    return $_SERVER['REQUEST_METHOD'] == 'GET';
}

function request_ispost(){
    return $_SERVER['REQUEST_METHOD'] == 'POST';
}