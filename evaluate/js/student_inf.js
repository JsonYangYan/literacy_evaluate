$("#edit_information").click(function(){
	var sex = $("input[name='school_area']").val();
	var school_id = $("#school_area").val();
	var class_name = $("#class_name").val();
	var grade = $("#grade").val();
	var name = $("#name").val();
	alert(class_name);
	$.ajax({
		type:"post",
		url:"",
		async:true,
		data:{},
		success:function(){
			
		},
		error:function(){
			
		}
	});
});
