
$("#edit_information").click(function(){
	var province = $("#province").val();
	var city = $("#city").val();
	var county = $("#county").val();
	var detail_addr = $("#detail_addr").val();
	var stu_count = $("#stu_count").val();
	var tea_count = $("#tea_count").val();
	var contacter = $("#contacter").val();
	
	$.ajax({
		type:"post",
		url:"",
		data:{},
		async:true,
		success:function(){
			
		},
		error:function(){
			
		}
	});
});




