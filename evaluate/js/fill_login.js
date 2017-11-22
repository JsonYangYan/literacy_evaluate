var login_type = "";
$("#login").click(function(){
	var category = $("#category").val();
	var useranme = $("#username_inp").val();
	var pwd = $("#password_inp").val();
	if(category == 1) {//专家
		login_type = "admin";
	}else{
		login_type = "edu_depart";
	}
	if(!useranme && !pwd) {
		alert("请填写完整");
		return false;
	}
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=login&operation=login&login_type="+login_type,
		async:false,
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		dataType:"json",
		data:{
			"account":useranme,
			"pass":pwd,
		},
		success:function(data){
			console.log(data);
			
			if(data["data"] == "login success"){
				if(category == 1) {
					window.location.href="qu_paper.html";
				}else{
					window.location.href="evaluation.html";
				}
			}else{
				alert("用户名或者密码错误");
			}
		},
		error:function(){
			alert("连接失败");
		}
	});
});

