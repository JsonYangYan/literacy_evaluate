<?php
/**
 * 成绩查询
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/1
 * Time: 13:53
 */
class Action_Result extends Library_Interface_Action{

    public function __construct() {
    }

    /**
     * 参数检查
     * @param $params
     * @return bool
     */
    public function checkParams($params)
    {
        if(!isset($params['operation'])) {
            return false;
        }
        if($params['operation'] == 'student' && !isset($params['sno'])) {
            return false;
        }
        if($params['operation'] == 'school' && !isset($params['school_id'])) {
            return false;
        }
        if($params['operation'] == 'edu_depart' && !isset($params['edu_depart_id'])) {
            return false;
        }
        if($params['operation'] == 'primary_edu_depart' && !isset($params['edu_depart_id'])) {
            return false;
        }
        return true;
    }




    /**
     * 入口
     */
    public function execute()
    {
        // TODO: Implement execute() method.
        $params = Library_Env::getAllParams();
        if(isset($params['test_times']) ) {
            $testTimes = $params['test_times'];
        }

        $checkStatus = $this->checkParams($params);
        if(!$checkStatus) {
            $this->putParamsError();
        }
        $type = $params['operation'];
        $service = new Service_Result();
        if(isset($testTimes)) {
            $params['test_times'] = $testTimes;
        }
        $params['operation'] = $type;
        $res = $service->execute($params);
        $msg = 'fail';
        if($res && is_bool($res)) {
            $msg = 'success';
        } else if(!is_bool($res)) {
            $msg = $res;
        }
        $this->put($msg);
    }

}