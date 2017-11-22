$.ajax({
	type:"post",
	url:ajax_url+"/info_literacy/?qt=login&operation=login&login_type=student",
	async:false,
	dataType:"json",
	data:{
		"account":"01010106",
		"pass":"01010106"
	},
	xhrFields: {
		withCredentials: true
	},
	crossDomain: true,
	success:function(data){
		console.log(data);
	},
	error:function(){
		console.log("error");
	}
});

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
		},
		error:function(){
			alert("error");
		}
});

