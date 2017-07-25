<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<style type="text/css">
	#pageControl{padding:10px 15px;border-top:1px solid #ddd;}
	.previewpage{marging:0;margin-right:5px;padding:6px 12px;background:white;border:1px #ddd solid;margin-left:20%;}
	.nextpage{marging:0;margin-right:5px;padding:6px 12px;background:white;border:1px #ddd solid;}
	.number{marging:0;margin-right:5px;padding:6px 12px;background:white;border:1px #ddd solid;}
	.number1{background: gray;color:white;}
	.total{padding:6px 12px;border:1px #ddd solid;display:block;float:right;}
</style>
</head>
<body>
<!-- style="position: relative;bottom: -680px;" -->
	<div class="pagecenter" style="margin: 10px;">
<c:choose>
<c:when test="${param.page != 1}">
<a href="mainPage?curPageNo=${param.page}&perPage=${param.perPage}&curPageLastId=${param.curPageLastId}&moveDirection=0&sectionType=${sectionType}&searchCondition=${param.searchCondition}">
<input type="button" class="previewpage" name="lastPage" value="preview" />
</a>
</c:when>
<c:otherwise>
<input type="button" class="previewpage" disabled="true" name="preview Page" value="preview" /><!-- disabled the button -->
</c:otherwise>
</c:choose>
<c:forEach items="${pageList}" var="item" >
<c:choose>
<c:when test="${item == param.page}">
<span class="nextpage number1" class="currentPage">${item}</span>
</c:when>
<c:when test="${item < param.page}">
<a class="number" href="mainPage?curPageNo=${param.page}&perPage=${param.perPage}&curPageLastId=${param.curPageLastId}&moveDirection=0&sectionType=${sectionType}&searchCondition=${param.searchCondition}">${item}</a>
</c:when>
<c:when test="${item >param.page}">
<a class="number" href="mainPage?curPageNo=${param.page}&perPage=${param.perPage}&curPageLastId=${param.curPageLastId}&moveDirection=1&sectionType=${sectionType}&searchCondition=${param.searchCondition}">${item}</a>
</c:when>
</c:choose>
</c:forEach>
<!-- next page button-->
<c:choose>
<c:when test="${param.page != param.totalPages && param.totalPages!=0}">
<a href="mainPage?curPageNo=${param.page}&perPage=${param.perPage}&curPageLastId=${param.curPageLastId}&moveDirection=1&sectionType=${sectionType}&searchCondition=${param.searchCondition}">
<input type="button" class="nextpage" name="nextPage" value="next" />
</a>
</c:when>
<c:otherwise>
<input type="button" class="nextpage" disabled=true name="nextPage" value="next" /><!-- disabled thebutton -->
</c:otherwise>
</c:choose>
<span class="total">total is ${allCount } items</span>
</div>
</body>
</html>