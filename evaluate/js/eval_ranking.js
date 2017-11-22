//导航的加载
var operation = "";
var edu_depart_id = "";
var tabData = "";
//选中导航的id
var type = "overview";
var primary_index_id = "";
var depart = "";
var grade = "";
var clas = "";
var school = "";
var edu_primary_depart_id = "";
var is_online = true;
var check_login = function(){
	operation = '';
	edu_depart_id = '';
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
//			console.log(data);
			if(data["data"]["status"] == "online"){
				operation = data["data"]["login_type"];
				if(data["data"]["edu_depart_id"]){
					edu_depart_id = data["data"]["edu_depart_id"];
				}
				if(data["data"]["school_id"]) {
					school = data["data"]["school_id"];
				}
				if(data["data"]["primary_edu_depart"]) {
					is_primary_edu_depart = data["data"]["primary_edu_depart"];
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
	xhrFields: {
		withCredentials: true
	},
	crossDomain: true,
	dataType: "json",
	data: {},
	success: function(sData) {
		//				console.log(sData);
		$(".flex-container").html(TrimPath.processDOMTemplate("flex-container-tmpl", sData));
	},
	error: function() {

	}
});

$(".flex-item").click(function() {
	$(".flex-container").find(".flex-item-active").removeClass("flex-item-active").addClass("flex-item-normal");
	$(this).removeClass("flex-item-normal").addClass("flex-item-active");
});

function showTab() {
	if(!is_online) {
		alert("请先登录");
		return false;
	}
	
	//学校用户
	if(operation == 'school') {

		$("#wrap").append("<div class='tab_btn active' val='grade_all'>全部年级</div>").append("<div class='tab_btn active' val='class_all'>全部班级</div>");

	} else { //教育管理部门
		var data = {};
		$.ajax({
			type: "get",
			url: ajax_url + "/info_literacy/?qt=navigate&operation=edu_depart",
			async: false,
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: {
				"edu_depart_id": edu_depart_id
			},
			success: function(result) {
				//				console.log(result);
				result["operation"] = "edu_depart";
				//区分是县级还是区域级
				tabData = result["data"]["edu_depart"];
				if(tabData != null) $("#wrap").append("<div class='tab_btn active' val='depatr_0'>全部区县</div>");
			},
			error: function() {
				alert("请求失败");
			}
		});
		$("#wrap").append("<div class='tab_btn active' val='school_0'>全部学校</div>").append("<div class='tab_btn active' val='grade_all'>全部年级</div>").append("<div class='tab_btn active' val='class_all'>全部班级</div>");
	}
}
showTab();
$(".tab_btn").click(function() {
	if($(this).hasClass("active")) {

		$(this).removeClass("active").addClass("normal");
	} else {

		$(this).removeClass("normal").addClass("active");
	}

});

$("#ensure").click(function() {
	var flag = true;
	$(".tab_btn").each(function() {
		if($(this).hasClass("active")) {
			var len = $(this).prev().init().length;
			if(len > 0) {
				if($(this).prev().hasClass("normal")) {
					$("#wrap").css("border", "1px solid #FF0000");
					window.setTimeout(showBorder, 3000);
					flag = false;
					return false;
				}
			}
		}
	});
	if(flag) {
		showData();
	}
});

var showBorder = function() {
	$("#wrap").css("border", "none");
}

var showData = function() {
	if(!is_online) {
		return false;
	}
	var data = {};
	var index_id = $(".flex-container").find(".flex-item-active").attr("index_id");
	if(index_id == "overview") {
		data["type"] = "overview";
	} else {
		data["type"] = "part";
		data["primary_index_id"] = index_id;
	}
	data["order_by_gender"] = "no";
	data["test_times"] = 1;
	data["edu_depart_id"] = edu_depart_id;
	$(".tab_btn").each(function() {
		if($(this).hasClass("active")) {

			var arr = $(this).attr("val").split("_");
			if(arr[0] == "depatr") {
				data["edu_primary_depart_id"] = edu_depart_id;
				data["edu_depart_id"] = "0";
			}
			if(arr[0] == "school") data["school_id"] = '0';
			if(arr[0] == "grade") data["grade"] = "all";
			if(arr[0] == "class") data["class"] = "all";

		}
	});
	console.log(data);
	var url_suffix = "";
	if(operation == "school") {
		
		url_suffix = "/info_literacy/?qt=evaluation&operation=school";
		data["school_id"] = school;
	} else if(tabData) {
		url_suffix = "/info_literacy/?qt=evaluation&operation=edu_primary_depart";

	} else {
		url_suffix = "/info_literacy/?qt=evaluation&operation=edu_depart";
	}
	var dataContent = { nameContent: [], scoresContent: [] };
	$.ajax({
		type: "get",
		url: ajax_url + url_suffix,
		async: false,
		data: data,
		dataType: "json",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function(data) {
			var keys_len = data["data"]["keys"].length; //36
			var data_len = data["data"]["data"].length; //5
			console.log(data);
			for(var i = 0; i < data_len; i++) {
				dataContent["nameContent"].push(data["data"]["data"][i]["name"]);
			}
			for(var i = 0; i < keys_len; i++) {
				var dat = [];
				dat.push(data["data"]["keys"][i]);
				for(var j = 0; j < data_len; j++) {
					dat.push(data["data"]["data"][j]["scores"][i]);
				}
				dataContent["scoresContent"].push(dat);
			}
			console.log(dataContent);
			$(".tab").html(TrimPath.processDOMTemplate("list_template", dataContent));
			var content = $(".td_content");
			sortTable('tbValue', 2, 'float',content[1]);
		},
		error: function() {
			alert("连接失败");
		}
	});

}

showData();



function HTMLLoad(hybm, code) {
	//选择框
	var obj = document.getElementById("drpIndustry");
	for(var o = 0; o < 5; o++) {
		if(obj.options[o].value == hybm) {
			obj.options[o].selected = true;
			break;
		}
	}
	var tabobj = document.getElementById("tbValue");
	for(var i = 2; i < tabobj.rows.length; i++) {

		if(tabobj.rows[i].cells[1].innerHTML == code) {

			tabobj.rows[i].style.backgroundColor = "red";

			break;
		}
	}

}

function OnChange(code) {
	window.location.href = document.getElementById("drpIndustry").value + "_" + code + ".html";

}

//转换器，将列的字段类型转换为可以排序的类型：String,int,float
function convert(sValue, sDataType) {
	switch(sDataType) {
		case "int":
			if(sValue != "--")
				return parseInt(sValue);
			else
				return -10000000000000;
		case "float":
			if(sValue != "--")
				return parseFloat(sValue);
			else
				return -10000000000000.0;
		case "date":
			if(sValue != "--")
				return new Date(Date.parse(sValue));
			else
				return "1900-01-01";
		default:
			return sValue.toString();

	}
}

//排序函数产生器，iCol表示列索引，sDataType表示该列的数据类型
function generateCompareTRs(iCol, sDataType) {

	return function compareTRs(oTR1, oTR2) {
		var vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType);
		var vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType);

		if(vValue1 < vValue2) {
			return -1;
		} else if(vValue1 > vValue2) {
			return 1;
		} else {
			return 0;
		}
	};
}

//排序方法
function sortTable(sTableID, iCol, sDataType,obj) {
	
	if(!$(obj).find(".i_content").hasClass("up") && !$(obj).find(".i_content").hasClass("down")) {
		$(".i_content").removeClass("up").removeClass("down");
		$(obj).find(".i_content").addClass("up");
	} else if($(obj).find(".i_content").hasClass("up")) {
		$(".i_content").removeClass("up").removeClass("down");
		$(obj).find(".i_content").addClass("down");
	} else if($(obj).find(".i_content").hasClass("down")) {
		$(".i_content").removeClass("down").removeClass("up");
		$(obj).find(".i_content").addClass("up");
	}
	
	var oTable = document.getElementById(sTableID);
	var oTBody = oTable.tBodies[0];
	var colDataRows = oTBody.rows;
	var aTRs = new Array;

	//将所有列放入数组
	for(var i = 0; i < colDataRows.length; i++) {
		aTRs[i] = colDataRows[i];
	}

	//判断最后一次排序的列是否与现在要进行排序的列相同，是的话，直接使用reverse()逆序
	if(oTable.sortCol == iCol) {
		aTRs.reverse();
	} else {
		//使用数组的sort方法，传进排序函数
		aTRs.sort(generateCompareTRs(iCol, sDataType));
	}

	var oFragment = document.createDocumentFragment();
	for(var i = 0; i < aTRs.length; i++) {
		aTRs[i].cells[0].innerHTML = i + 1;
		oFragment.appendChild(aTRs[i]);
	}

	oTBody.appendChild(oFragment);
	//记录最后一次排序的列索引
	oTable.sortCol = iCol;
	
}

