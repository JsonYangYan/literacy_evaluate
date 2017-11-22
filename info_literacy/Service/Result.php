<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/4
 * Time: 20:30
 */
class Service_Result extends Library_Interface_Service{

    private $_prefixTestTimes;
    function __construct()
    {
        $this->_prefixTestTimes = 'test_times_';
    }


    /**
     * 格式化数据
     * @param $from
     * @return array
     */
    private function formatData($from) {
        $to = array();
        foreach($from['data'] as $item) {
            $to[] = array(
                'content' => $item['name'],
                'score' => round(array_sum($item['scores'])/count($item['scores']), 2),
            );
        }
        return $to;
    }


    /**
     * 学生成绩查看
     * @param $sno
     * @param int $testTimes
     * @return array|bool
     */
    public function getStudentResultBySno($sno, $testTimes = 1) {
        $evaluationObj = new Service_Evaluation();
        $result = $evaluationObj->getIndividualEvaluation($sno, $testTimes);
        return $result;
    }

    /**
     * 学校成绩查看
     * @param $schoolId
     * @param int $testTimes
     * @return mixed
     */
    public function getSchoolResultBySchoolId($schoolId, $testTimes = 1) {
        $params = array(
            'type' => 'overview',
            'test_times' => $testTimes,
            'school_id' => $schoolId,
            'order_by_gender' => 'no',
        );
        $schoolDao = new Dao_School();
        $schoolInfo = $schoolDao->getSchoolInfoByIds(array($schoolId));
        $params['edu_depart_id'] = $schoolInfo[0]['edu_depart_id'];
        $evaluationObj = new Service_Evaluation();
        $result = $evaluationObj->getEduDepartEvaluation($params);
        $key = $this->_prefixTestTimes . $testTimes;
        $ret[$key] = $this->formatData($result);
        return $ret;
    }

    /**
     * 区域成绩查看
     * @param $eduDepartId
     * @param string $operation
     * @param int $testTimes
     * @return mixed
     */
    public function getEduDepartResultByEduDepartId($eduDepartId,  $operation = 'edu_depart', $testTimes = 1) {
        $params = array(
            'type' => 'overview',
            'test_times' => $testTimes,
            'edu_depart_id' => $eduDepartId,
            'order_by_gender' => 'no',
        );

        if($operation == 'primary_edu_depart') {
            $params['edu_depart_id'] = 0;
            $params['edu_primary_depart_id'] = $eduDepartId;
        } else {
            $departmentDao = new Dao_Department();
            $departmentInfo = $departmentDao->getDepartmentInfoById($eduDepartId);
            $params['edu_primary_depart_id'] = $departmentInfo[0]['parent_id'];
        }
        $evaluationObj = new Service_Evaluation();
        $result = $evaluationObj->getEduPrimaryDepartEvaluation($params);
        $key = $this->_prefixTestTimes . $testTimes;
        $ret[$key] = $this->formatData($result);
        return $ret;
    }

    public function execute($params)
    {
        $ret = array();
        $key = '';
        foreach($params as $queryStr => $param) {
            if($queryStr == 'operation') {
                continue;
            }
            $key .= $queryStr . '_' . $param;
        }
        $redis = new Library_Redis();
        $ret = $redis->get($key);
        if(!empty($ret)) {
            $ret = json_decode(gzuncompress($ret), true);
        } else {
            if(!isset($params['testTime'])) {
                $params['testTime'] = 1;
            }
            switch($params['operation']) {
                case 'student' :
                    $ret = $this->getStudentResultBySno($params['sno'], $params['testTime']);
                    break;
                case 'school' :
                    $ret = $this->getSchoolResultBySchoolId($params['school_id'], $params['testTime']);
                    break;
                case 'primary_edu_depart' :
                case 'edu_depart' :
                    $ret = $this->getEduDepartResultByEduDepartId($params['edu_depart_id'], $params['operation'], $params['testTime']);
                    break;
                default:
                    break;
            }
            $redis->setex($key, REDIS_TTL, gzcompress(json_encode($ret)));
        }
        return $ret;
    }
}