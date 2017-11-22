//试卷的id

var questionnaire_id = 0;
var allDone = 0;
questionnaire_id = GetQueryString("paper_id");
$.ajax({
	type:"get",
	url:ajax_url+"/info_literacy/",
	data:{
		"qt":"questionnaire",
		"operation":"view_questionnaire",
		"id":questionnaire_id
	},
	async:true,
	dataType:"json",
	success:function(data){
		questionnaire_id = data["data"]["title"]["questionnaire_id"];
		var title = data["data"]["title"]["content"];
		$(".header_title").html(title);
		var questions = data["data"]["questions"];
			schoolJSON.schoolData = questions;
			showData();
		//把初始变量保存到在缓存中
		var storage = window.localStorage;
		var val_arr = data["data"]["questions"];
		for(var i = 0; i< val_arr.length;i++) {
			if(!storage[val_arr[i]["question_id"]]){
				storage[val_arr[i]["question_id"]] = '';
			}
		}
		//进度条
		change_bar();
	},
	error:function(){
		alert("加载失败");
	}
});

//翻页
$("#page_numbers").on("click",".goPageLink",function() {
    var linkId = $(this).attr("id").split("_");
    var goPageNo = new Number(linkId[3]);
    goPage(goPageNo);
})

//size每页显示的条数， pageNo第几页
var getPageJSON = function(size, pageNo) {
	var pageJSON = {"schoolData" : []};

	if (schoolJSON.schoolData.length <= size) {
		return schoolJSON;
	} else {
		for (var i = 0; i < size; i++) {
			if ((pageNo - 1) * size + i < schoolJSON.schoolData.length) {
				pageJSON.schoolData[i] = schoolJSON.schoolData[(pageNo - 1) * size + i];
			}
		}
		return pageJSON;
	}
};

//跳转页面
var goPage = function(pageNo) {

    //更新设置当前页面
    currentPageNo = pageNo;

    //获取当前页面数据
    currentPageJSON = getPageJSON(pageSize, pageNo);

    //显示数据
    showData();
};

var showData = function() {
	
	//获取当前数据，加载模版显示
	currentPageJSON = getPageJSON(pageSize, currentPageNo);
	
	$("#question").html(TrimPath.processDOMTemplate("list_template", currentPageJSON));
	
	//加载翻页按钮
	var totalItems = "" + schoolJSON.schoolData.length;

	//总记录数
	var currentPage = "" + currentPageNo;

	//当前页
	var totalPage = "" + Math.ceil(schoolJSON.schoolData.length / pageSize);

	//总页数
	$("#page_numbers").html(makePaging(totalItems, currentPage, totalPage, true, true));
	console.log(currentPageJSON);
	//循环将存在storage中的值取出来  key=>value    key为选项id的值，value为A,B,C
	var leng= currentPageJSON['schoolData'].length;
	var storage = window.localStorage;
	for(var i=0;i<leng;i++){
		var key = currentPageJSON['schoolData'][i]["question_id"];
		if(storage[key] != 'undefined' && storage[key]){
			var arr = storage[key].split(",");
			var options_arr = currentPageJSON['schoolData'][i]["options"];
			//console.log(options_arr);
			for(var j=0;j<options_arr.length;j++) {
				if($.inArray(options_arr[j]["order"],arr)!=-1) {
					var nam = options_arr[j]["order"];
					$("input[name="+key+"][value="+nam+"]").prop("checked",true);
				}
			}
		}
		
	}
}

/*
 * 初始化
 */	
	//分页
	//用于存储从后台获取的数据,所有数据
	var schoolJSON = {schoolData:[]};

	//当前页的数据
	var currentPageJSON = {};

	//当前处于第几页
	var currentPageNo = 1;

	//每页显示的条数
	var pageSize = 5;
	
//开始答题或者改变选项触发的事件

//单选按钮的改变
function radio_change(obj){
	//alert($(obj).attr("name"));
	var storage = window.localStorage;
	storage[$(obj).attr("name")] = $(obj).val();
	change_bar();
}

//多选按钮的改变
function textbox_change(obj){
	var storage = window.localStorage;
	var key = $(obj).attr("name");
	var val = $("input[name="+key+"]").val();
	//遍历多选框
	var chk_value = [];
	$("input[name="+key+"]:checked").each(function(){
   		chk_value.push($(this).val());    
  	}); 
  	//将数组转变成用逗号隔开的字符串
  	var str = chk_value.join(",");
  	storage[key] = str;
  	change_bar();
}

//进度条的改变
function change_bar() {

	var storage = window.localStorage;
	console.log(storage);
	var leng = storage.length;
	console.log(leng);
	var curr_leng = 0;
	for (var i = 0; i<leng; i++) {
		if(storage[storage.key(i)]!='') {
			//console.log(storage.key(i));
			curr_leng++;
		}
	}
	
	var pent=(curr_leng/leng)*100;
    $(".charts").animate({width: pent + "%"},100);
    var c=Math.round(pent*100)/100+"%";//保留小数点后两位
  	allDone = c;
    $(".last").html(c);
    //完成的时候才能提交
    if(allDone=="100%"){
    	$("#submit_button").attr("style","background-color:#ffc300");
    	$("#submit_button").removeAttr("disabled");
    }else{
    	$("#submit_button").attr("style","background-color:#cccccc");
    	$("#submit_button").attr("disabled","disabled");
    }
}

//提交试卷
$("#submit_button").click(function(){
	var storage = window.localStorage;
	var leng = storage.length;
	
	for (var i = 0; i<leng; i++) {
		hashMap.Set(storage.key(i),storage[storage.key(i)]);
	}
	var answer_str = JSON.stringify(hashMap);
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=answers",
		async:true,
		dataType:"json",
		data:{
			"answer":answer_str,
			"questionnaire_id":questionnaire_id,
			"test_times":1
		},
		success:function(data){
			storage.clear();
//			alert(data["data"]);
			alert("提交成功");
			window.location.href = "schoo_login.html";
		},
		error:function(){
			alert("添加失败");
		}
	});
});

function comeBack() {
	
	window.location.href = "middle_page.html";
}

