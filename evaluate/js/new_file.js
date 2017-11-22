/*
 * 初始化
 */	
	//分页
	//当前页的数据
	var currentPageJSON = {};

	//当前处于第几页
	var currentPageNo = 1;

	//每页显示的条数
	var pageSize = 10;
	//总记录数
	var totalItems=0;


var showData = function(){
	$.ajax({
		type:"get",
		url:ajax_url+"/info_literacy/?qt=list&operation=question_list&page="+currentPageNo+"&page_size="+pageSize,
		async:false,
		dataType:"json",
		success:function(data){
			console.log(data);
			var result = {schoolData:[]};
			result.schoolData= data["data"];
			currentPageJSON = result;
		},
		error:function(){
			
		}
	});
	$("#ques_content").html(TrimPath.processDOMTemplate("list_template", currentPageJSON));
	//当前页
	var currentPage = "" + currentPageNo;

	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=status&operation=questions_lib",
		async:false,
		dataType:"json",
		success:function(data){
			totalItems = data["data"]["lib_questions_num"];		
		},
		error:function(){
			alert("连接失败");
		}
	});
	//总页数
	var totalPage = "" + Math.ceil(totalItems / pageSize);
	$("#page_numbers").html(makePaging(totalItems, currentPage, totalPage, true, true));
	
}

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

showData();

$(".add_option").click(function(){
	var parent = $(this).parent().parent();
	parent.append("<div class='question_opt'><span class='order'><input type='text' ></span><span class='option'><input type='text'/></span><span class='save btn'>保存</span><span class='cancel btn' onclick='cancel_option(this)'>取消</span></div>");
});

function cancel_option(obj){
	$(obj).parent().remove();
}

//标题的编辑
$(".edit_title").click(function(){
	var title_inp = $(this).prev().prev();
	title_inp.addClass("hide");
	title_inp.prev().removeClass("hide");
	title_inp.prev().prev().addClass("hide");
	$(this).addClass("hide");
	$(this).prev().removeClass("hide");
	$(this).next().removeClass("hide");
	$(this).next().next().removeClass("hide");
	
});
//标题的取消
$(".cancel_title").click(function(){
	$(this).addClass("hide");//取消按钮
	$(this).prev().addClass("hide");//保存按钮
	$(this).prev().prev().removeClass("hide");//编辑按钮
	$(this).prev().prev().prev().addClass("hide");//单选或多选下拉框
	$(this).prev().prev().prev().prev().removeClass("hide");//单选或多选文本
	$(this).prev().prev().prev().prev().prev().addClass("hide");//标题输入框
	$(this).prev().prev().prev().prev().prev().prev().removeClass("hide");//标题文本
});
//标题的保存
$(".save_title").click(function(){
	//保存事件
	var que_id = $(this).attr("que_id");
	var type = $(this).prev().prev().find("select").attr("value");
	var content = $(this).prev().prev().prev().prev().find("input").attr("value");
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=edit&operation=update_question",
		async:false,
		dataType:"json",
		data:{
			"question_id":que_id,
			"content":content,
			"type":type
		},
		success:function(){
			var selec = "单选";
			if(type==2)selec="多选";
			$(this).prev().prev().prev("span").html("aaa"); 
			$(this).prev().prev().prev().prev().prev().html(content);
		},
		error:function(){}
	});
	
	$(this).addClass("hide");//保存按钮
	$(this).prev().removeClass("hide");//编辑按钮
	$(this).prev().prev().addClass("hide")//单选多选下拉框
	$(this).prev().prev().prev().removeClass("hide");//单选或多选文本
	$(this).prev().prev().prev().prev().addClass("hide");//标题输入框
	$(this).prev().prev().prev().prev().prev().removeClass("hide");//标题文本
	$(this).next().addClass("hide");
});
//选项的编辑
$(".edit_option").click(function(){
	$(this).prev().removeClass("hide");
	$(this).prev().prev().addClass("hide");
	$(this).prev().prev().prev().removeClass("hide");
	$(this).prev().prev().prev().prev().addClass("hide");
	$(this).addClass("hide");
	$(this).next().removeClass("hide");
	$(this).next().next().removeClass("hide");
	$(this).next().next().next().addClass("hide");
});
//选项的取消
$(".inpu_cancel").click(function(){
	$(this).addClass("hide");
	$(this).next().removeClass("hide");
	$(this).prev().addClass("hide");
	$(this).prev().prev().removeClass("hide");
	$(this).prev().prev().prev().addClass("hide");
	$(this).prev().prev().prev().prev().removeClass("hide");
	$(this).prev().prev().prev().prev().prev().addClass("hide");
	$(this).prev().prev().prev().prev().prev().prev().removeClass("hide");
});



