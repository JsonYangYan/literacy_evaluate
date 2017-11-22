$(".add_option").click(function(){
	$("#tab").append("<tr><td>选项：</td><td class='content_all'><input class='order'><input class='content'><span class='del_btn' onclick='delOption(this)'>删除</span></td></tr>");
	
});

//删除选项
function delOption(obj){
	$(obj).parent().parent().remove();
}

//提交问题
//首先提交题目，根据题目返回的id，在提交选项
//所以用到了两层ajax
$(".submit_que").click(function(){
	var title = $(".title").val();
	var type = $(".type").val();
	if(!title){
		alert("请填写题目");
		return false;
	}
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=questionnaire&operation=add_question",
		async:false,
		data:{
			"content":title,
			"type":type
		},
		dataType:"json",
		success:function(data){
			var ques_id = data["data"]["new_question_id"];
			var array_option = [];
			$(".content_all").each(function(i){
				var order = $(this).find(".order").val();
				var content = $(this).find(".content").val();
				if(order && content){
					hashMap.Set("question_id", ques_id);
					hashMap.Set("content", content);
					hashMap.Set("order", order);
					array_option[i]=JSON.stringify(hashMap);
				}
			});
			var options = array_option.join(",")
			console.log(options);
			$.ajax({
				type:"post",
				url:ajax_url+"/info_literacy/?qt=questionnaire&operation=add_option",
				data:{
					"options":"["+options+"]"
				},
				async:false,
				dataType:"json",
				success:function(){},
				error:function(){}
			});
			alert("添加成功");
			$("input").attr("value",'');
		},
		error:function(){}
	});
	
	//window.location.reload();
	
});


