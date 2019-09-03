<?php

function getCardlessClient()
{
    return new \GoCardlessPro\Client([
        // We recommend storing your access token in an
        // environment variable for security
        'access_token' => env('GOCARDLESS_TOKEN'),
        // Change me to LIVE when you're ready to go live
        'environment' => \GoCardlessPro\Environment::SANDBOX
    ]);
}

function getRandomSessionId()
{
    $d = date("d");
    $m = date("m");
    $y = date("Y");
    $t = time();
    $dmt = $d + $m + $y + $t;
    $ran = rand(0, 10000000);
    $dmtran = $dmt + $ran;
    $un = uniqid();
    $dmtun = $dmt . $un;
    $mdun = md5($dmtran . $un);
    $sort = substr($mdun, 32);
    return $mdun;
}