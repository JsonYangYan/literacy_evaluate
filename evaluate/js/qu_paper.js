/*
 * 初始化
 */	
	//分页
	//当前页的数据
	var currentPageJSON = {};

	//当前处于第几页
	var currentPageNo = 1;

	//每页显示的条数
	var pageSize = 20;

$("#quiz_btn").click(function(){
	var que_title = $("input[name=quiz]").val();
	if(!que_title){
		alert("请添加标题");		
		return false;
	}
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=questionnaire&operation=add_title",
		data:{
			"title":$("input[name=quiz]").val()
		},
		dataType:"json",
		async:true,
		success:function(data){
			alert("添加成功");
			$(".quiz input").attr("value",'');
			showData();
		},
		error:function(){
			alert("连接失败");
		}
	});
});
//删除题目
function deleteTitle(obj){
	var paper_id = $(obj).attr("paper_id");
	$.ajax({
		type:"post",
		url:"",
		async:true
	});
}
//分页相关

//翻页
$("#page_numbers").on("click",".goPageLink",function() {
    var linkId = $(this).attr("id").split("_");
    var goPageNo = new Number(linkId[3]);
    goPage(goPageNo);
})


//跳转页面
var goPage = function(pageNo) {

    //更新设置当前页面
    currentPageNo = pageNo;

    //显示数据
    showData();
};

var showData = function() {
	
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=list&operation=questionnaire_list&page="+currentPageNo+"&page_size="+pageSize,
		async:false,
		dataType:"json",
		success:function(data){
			var result = {schoolData:[]};
			result.schoolData= data["data"];
			currentPageJSON = result;
			console.log(currentPageJSON);
			
		},
		error:function(){
			alert("连接数据库失败");
		}
	});
	
	
	$(".ques_content").html(TrimPath.processDOMTemplate("list_template", currentPageJSON));
	//总记录数
	var totalItems=0;
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=status&operation=questions_lib",
		async:false,
		dataType:"json",
		success:function(data){
			totalItems = data["data"]["questionnaire_num"];
		},
		error:function(){
			
		}
	});
	//当前页
	var currentPage = "" + currentPageNo;

	//总页数
	var totalPage = "" + Math.ceil(totalItems / pageSize);

	//总页数
	//alert(totalItems+currentPage+totalPage);
	$("#page_numbers").html(makePaging(totalItems, currentPage, totalPage, true, true));
}
showData();

//弹出对话框
function open_dialog(obj){
	 		$("#dialog").dialog("open");
	 		$("#title_id").val(obj.getAttribute("title_id"));
	 		$(".upd_title").val(obj.getAttribute("title_name"));
}
 
$(function() {
	 $( "#dialog" ).dialog({
	 	autoOpen : false,
	 	 resizable: false,
		 height:170,
		 modal: true,
	 	 buttons: {
			 "确认": function() {
   				 	$.ajax({
   				 		type:"post",
   				 		url:ajax_url+"/info_literacy/?qt=edit&operation=update_title",
   				 		async:false,
   				 		dataType:"json",
   				 		data:{
   				 			"content":$(".upd_title").val(),
   				 			"questionnaire_id":$("#title_id").val()
   				 		},
   				 		success:function(){
   				 			showData();
   				 		}
   				 	});
      				$( this ).dialog( "close" );
			},
			 "取消": function() {
 				 $( this ).dialog( "close" );
			 }
		}
	});
});

	