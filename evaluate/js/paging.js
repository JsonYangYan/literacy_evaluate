/**
 * @author sunlin
 * 分页单元
 * 调用：
 * makePagin(总记录数,当前页,共页数,返回类型,请求类型);
 * 返回类型:true：返回html fasle直接写入页面
 * 请求类型：true：Ajax+Trimpath；false：JSP。
 */

function makePaging(total,page,pages,result,requestType){
	if(total=="")return "";
	page = parseInt(page);
	pages = parseInt(pages);
	/*
	var html = "<span>共<span class='en'>"+ total +"</span>条<span class='en'>"+ pages +"</span>页&nbsp;</span>";
	*/
	var html="";
	var start = page-2<1?1:page-2;
	var end = start+3>pages?pages:start+3;
	if(pages-page<2) start = pages-3<1?1:pages-3;
	 
	/*
	if (page != 1) {
		html += makePageLink("< 上一页", page - 1, null, pages,requestType);
	} 
	*/
	
	html += makePageLink("< 上一页", page - 1, null, pages,requestType);
	
	if (start != 1) {
		html += makeFirst(requestType);
		html += "...";
	}
	
	for(var i=start;i<=end;i++){
		html += makePageLink(i,i,page,pages,requestType);
	}
	if (pages != end) {
		html += "...";
		html += makeLast(page, pages, requestType);	 
	}
	/*
	if(page != pages){
		html += makePageLink("下一页 >",page+1,null,pages,requestType);	
	}
	*/
	html += makePageLink("下一页 >",page+1,null,pages,requestType);
	
	/*
	html += makePageSelect(page,pages);
	*/
	html= "<div class='page_menu'>"+ html +"</div>";

	if(result)
		return html;
	else
		document.write(html);
}

function makeFirst(requestType){
	return makePageLink("1",1,null,null,requestType);
}

function makeLast(page,pages,requestType){
	return makePageLink(pages,pages,null,null,requestType);
}

function makePageLink(text,page,curr,pages,requestType){
	if(text=="< 上一页" && page==0) {
		return "<span class='disabled'>" + warpPage(text) + "</span>";
	} else if(text=="下一页 >" && (page-1)==pages) {
		return "<span class='disabled'>" + warpPage(text) + "</span>";
	} else {
		if(page==curr) {
			return "<a id=\"go_page_no_" + page + "\" href=\""+ makeUrl(page,requestType) +"\" class=\"current goPageLink\">&nbsp;<span>"+ warpPage(text) +"</span>&nbsp;</a>"
		} else {
			return "<a id=\"go_page_no_" + page + "\" href=\""+ makeUrl(page,requestType) +"\" class=\"goPageLink\">&nbsp;"+ warpPage(text) +"&nbsp;</a>"
		}
	}	
}

function warpPage(text){
	text = new String(text);
	if(!text.match(/^[\u0391-\uFFE5]+$/)){
		return "<span>"+ text +"</span>";
	}
	return text;
}

function makePageSelect(curr,pages){
	var html = "&nbsp;<span>跳转至</span><select class='sel' name='currentPage' onchange='goPage(this.value)' >";
	for(var i=1;i<=pages;i++)
		html+= "<option value='"+ i +"' "+ (curr==i?" selected='selected' ":"") +">"+ i +"</option>";
	html +="</select><span>页</span>";
	return html;
}
	
function makeUrl(page,requestType){
	if(requestType) {
		return "javascript:void(0);";
	} else {
		var url = window.location.toString();
		url = url.replace(/#.*$/,"");
		if(url.match(/page=\d+/)){
			url = url.replace(/page=\d+/,"page="+page);
		}else{
			if(url.indexOf("?")==-1){
				url  += "?page="+page;
			}else{
				url += "&page="+page;
			}
		}
		return url;
	}
}
	
function goPage(page){
	window.location = makeUrl(page);
}
	