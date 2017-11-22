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

//添加选项
function addOption(obj){
	var parent = $(obj).parent().parent();
	parent.append("<div class='question_opt'><span class='order'><input type='text' ></span><span class='option'><input type='text'/></span><span class='save btn' onclick='saveNewOption(this)'>保存</span><span class='cancel btn' onclick='cancel_option(this)'>取消</span></div>");
}

//添加选项的保存事件
function saveNewOption(obj){
	var question_id = $(obj).parent().prev().attr("que_id");
	var content = $(obj).prev().find("input").val();
	var order = $(obj).prev().prev().find("input").val();
	if(!content || !order){
		alert("请填写完整");
		return false;
	}
	var option = [];
 	hashMap.Set("question_id",question_id);
 	hashMap.Set("content",content);
 	hashMap.Set("order",order);
 	option[0] = hashMap;
 	var options = JSON.stringify(option);//数组转变成json字符串
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=questionnaire&operation=add_option",
		async:true,
		data:{
			"options":options
		},
		dataType:"json",
		success:function(){
			showData();
		},
		error:function(){
			alert("添加失败");
		}
	});
	
	
}


function cancel_option(obj){
	$(obj).parent().remove();
}

//标题的编辑
function editTitle(obj){
	var title_inp = $(obj).prev().prev();
	title_inp.addClass("hide");
	title_inp.prev().removeClass("hide");
	title_inp.prev().prev().addClass("hide");
	$(obj).addClass("hide");
	$(obj).prev().removeClass("hide");
	$(obj).next().removeClass("hide");
	$(obj).next().next().removeClass("hide");
}

//标题的取消
function cancelTitle(obj){
	$(obj).addClass("hide");//取消按钮
	$(obj).prev().addClass("hide");//保存按钮
	$(obj).prev().prev().removeClass("hide");//编辑按钮
	$(obj).prev().prev().prev().addClass("hide");//单选或多选下拉框
	$(obj).prev().prev().prev().prev().removeClass("hide");//单选或多选文本
	$(obj).prev().prev().prev().prev().prev().addClass("hide");//标题输入框
	$(obj).prev().prev().prev().prev().prev().prev().removeClass("hide");//标题文本
}


//标题的保存
function saveTitle(obj){
	//保存事件
	var que_id = $(obj).attr("que_id");
	var type = $(obj).prev().prev().find("select").attr("value");
	var content = $(obj).prev().prev().prev().prev().find("input").attr("value");
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
		success:function(){},
		error:function(){}
	});
	var selec = "单选";
	if(type==2)selec="多选";
	
	$(obj).prev().prev().prev().text("?("+selec+")");//将多选和单选文本值改变
	$(obj).prev().prev().prev().prev().prev().text(content);//将输入框文本改变
	$(obj).addClass("hide");//保存按钮
	$(obj).prev().removeClass("hide");//编辑按钮
	$(obj).prev().prev().addClass("hide")//单选多选下拉框
	$(obj).prev().prev().prev().removeClass("hide");//单选或多选文本
	$(obj).prev().prev().prev().prev().addClass("hide");//标题输入框
	$(obj).prev().prev().prev().prev().prev().removeClass("hide");//标题文本
	$(obj).next().addClass("hide");
}


//选项的编辑
function editOption(obj){
	$(obj).prev().removeClass("hide");
	$(obj).prev().prev().addClass("hide");
	$(obj).prev().prev().prev().removeClass("hide");
	$(obj).prev().prev().prev().prev().addClass("hide");
	$(obj).addClass("hide");
	$(obj).next().removeClass("hide");
	$(obj).next().next().removeClass("hide");
	$(obj).next().next().next().addClass("hide");
}


//选项的取消
function inpuCancel(obj){
	$(obj).addClass("hide");
	$(obj).next().removeClass("hide");
	$(obj).prev().addClass("hide");
	$(obj).prev().prev().removeClass("hide");
	$(obj).prev().prev().prev().addClass("hide");
	$(obj).prev().prev().prev().prev().removeClass("hide");
	$(obj).prev().prev().prev().prev().prev().addClass("hide");
	$(obj).prev().prev().prev().prev().prev().prev().removeClass("hide");
}

//选项的保存
function saveOption (obj){
	var question_id = $(obj).attr("que_id");
	var content = $(obj).prev().prev().find("input").attr("value");
	var order = $(obj).prev().prev().prev().prev().find("input").attr("value");
	var option_id=$(obj).attr("option_id");
	$.ajax({
		type:"post",
		url:ajax_url+"/info_literacy/?qt=edit&operation=update_option",
		async:true,
		data:{
			"question_id":question_id,
			"option_id":option_id,
			"content":content,
			"order":order
		},
		dataType:"json",
		success:function(){},
		error:function(){}
	});
	$(obj).addClass("hide");//保存按钮隐藏
	$(obj).prev().removeClass("hide");//编辑按钮出现
	$(obj).next().addClass("hide");//取消按钮的隐藏
	$(obj).next().next().removeClass("hide");//删除按钮的出现
	$(obj).prev().prev().prev().text(content);//content文本的改变
	$(obj).prev().prev().prev().removeClass("hide");//content文本的出现
	$(obj).prev().prev().prev().prev().prev().text(order+"、");//order 文本的改变
	$(obj).prev().prev().prev().prev().prev().removeClass("hide");//order文本的出现
	$(obj).prev().prev().addClass("hide");//content输入框的隐藏
	$(obj).prev().prev().prev().prev().addClass("hide");//order输入框的隐藏	
}

//选项的删除
function delOption(obj){
	if(confirm("确定要删除吗?")){
		var option_id= $(obj).attr("option_id");
		$.ajax({
			type:"post",
			url:ajax_url+"/info_literacy/?qt=edit&operation=delete_option",
			async:true,
			data:{
				"option_ids":option_id
			},
			dataType:"json",
			success:function(){},
			error:function(){}
		});
		$(obj).parent().remove();
	}
}
