<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/17
 * Time: 21:39
 */
require_once (__DIR__ . '/Constant.php');
function __autoload($className) {
    $relPath = implode('/', explode('_', $className));
    require_once (APP_PATH . '/' . $relPath . '.php');
}

// 允许携带信任证书
header("Access-Control-Allow-Credentials: true");
$crossHttps = Library_Conf::getConf('crossDomain');
if(!empty($crossHttps) && is_array($crossHttps)) {
    $servers = Library_Env::getServerParams();
    if(in_array( $servers['SERVER_NAME'], $crossHttps)) {
        // 允许跨域访问
        header('Access-Control-Allow-Origin:http://' .  $servers['SERVER_NAME']);
    }
}

// 开启会话
session_start();
// 设置时区
date_default_timezone_set(TIME_ZONE);
