var login_type = "";
$("#login").click(function(){
	var useranme = $("#username_inp").val();
	var pwd = $("#password_inp").val();
	if(!useranme && !pwd) {
		alert("请填写完整");
		return false;
	}
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=login&operation=login&login_type=school",
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
				
				window.location.href="evaluation.html";
			
			}else{
				alert("用户名或者密码错误");
			}
		},
		error:function(){
			alert("连接失败");
		}
	});
});

