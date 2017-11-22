var is_online = true;
var operation = '';
var edu_depart_id = '';
var school_id = '';
var sno = "";
var is_primary_edu_depart = "";
var check_login = function(){
	operation = '';
	edu_depart_id = '';
	school_id = '';
	sno = "";
	is_primary_edu_depart = "";
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=login&operation=validate",
		async:false,
		dataType:"json",
		data:{},
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success:function(data){
			console.log(data);
			if(data["data"]["status"] == "online"){
				operation = data["data"]["login_type"];
				if(data["data"]["edu_depart_id"]){
					edu_depart_id = data["data"]["edu_depart_id"];
				}
				if(data["data"]["school_id"]) {
					school_id = data["data"]["school_id"];
				}
				if(data["data"]["account"] && operation=="student"){
					sno = data["data"]["account"];
					$(".nav").hide();
					$(".nav_active").show();
					$("#go_back").show();
				}
				if(data["data"]["is_primary_edu_depart"]) {
					is_primary_edu_depart = data["data"]["is_primary_edu_depart"];
				}
			
			}else{
				is_online = false;
			}
		},
		error:function(){
			alert("连接失败");
		}
	});
}
check_login();

$(function(){
	if(!is_online) return false;
	//验证是否登录
	var test_times = 1;
	var data_input = {};
	if(is_primary_edu_depart == "yes") {
		data_input["operation"] = "primary_edu_depart";
	}else{
		data_input["operation"] = operation;
	}
	
	if(sno) data_input["sno"] = sno;
	if(school_id) data_input["school_id"] = school_id;
	if(edu_depart_id) data_input["edu_depart_id"] = edu_depart_id;
	if(test_times) data_input["test_times"] = test_times;
	console.log(data_input);
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=result",
		async:false,
		data:data_input,
		dataType:"json",
		success:function(data){
			console.log(data);
			var data_content = {data:[]};
			data_content["data"] = data["data"]["test_times_1"];
			$("#container").html(TrimPath.processDOMTemplate("list_template", data_content));
		},
		error:function(){
			
		}
	});
});

function comeBack() {
	
	window.location.href = "middle_page.html";
}