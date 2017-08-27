<?php
//Generate a token for use with CSRF protection.
//Does not store the token.
function csrf_token (){
    return bin2hex(openssl_random_pseudo_bytes(16));
}

//Generate and store CSRF token in user session.
//Requires session to have been started already.
function create_csrf_token(){
    $token = csrf_token();
    $_SESSION['csrf_token'] = $token;
    $_SESSION['csrf_token_time'] = time();
    return $token;
}

function destory_csrf_token(){
    $token = csrf_token();
    $_SESSION['csrf_token'] = null;
    $_SESSION['csrf_token_time'] = null;
    return true;
}

function csrf_token_tag(){
    $token = create_csrf_token();
    return "<input type =\hidden\"name=\"csrf_token\" value=\"".$token."\">";
}

function csrf_token_is_valid(){
    if (isset($_POST['csrf_token'])){
    $user_token = $_POST['csrf_token'];
        $stored_token = $_SESSION['csrf_token'];
        return $user_token === $stored_token;
    }else{
        return false;
    }
}

function die_on_csrf_token_failure(){
    if (!csrf_token_is_valid()){
        die("CSRF token valation failed.");
    }
}

function csrf_token_is_recent(){
    $max_elapsed = 60 * 60 * 24; //1 day
    if (isset($_SESSION['csrf_token_time'])){
        $stored_time =$_SESSION['csrf_token_time'];
        return ($stored_time + $max_elapsed) >= time();
    }else{
        destory_csrf_token();
        return false;
    }
}