var paper_id = GetQueryString("paper_id");
var no_exists_num = '';
var paper_title = "";
//获取没有的问题的总个数
$.ajax({
	type:"get",
	url:ajax_url+"/info_literacy/?qt=status&operation=questionnaire",
	async:false,
	dataType:"json",
	data:{
		"questionnaire_id":paper_id
	},
	success:function(data){
		no_exists_num = data["data"]["not_exists_lib_questions_num"];
	},
	error:function(){
		alert("请求失败");
	}
});

/*
 * 初始化
 */	
	//分页
	//用于存储从后台获取的数据,所有数据
	var yschoolJSON = {schoolData:[]};

	//当前页的数据
	var ycurrentPageJSON = {};

	//当前处于第几页
	var ycurrentPageNo = 1;

	//每页显示的条数
	var ypageSize = 15;
	
	//定义localstorage存储多选框的内容
	var storage=window.localStorage;
var yshowData = function() {
	
	$.ajax({
		url:ajax_url+"/info_literacy/?qt=questionnaire&operation=view_questionnaire",
		type:"get",
		data:{
			"id":paper_id
		},
		dataType:"json",
		async:false,
		success:function(data){
			if(data["data"]["title"]){
				var questions = data["data"]["questions"];
			yschoolJSON.schoolData = questions;
			paper_title = data["data"]["title"]["content"];
			$("#title").html(paper_title);
			}
			
		},
		error:function(){}
	});
	//获取当前数据，加载模版显示
	ycurrentPageJSON = ygetPageJSON(ypageSize, ycurrentPageNo);
	$("#question").html(TrimPath.processDOMTemplate("list_template", ycurrentPageJSON));
	//加点击事件	
	$("#question input").click(function(){
		//如果是选中
		var question_id = $(this).attr("quesion");
		if($(this).prop("checked")){
			storage.setItem("b_"+question_id,1);
		}else{//如果是取消
			storage.setItem("b_"+question_id,0);
		}

	});

	//循环storage 将storagekey的值为1的添加在questions的checked中，这样方便前台在翻页时显示是否以选中
		for(var i=0;i<yschoolJSON.schoolData.length;i++){
			var storagekey = 'b_'+yschoolJSON.schoolData[i]["question_id"];
			var  question_id = yschoolJSON.schoolData[i]["question_id"];
			if(storage[storagekey]==1){
				//questions[i].checked = 1;
				$("#question input[quesion="+question_id+"]").attr("checked",true);
			}
		}
	
	//加载翻页按钮
	var ytotalItems = "" + yschoolJSON.schoolData.length;

	//总记录数
	var ycurrentPage = "" + ycurrentPageNo;

	//当前页
	var ytotalPage = "" + Math.ceil(yschoolJSON.schoolData.length / ypageSize);
	if(ycurrentPageJSON["schoolData"].length){
		//总页数
	$("#page_numbers").html(makePaging(ytotalItems, ycurrentPage, ytotalPage, true, true));	
	}
	
}

//获取paper_id问卷清单


//跳转页面
var ygoPage = function(ypageNo) {

    //更新设置当前页面
    ycurrentPageNo = ypageNo;

    //获取当前页面数据
    ycurrentPageJSON = ygetPageJSON(ypageSize, ypageNo);

    //显示数据
    yshowData();
};
//翻页
$("#page_numbers").on("click",".goPageLink",function() {
    var linkId = $(this).attr("id").split("_");
    var goPageNo = new Number(linkId[3]);
    ygoPage(goPageNo);
})

//size每页显示的条数， pageNo第几页
function ygetPageJSON(size, ypageNo){
	var ypageJSON = {"schoolData" : []};

	if (yschoolJSON.schoolData.length <= size) {
		return yschoolJSON;
	} else {
		for (var i = 0; i < size; i++) {
			if ((ypageNo - 1) * size + i < yschoolJSON.schoolData.length) {
				ypageJSON.schoolData[i] = yschoolJSON.schoolData[(ypageNo - 1) * size + i];
			}
		}
		return ypageJSON;
	}
}


//没有的问题 部分


//获取paper_id没有问题的清单

	//分页
	//用于存储从后台获取的数据,所有数据
	var aschoolJSON = {aschoolData:[]};

	//当前页的数据
	var acurrentPageJSON = {};

	//当前处于第几页
	var acurrentPageNo = 1;

	//每页显示的条数
	var apageSize = 15;
	
	var ashowData = function() {
		$.ajax({
			url:ajax_url+"/info_literacy/?qt=list&operation=no_exists_questionnaire_list",
			type:"get",
			data:{
				"questionnaire_id":paper_id,
				"page":acurrentPageNo,
				"page_size":apageSize
			},
			dataType:"json",
			async:false,
			success:function(data){
				var questions = data["data"];
				aschoolJSON.aschoolData = questions;
			},
			error:function(){}
		});
	
	//获取当前数据，加载模版显示
	acurrentPageJSON = agetPageJSON(apageSize, acurrentPageNo);
	if(acurrentPageJSON["aschoolData"].length){
		$("#question_after").html(TrimPath.processDOMTemplate("list_template_after", acurrentPageJSON));
	}

	//加点击事件	
	$("#question_after input").click(function(){
		//如果是选中
		var question_id = $(this).attr("quesion");
		if($(this).prop("checked")){
			storage.setItem("a_"+question_id,1);
		}else{//如果是取消
			storage.setItem("a_"+question_id,0);
		}
	});
	
	//循环storage 将storagekey的值为1的添加在questions的checked中，这样方便前台在翻页时显示是否以选中
		for(var i=0;i<aschoolJSON.aschoolData.length;i++){
			var storagekey = 'a_'+aschoolJSON.aschoolData[i]["question_id"];
			var  question_id = aschoolJSON.aschoolData[i]["question_id"];
			if(storage[storagekey]==1){
				//questions[i].checked = 1;
				$("#question_after input[quesion="+question_id+"]").attr("checked",true);
			}
		}
	//加载翻页按钮
	var atotalItems = "" + no_exists_num;

	//总记录数
	var acurrentPage = "" + acurrentPageNo;

	//当前页
	var atotalPage = "" + Math.ceil(atotalItems / apageSize);
	//总页数
	$("#page_numbers_after").html(makePaging(atotalItems, acurrentPage, atotalPage, true, true));	
}
//跳转页面
var agoPage = function(apageNo) {

    //更新设置当前页面
    acurrentPageNo = apageNo;

    //获取当前页面数据
    acurrentPageJSON = agetPageJSON(apageSize, apageNo);

    //显示数据
    ashowData();
};
//翻页
$("#page_numbers_after").on("click",".goPageLink",function() {
    var linkId = $(this).attr("id").split("_");
    var goPageNo = new Number(linkId[3]);
    agoPage(goPageNo);
})

//size每页显示的条数， pageNo第几页
var agetPageJSON = function(size, apageNo) {
	var apageJSON = {"aschoolData" : []};

	if (aschoolJSON.aschoolData.length <= size) {
		return aschoolJSON;
	} else {
		for (var i = 0; i < size; i++) {
			if ((apageNo - 1) * size + i < aschoolJSON.aschoolData.length) {
				apageJSON.aschoolData[i] = aschoolJSON.aschoolData[(apageNo - 1) * size + i];
			}
		}
		return apageJSON;
	}
};
yshowData();
ashowData();
//删除已有的问题
$(".del").click(function(){

	if(confirm("确定要删除吗")){
		var question_ids = Array();
	
		for(var i=0;i<storage.length;i++){
			var skey = storage.key(i);
			//如果存在b，说明是已有的问题
			if(skey.indexOf("b")>-1){
				//已有的问题选中1代表要删除
				if(storage[skey] == 1){
					question_ids.push(skey.split("_")[1]);
				}
			}
		}
		var question_id = question_ids.join(",");
		if(!question_id){
			return false;
		}
		$.ajax({
			type:"post",
			url:ajax_url+"/info_literacy/?qt=edit&operation=delete_questionnaire_questions",
			async:false,
			dataType:"json",
			data:{
				"question_id":question_id,
				"questionnaire_id":paper_id
			},
			success:function(){
				ycurrentPageNo = 1;
				acurrentPageNo = 1;
				ashowData();
				yshowData();
				storage.clear();
			},
			error:function(){
				alert("连接失败");
			}
		});
	}
	
});

$(".add").click(function(){
	if(confirm("确定要添加吗")){
		var question_ids = Array();
	
		for(var i=0;i<storage.length;i++){
			var skey = storage.key(i);
			//如果存在a，说明是没有的问题
			if(skey.indexOf("a")>-1){
				//已有的问题选中 1代表要添加
				if(storage[skey] == 1){
					
					question_ids.push(skey.split("_")[1]);
				}
			}
		}
		var question_id = question_ids.join(",");
		console.log(question_id);
		if(question_id==''){
			return false;
		}
		$.ajax({
			type:"post",
			url:ajax_url+"/info_literacy/?qt=questionnaire&operation=add_questionnaire",
			async:false,
			dataType:"json",
			data:{
				"question_id":question_id,
				"questionnaire_id":paper_id
			},
			success:function(){
				ycurrentPageNo = 1;
				acurrentPageNo = 1;
				ashowData();
				yshowData();
				storage.clear();
			},
			error:function(){
				alert("连接失败");
			}
		});
	}
});

