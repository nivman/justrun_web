<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    ini_set("date.timezone", "Asia/Jerusalem");
    date_default_timezone_set("Asia/Jerusalem");
    $errors = array();
    $dataarr = array();

    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    

    if(!empty($_GET['actionname'])) {
        switch ($_GET['actionname']) {
            case 'getevents':
                $month = $_GET['month'];
                $dataarr = $db->prepare("SELECT * FROM events WHERE MONTH(event_date) = :monthdate");
                $dataarr->execute([
                    'monthdate'=>$month
                ]);
                $dataarr = $dataarr->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($dataarr);
                break;
            case 'gettrx':
                $dataarr = $db->prepare("SELECT * FROM trx WHERE user_id <> ''");
                $dataarr->execute();
                $dataarr = $dataarr->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($dataarr);
                break;
            case 'delete':
                $event_id = $_GET['event_id'];
                $user_id = $_GET['user_id'];
                $dataarr = $db->prepare("DELETE FROM trx WHERE event_id = :event_id AND user_id = :user_id");
                $dataarr->execute([
                    'event_id' => $event_id,
                    'user_id' => $user_id
                ]);
                $dataarr = $dataarr->errorInfo();
                echo json_encode($dataarr);
                break;
            case 'deleteevent':
                $event_id = $_GET['event_id'];
                $dataarr = $db->prepare("DELETE FROM trx WHERE event_id = :event_id");
                $dataarr->execute([
                    'event_id' => $event_id
                ]);
                $dataarr = $db->prepare("DELETE FROM events WHERE event_id = :event_id");
                $dataarr->execute([
                    'event_id' => $event_id
                ]);
                $dataarr = $dataarr->errorInfo();
                echo json_encode($event_id);
                break;

            //SMS REMINDER
//            case 'reminder':
//                $phone_numbers = $_GET['phonenumbers'];
//                try {
//                    $message = array('to' => "+972544490395", 'message' => 'this is test text');
//                    $done = $cloclwork->send($message);
//                    if ($result['success']) {
//                        echo 'Message sent - ID: ' . $result['id'];
//                    } else {
//                        echo 'Message failed - Error: ' . $result['error_message'];
//                    }
//                }
//                catch (ClockworkException $e)
//                {
//                    echo 'Exception sending SMS: ' . $e->getMessage();
//                }
//                echo $result;
//                break;

            case 'insertrx':
                $approved = $_GET['approved'];
                $cancel = $_GET['cancel'];
                $arrived = $_GET['arrived'];
                $paid = $_GET['paid'];
                $event_id = $_GET['event_id'];
                $user_id = $_GET['userid'];
                $sqlstring = "INSERT INTO trx(user_id,event_id,approved_customer,cancel_customer,arrived,paid) VALUES(:user_id,:event_id,:approved,:cancel,:arrived,:paid)";
                $dataarr = $db->prepare($sqlstring);
                $dataarr->execute([
                    'user_id' =>  $user_id,
                    'event_id' =>   $event_id,
                    'approved' =>  $approved,
                    'cancel' =>  $cancel,
                    'arrived' =>  $arrived ,
                    'paid' =>  $paid
                ]);
                $dataarr = $dataarr->errorInfo();
                echo json_encode($dataarr) ;
                break;
            case 'insertevent':
                $event_id = $_GET['event_id'];
                $event_time = $_GET['event_time'];
                $event_date = $_GET['event_date'];
                $sqlstring = "INSERT INTO events(event_id,event_time,event_date) VALUES(:event_id,:event_time,:event_date)";
                $dataarr = $db->prepare($sqlstring);
                $dataarr->execute([
                    'event_id' => $event_id,
                    'event_time' =>  $event_time,
                    'event_date' =>  $event_date,

                ]);
                break;
            case 'updateTrxEventTime':

                $event_id = $_GET['event_id'];
                $event_time = $_GET['event_time'];
                $sqlstring = "UPDATE events SET event_time = :event_time  WHERE event_id = :event_id";
                $dataarr = $db->prepare($sqlstring);
                $dataarr->execute([
                    'event_id' => $event_id,
                    'event_time' => $event_time

                ]);
                echo json_encode($dataarr) ;

                break;
            case 'updateTrxEventTimeInCalendar':



                $start=  $data-> start;
                $end=  $data-> end;
                $description=  $data-> description;
                echo json_encode($data) ;
                $sqlstring = "UPDATE calendar SET start = :start,end=:end WHERE description= :description";
                $dataarr = $db->prepare($sqlstring);
                $dataarr->execute([
                    'start' => $start,
                    'end' => $end,
                    'description'=>$description

                ]);

                //    echo json_encode($end) ;

                break;
            case 'updatecustomer':
                $event_id = $_GET['event_id'];
                $user_id = $_GET['user_id'];
                $arrived = $_GET['arrived'];
                $paid = $_GET['paid'];
                $amount = $_GET['amount'];
                $sqlstring = "UPDATE trx SET arrived = :arrived,paid =:paid,amount =:amount WHERE event_id = :event_id AND user_id = :user_id";
                $dataarr = $db->prepare($sqlstring);
                $dataarr->execute([
                    'event_id' => $event_id,
                    'user_id' => $user_id,
                    'arrived' =>  $arrived,
                    'paid' =>  $paid,
                    'amount' => $amount
                ]);
                $dataarr = $dataarr->errorInfo();
                echo json_encode($dataarr);
                break;

            case 'getlastidcustomer':
                $dataarr = $db->prepare("SELECT  MAX(id) FROM customers");
                $dataarr->execute();
                $dataarr = $dataarr->fetchColumn(0);
                echo json_encode($dataarr);
                break;
        }
    }
    else {
        $actionname = $data->actionname;

        if (empty($data->entity->users_id))
            $errors['users_id'] = 'שדה חובה';

        if (empty($data->entity->date))
            $errors['date'] = 'שדה חובה';

        if (empty($data->entity->time))
            $errors['time'] = 'שדה חובה';



        if (!empty($errors)) {
            $dataarr['errors'] = $errors;
        } else {
            switch ($actionname) {
                case 'create':
                    $dataarr = $db->prepare("SELECT event_id FROM events WHERE event_id = :event_id");
                    $dataarr->execute([
                        'event_id'=>$event_id
                    ]);
                    $id = $dataarr->fetchColumn(0);

                    if($id) {
                        $sqlstring ="INSERT INTO trx(user_id,event_id,approved_customer,cancel_customer,arrived,paid) VALUES(:users_id,:event_id,:approved,:cancel,:arrived,:paid)";
                        $sqlstring = "UPDATE trx SET user_id = :users_id WHERE id = $id";
                        $dataarr = $db->prepare($sqlstring);
                        $dataarr->execute([
                            'users_id' => ',' . $data->entity->users_id,
                            'event_id' => ',' .  $event_id,
                            'approved' => ',' . $approved,
                            'cancel' => ',' . $cancel,
                            'arrived' => ',' . $arrived ,
                            'paid' => ',' . $paid
                        ]);
                    }else{
                        $sqlstring ="INSERT INTO trx(user_id,trx_date,trx_time,event_id) VALUES(:users_id,:trx_date,:trx_time,:event_id)";
                        $dataarr = $db->prepare($sqlstring);
                        $dataarr->execute([
                            'users_id' => $data->entity->users_id,
                            'trx_date' => $data->entity->date,
                            'trx_time' => $data->entity->time,
                            'event_id' => $event_id
                        ]);
                        $last_id = $db->lastInsertId();
//                    echo json_encode($last_id) ;
                    }
            }
            $dataarr = $dataarr->errorInfo();
            echo json_encode($dataarr) ;

        }
    }
}
