<?php


function end_session(){
    session_unset();
    session_destroy();
}

function request_ip_matches_session(){
    if(!isset($_SESSION['ip']) || !isset($_SERVER['REMOTE_ADDR'])){
        return false;
    }

    if($_SESSION['ip'] === $_SERVER['REMOTE_ADDR']){
        return true;
    }else{
        return false;
    }
}

function request_user_agent_matches_session(){
    if(!isset($_SESSION['user_agent']) || !isset($_SERVER['HTTP_USER_AGENT'])){
        return false;
    }

    if($_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT']){
        return true;
    }else{
        return false;
    }
}
//has too much time passed since the last login
function last_login_is_recent(){
    $max_elapsed = 60 * 60 * 24; // 1 day
    if (!isset($_SESSION['last_login'])){
        return false;
    }

    if (($_SESSION['last_login']) + $max_elapsed >= time()){
        return true;
    }else{
        return false;
    }
}
// should the session be considered valid
function is_session_valid(){
   $check_ip = false;
    $check_user_agent = true;
    $check_last_login = false;

    if ($check_ip && !request_ip_matches_session()){
        return false;
    }
    if ($check_user_agent && !request_user_agent_matches_session()){
        return false;
    }
    if ($check_last_login && !last_login_is_recent()){
        return false;
    }
    return true;
}

// if session is not valid, end and rediorect to login page.
function confirm_session_is_valid(){
   if(!is_session_valid()){
       end_session();
       exit;
   } 
}
//is user logged in already?
function is_logged_in(){
    return (isset($_SESSION['logged_in']) && $_SESSION['logged_in']);
}

//if user is not logged in, end and redirect to login page.
function confirm_user_logged_in(){
    if (!is_logged_in()){
        end_session();
    }
}

// Actions to preform after every successful login
function after_successful_login(){
    //Regenerate session ID to invalidate to old one.
    session_regenerate_id();
    $_SESSION['logged_in'] = true;
    //Save these valus in the session, even when check aren't enabled.
    $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
    $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    $_SESSION['last_login'] = time();
}

// Actions to preform after every successful logout
function after_successful_logout(){
    $_SESSION['logged_in'] = false;
    //Save these valus in the session, even when check aren't enabled.
    end_session();
}

function before_every_protected_page(){
    //Regenerate session ID to invalidate to old one.
    confirm_user_logged_in();
    confirm_session_is_valid();
}
