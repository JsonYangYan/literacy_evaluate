//用户名检查是否为空和是否被占用
$("#userName").blur(function(){
	$("#usename_new").html("");
	var userName = $("#userName").val();
	if(userName == ''){
		$("#usename_new").html("用户名不能为空");
	}
});


$("#password_one").blur(function(){
	check_password_one();
});

function check_password_one(){
	$("#beflabel").html("");
	var password_one = $("#password_one").val();
	if (password_one == "") {
		$("#beflabel").html("密码不能为空");
		return false;
	}
}

$("#password_two").blur(function(){
	check_pawword_two();
});
function check_pawword_two(){
	$("#one_pwd").html("");
	var password_two = $("#password_two").val();
	if (password_two == "") {
		$("#one_pwd").html("确认密码不能为空");	
		return false;
	}
	if(password_two !=$("#password_one").val()){
		$("#one_pwd").html("和原密码不一致");
		return false;
	}
}

$("#login").click(function(){
	if($("#category_name").val()=='0'){
		$("#category_name_new").html("类别必须填写");
		return false;
	}
	//$("#usename_new").html("");
	var userName = $("#userName").val();
	if(userName == ''){
		$("#usename_new").html("用户名不能为空");
		return false;
	}
	check_password_one();
	check_pawword_two();
	var category_name = $("#category_name").val();
	if(category_name == '1'){
		$.ajax({
			type:"post",
			url:ajax_url+"/info_literacy/?qt=register&type=student",
			async:true,
			dataType:"json",
			data:{
				"account":$("#userName").val(),
				"passwd":$("#password_one").val(),
				"gender":$("input[type=radio][name=gender]").val(),
				"school_id":$("#school_name").val(),
				"grade":$("#grade_name").val(),
				"class":$("#class_name").val(),
				"name":$("#name").val()
			},
			success:function(data){
				alert("注册成功");
				window.location.href = "schoo_login.html";
			},
			error:function(){
				alert("连接失败");	
			}
		});
	
	}
	
	if(category_name=='2') {
		$.ajax({
			type:"post",
			url:ajax_url+"info_literacy/?qt=register&type=school",
			async:true,
			dataType:"json",
			data:{
				"account":$("#userName").val(),
				"passwd":$("#password_one").val(),
				"name":$("#school_name_inp").val(),
				"province":$("#province").val(),
				"city":$("#city").val(),
				"county":$("#county").val(),
				"detail_addr":$("#detail_addr").val(),
				"stu_count":$("#stu_count").val(),
				"tea_count":$("#tea_count").val(),
				"contacter":$("#contacter").val(),
				"phone":$("#phone").val(),
				"edu_depart_id":$("#edu_depart_id").val()
			},
			success:function(data){
				console.log("注册成功");
				window.location.href = "expert_login.html";
			},
			error:function(){
				alert("连接失败");
			}
		});
	}
});

$("#category_name").change(function(){
	var value = $("#category_name").val();
	if(value == '1') {//学生用户
		$(".student_part").show();
		$(".teacher_part").hide();
		$("#category_name_new").html('');
	}
	if(value == '2') {//学校用户
		$(".student_part").hide();
		$(".teacher_part").show();
		$("#category_name_new").html('');
	}
	if(value == 0) {
		$(".student_part").hide();
		$(".teacher_part").hide();
		$("#category_name_new").html("类别必须填写");
	}
});
