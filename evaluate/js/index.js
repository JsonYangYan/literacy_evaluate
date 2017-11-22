var username = $("#username").val();
var passwd = $("#password").val();

$(".login_btn").click(function(){
	$.ajax({
		type:"post",
		url:"",
		async:true,
		data:{
			"account":username,
			"passwd":passwd
		},
		success:function(data){
			if (data) {
				window.location.href="";
			}
		},
		error:function(){
			
		}
	});
});
