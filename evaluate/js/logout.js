$.ajax({
	type:"get",
	url:ajax_url+"/info_literacy/?qt=login&operation=logout",
	async:true,
	data:{},
	dataType:"json",
	xhrFields: {
		withCredentials: true
	},
	crossDomain: true,
	success:function(data){
		console.log(data);
	},
	error:function(){
		alert("连接失败");
	}
});