//var ajax_url = "http://122.204.161.235:8080";
var ajax_url = "http://localhost";

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//写hashMap方法
var hashMap = {  
    Set : function(key,value){this[key] = value},  
    Get : function(key){return this[key]}, 
    Contains : function(key){return this.Get(key) == null?false:true},  
    Remove : function(key){delete this[key]}  
} 
// 将Object的属性值输出成Array
function objOfValueToArr(object) {
	var arr = [];
	var i = 0;
    for (var item in object) {
    	arr[i] = object[item];
    	i++;
	}
	return arr;
}

//退出登录
function goCancle(){
	var operation = "";
	var location_url = "";
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
			if(data["data"]["status"] == "online"){
				operation = data["data"]["login_type"];
				
			}else{
				window.location.href="expert_login.html";
			}
		},
		error:function(){
			alert("连接失败");
		}
	});
	if(operation == "school") {
		location_url = "school_login.html";
	}else if(operation == "student") {
		location_url = "index.html";
	}else {
		location_url = "expert_login.html";
	}
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=login&operation=logout",
		async:false,
		dataType:"json",
		success:function(){
			window.location.href=location_url;
		},
		error:function(){
			alert("连接失败");
		}
	});
}

window.onload=function(){
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
			var name = data["data"]["name"]+" 欢迎您"; 
			$("#type").html(name);
		},
		error:function(){
		}
});
};



