var operation = '';
var edu_depart_id = ''
var school_id = '';
var is_edu_depart = 0;//是区县用户还是
//标签选中的参数
var school = [];
var school_str = "";
var grade = [];
var grade_str = "";
var clas = [];
var clas_str = "";
var gender = "no";
var depart = [];
var depart_str = "";
var edu_primary_depart_id = "";
var is_online = true;
//导航的加载
var is_primary_edu_depart = "";
var check_login = function(){
	operation = '';
	edu_depart_id = '';
	school_id = '';
	sno = "";
	is_primary_edu_depart = "";
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
			if(data["data"]["status"] == "online"){
				operation = data["data"]["login_type"];
				if(data["data"]["edu_depart_id"]){
					edu_depart_id = data["data"]["edu_depart_id"];
				}
				if(data["data"]["school_id"]) {
					school_id = data["data"]["school_id"];
				}
				if(data["data"]["primary_edu_depart"]) {
					is_primary_edu_depart = data["data"]["primary_edu_depart"];
				}
				if(data["data"]["account"] && operation=="student"){
					$(".nav").hide();
					$(".show_view").show();
				}
			}else{
				is_online = false;
			}
		},
		error:function(){
			alert("连接失败");
		}
	});
}
check_login();

$.ajax({
	type: "get",
	url: ajax_url + "/info_literacy/?qt=list&operation=get_indexes&show_questions=0",
	async: false,
	dataType: "json",
	data: {},
	success: function(sData) {
//				console.log(sData);
		$(".flex-container").html(TrimPath.processDOMTemplate("flex-container-tmpl", sData));
	},
	error: function() {

	}
});
//选中导航的id
var type = "overview";
var primary_index_id = "";
var tabData = "";
//tab标签
function showTab() {
	
	//学校用户
	if(operation == 'school') {
		
		$.ajax({
			type: "get",
			url: ajax_url + "/info_literacy/?qt=navigate&operation=school",
			async: false,
			dataType: "json",
			data: {
				"school_id": school_id
			},
			success: function(result) {
				result["operation"] = "school";
				$("#wrap").html(TrimPath.processDOMTemplate("tab-tmpl", result));
			},
			error: function() {

			}
		});
	} else {//教育管理部门
		$.ajax({
			type: "get",
			url: ajax_url + "/info_literacy/?qt=navigate&operation=edu_depart",
			async: false,
			dataType: "json",
			data: {
				"edu_depart_id": edu_depart_id
			},
			success: function(result) {
				result["operation"] = "edu_depart";
				$("#wrap").html(TrimPath.processDOMTemplate("tab-tmpl", result));
				//区分是县级还是区域级
				tabData = result["data"]["edu_depart"];
				if(tabData != null) $(".check_container").append("<span class='check_item' index2s='depart_0'> 全部区县</span>");
				$(".check_container").append("<span class='check_item' index2s='school_0'> 全部学校</span>");
			},
			error: function() {
				alert("请求失败");
			}
		});
	}
	$(".check_container").append("<span class='check_item' index2s='grade_all'> 全部年级</span>");
	$(".check_container").append("<span class='check_item' index2s='clas_all'> 全部班级</span>");
	$(".check_container").append("<span class='check_item' index2s='yes'> 按性别排序</span>");
}
showTab();
$(".flex-item").click(function() {
	$(".flex-container").find(".flex-item-active").removeClass("flex-item-active").addClass("flex-item-normal");
	$(this).removeClass("flex-item-normal").addClass("flex-item-active");
});

$(".tab_item").click(function() {
	if($(this).hasClass("active")) {
		$(this).addClass("normal");
		$(this).removeClass("active");
		var index2s = $(this).attr("index2s");
		$(".check_container span[index2s='" + index2s + "']").remove();
		
	} else {
		$(this).addClass("active");
		$(this).removeClass("normal");
		var index2s = $(this).attr("index2s");
		var html = $(this).html();
		$(".check_container").append("<span class='check_item' index2s=" + index2s + ">" + html + "</span>");
		var index_arr = index2s.split("_");
		if(index_arr[0]=="school"){
			if(index_arr[1]=="0"){
				$(this).siblings().removeClass("active").addClass("normal");
				$(".check_container span").each(function(){
					var arr = $(this).attr("index2s").split("_");
					if(arr[0] == "school" && arr[1] !=0){
						$(this).remove();
					}
				});
			}else{
				$(".tab_cont span[index2s=school_0]").removeClass("active").addClass("normal");
				$(".check_container span[index2s=school_0]").remove();
			}
			
		}
		
		if(index_arr[0]=="grade"){
			if(index_arr[1]=="all"){
				$(this).siblings().removeClass("active").addClass("normal");
				$(".check_container span").each(function(){
					var arr = $(this).attr("index2s").split("_");
					if(arr[0] == "grade" && arr[1] !="all"){
						$(this).remove();
					}
				});
			}else{
				$(".tab_cont span[index2s=grade_all]").removeClass("active").addClass("normal");
				$(".check_container span[index2s=grade_all]").remove();
			}
			
		}
		
		if(index_arr[0]=="class"){
			if(index_arr[1]=="all"){
				$(this).siblings().removeClass("active").addClass("normal");
				$(".check_container span").each(function(){
					var arr = $(this).attr("index2s").split("_");
					if(arr[0] == "class" && arr[1] !="all"){
						$(this).remove();
					}
				});
			}else{
				$(".tab_cont span[index2s=class_all]").removeClass("active").addClass("normal");
				$(".check_container span[index2s=class_all]").remove();
			}
			
		}
		
		if(index_arr[0]=="depart"){
			if(index_arr[1]=="0"){
				$(this).siblings().removeClass("active").addClass("normal");
				$(".check_container span").each(function(){
					var arr = $(this).attr("index2s").split("_");
					if(arr[0] == "depart" && arr[1] !=0){
						$(this).remove();
					}
				});
			}else{
				$(".tab_cont span[index2s=depart_0]").removeClass("active").addClass("normal");
				$(".check_container span[index2s=depart_0]").remove();
			}
			
		}
	}
});

//折叠 更多

$(function() {
	var slideHeight = 78; // px
	var defHeight = $('#wrap').height();
	
	if(defHeight >= slideHeight) {
		$('#wrap').css('height', slideHeight + 'px');
		$('#read-more').html("更多");
		
		$('#read-more').click(function() {
			var curHeight =  Math.ceil($('#wrap').height());
			if(curHeight == slideHeight) {
				$('#wrap').animate({
					height: defHeight
				});
				$('#read-more').html('折叠');
			} else {
				$('#wrap').animate({
					height: slideHeight
				});
				$("#read-more").html("更多");
			}
			return false;
		});
	}
});

//清空事件
$("#clear_all").click(function() {
	$(".tab_item").each(function() {
		$(".active").removeClass("active").addClass("normal");
		//清空已经选中的
		$(".check_container").html('');
	});
});

var getSchoolTabData = function() {
	//初始化数据
	gender = "no";
	clas = [];
	grade = [];
	$(".tab").find(".active").each(function() {
		var index = $(this).attr("index2s");
//		console.log(index);
		//年级
		if(index.indexOf("clas") > -1) {
			clas.push(index.split("_")[1]);
		} else if(index.indexOf("grade") > -1) {
			grade.push(index.split("_")[1]);
		} else if(index.indexOf("yes") > -1){
			gender = "yes";
		}

	});
	//判断数组中是否有 全部，有说明是全部，没有则说明是部分
	if($.inArray("all", clas) > -1) {
		clas_str = "all";
	} else {
		clas_str = clas.join(",");
	}
	if($.inArray("all", grade) > -1) {
		grade_str = "all";
	} else {
		grade_str = grade.join(",");
	}
}

var getEduTabData = function() {
	//初始化数据
	gender = "no";
	clas = [];
	grade = [];
	school = [];
	depart = [];
	$(".tab").find(".active").each(function() {
		var index = $(this).attr("index2s");
		//年级
		if(index.indexOf("clas") > -1) {
			clas.push(index.split("_")[1]);
		} else if(index.indexOf("grade") > -1) {
			grade.push(index.split("_")[1]);
		} else if(index.indexOf("school") > -1) {
			school.push(index.split("_")[1]);
		} else if(index.indexOf("yes") > -1){
			gender = "yes";
		}else if(index.indexOf("depart") > -1){
			depart.push(index.split("_")[1])
		}
	});
	//判断数组中是否有 全部，有说明是全部，没有则说明是部分
	if($.inArray("all", clas) > -1) {
		clas_str = "all";
	} else {
		clas_str = clas.join(",");
	}
	if($.inArray("all", grade) > -1) {
		grade_str = "all";
	} else {
		grade_str = grade.join(",");
	}
	if($.inArray("0", school) > -1) {
		school_str = "0";
	} else {
		school_str = school.join(",");
	}
	if($.inArray("0", depart)>-1) {
		depart_str = "0";
	}else {
		depart_str = depart.join(",");
	}
//	console.log(depart_str);
}
//确定事件

$("#ensure").click(function(){
	var flag = true;
	$(".tab_cont").each(function(){
		var len = $(this).find(".active").init().length;
		if(len > 0) {
			var prev = $(this).prev().prev().prev().prev().prev();
//			console.log($(prev).attr("class"));
			if($(prev).attr("class") == "tab_cont"){
				var leng = $(prev).find(".active").init().length;
//				console.log(leng);
				if(leng==0) {
//					console.log("aaaaaaa");
					$(".tab").css("border","1px solid #FF0000");
					window.setTimeout(showBorder,3000); 
					flag = false;
					return false;
				}
			}
		}
	});
	if(flag){
		showData();
	}

});
var showBorder = function(){
	$(".tab").css("border","1px solid #3bb2d0");
}

var getContentData = function() {
//	console.log(tabData);
	//判断是去还是市
	if(tabData) {
		check_login();
		is_edu_depart = 1;
		edu_primary_depart_id = edu_depart_id;
		edu_depart_id = depart_str;
	}
	var url_suffix = "";
	if(operation == "school"){
		url_suffix = "/info_literacy/?qt=evaluation&operation=school";
	}else if(is_edu_depart) {
		url_suffix = "/info_literacy/?qt=evaluation&operation=edu_primary_depart";
		school_id = school_str;

	}else{
		url_suffix = "/info_literacy/?qt=evaluation&operation=edu_depart";
		school_id = school_str;
	}
	
//	console.log(gender+"type"+type+" grade_str"+grade_str+" primary_index_id"+primary_index_id+" clas_str"+clas_str+" edu_depart_id"+edu_depart_id+" school_id"+school_id+"edu_primary_depart_id"+edu_primary_depart_id);
	var data ={};
	if(type) data["type"] = type;
	if(grade_str) data["grade"] = grade_str;
	if(gender) data["order_by_gender"] = gender;
	if(primary_index_id) data["primary_index_id"] = primary_index_id;
	data["test_times"] = 1;
	if(clas_str) data["class"] = clas_str;
	if(edu_depart_id) data["edu_depart_id"] = edu_depart_id;
	if(school_id) data["school_id"] = school_id;
	if(edu_primary_depart_id) data["edu_primary_depart_id"] = edu_primary_depart_id;
	console.log(data);
	$.ajax({
		type: "get",
		url: ajax_url + url_suffix,
		async: false,
		data: data,
		dataType: "json",
		success: function(data) {
			console.log(data);
			var result = data["data"]["data"];
			if(result == null){
				$(".eva_container").html("");
				return false;
			}
			var keys = objOfValueToArr(data["data"]["keys"]);
			var options = Array();
			$(".eva_container").html("");
			for(var i = 0; i < result.length; i++) {
				$(".eva_container").append("<div id='echarts"+ i +"' class='echarts'></div>");
				if(gender == "no") {//不按性别排序
					var data_str = objOfValueToArr(result[i]["scores"]);
					options[i] = {
						title: {
							text: result[i]["name"],
						},
						tooltip: {
							trigger: 'axis'
						},
						toolbox: {
							show: true,
							feature: {
								mark: { show: true },
								dataView: { show: true, readOnly: false },
								magicType: { show: true, type: ['line', 'bar'] },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},
						calculable: true,
						xAxis: [{
							type: 'category',
							data: keys
						}],
						yAxis: [{
							type: 'value'
						}],
						series: [{
							name: '得分',
							type: 'bar',
							data: data_str,
							markPoint: {
								data: [
									{ type: 'max', name: '最大值' },
									{ type: 'min', name: '最小值' }
								]
							},
							markLine: {
								data: [
									{ type: 'average', name: '平均值' }
								]
							}
						}]
					};
				} else {//按性别排序

					var data_woman = objOfValueToArr(result[i]["scores"]["女生"]);
					var data_man = objOfValueToArr(result[i]["scores"]["男生"]);
					options[i] = {
						title: {
							text: result[i]["name"],
						},
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data: ['男生得分', '女生得分']
						},
						toolbox: {
							show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            magicType : {show: true, type: ['line', 'bar']},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
						},
						calculable: true,
						xAxis: [{
							type: 'category',
							data: keys
						}],
						yAxis: [{
							type: 'value'
						}],
						series: [{
								name: '男生得分',
								type: 'bar',
								data: data_man,
								markPoint: {
									data: [
										{ type: 'max', name: '最大值' },
										{ type: 'min', name: '最小值' }
									]
								},
								markLine: {
									data: [
										{ type: 'average', name: '平均值' }
									]
								}
							},
							{
								name: '女生得分',
								type: 'bar',
								data: data_woman,
								markPoint: {
									data: [
										{ type: 'max', name: '最大值' },
										{ type: 'min', name: '最小值' }
									]
								},
								markLine: {
									data: [
										{ type: 'average', name: '平均值' }
									]
								}
							}
						]
					};

				}

			}

			var echartsObj = new Array();
			require.config({
				paths: {
					echarts: 'js/dist'
				}
			});
			require(
				[
					'echarts',
					'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
					'echarts/chart/line'
				],
				function(ec) {
					for(var i = 0; i < result.length; i++) {
						echartsObj[i] = ec.init(document.getElementById('echarts' + i));
						echartsObj[i].setOption(options[i]);
					}
				}
			);

		},
		error: function() {
			
		}
	});

}

var showData = function(){
	var index_id = $(".flex-container").find(".flex-item-active").attr("index_id");
	if(index_id == "overview") {
		type = "overview";
	} else {
		type = "part";
		primary_index_id = index_id;
	}
	if(operation == 'school') {
		getSchoolTabData();
		getContentData();
	}else {
		getEduTabData();
		getContentData();
	}
}
showData();