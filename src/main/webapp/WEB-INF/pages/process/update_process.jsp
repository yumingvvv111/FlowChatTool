<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>Insert title here</title>
</head>
<body>
  <form id="updateProcessForm" action="${param.basePath}web/processController/updateProcess" method="post">
	<div class="form-group">
		<label for="enterProcessNo">processId</label>
		<input type="text" name="processId" class="form-control" id="updateProcessNo" value="${processItem.processNo}" onblur="processNumberCheck('U');"/><span id="checkprocssNoUpdateErrorMsg"></span>
	</div>
	<div class="form-group">
		<label for="processName">process Name</label>
		<input type="text" name="processName" class="form-control" id="processName"  value="${processItem.processName}">
	</div>
	<div class="form-group">
		<label for="description">Description</label>
		<input type="text" name="description" class="form-control" id="description"  value="${processItem.description}">
	</div>
	<div class="form-group">
		<label for="processType">process Type</label>
		<select name="processType" id="processType">
				<option id="mainProcess" value="1" <c:if test="${processItem.processType==1}">selected="selected"</c:if>>Main Process</option>
				<option id="subProcess" value="2" <c:if test="${processItem.processType==2}">selected="selected"</c:if>>Sub Process</option>
		</select>
	</div>
	<div class="form-group">
		<label for="processState">process State</label>
		<select name="processState" id="processState">
				<option id="edit" value="1" <c:if test="${processItem.state==1}">selected="selected"</c:if>>EDIT</option>
				<option id="run" value="2" <c:if test="${processItem.state==2}">selected="selected"</c:if>>RUN</option>
				<option id="block" value="3" <c:if test="${processItem.state==3}">selected="selected"</c:if>>BLOCK</option>
				<option id="disabled" value="4" <c:if test="${processItem.state==4}">selected="selected"</c:if>>DISABLED</option>
		</select>
	</div>
	<div class="form-group">
		<label for="processThumbnail">process Thumbnail</label>
		<img alt="" src="">
		<input type="text" name="processThumbnail" class="form-control" id="processThumbnail"  value="${processItem.filePath}">
	</div>
		<div class="form-group">
		<label for="updateDrawProcess">update drawing process</label>
		 <input type="hidden" id="bashPathValue" value="${param.basePath }"/>
		<a href="javascript:gotoEditMode(${processItem.processId});">update</a>
	</div>
      <div class="form-group">
       <input type="hidden" name="id"  id="id" value="${processItem.processId }"/>
        <input type="button" name="createSectionBtn"  id="updateProcesssBtn" value="Update" onclick="updateProcess();">
        <input type="button" name="cancelSectionBtn"  id="cancelSectionBtn" value="Cancel" onclick="cancelAddOrUpdateProcess();">
      </div>
    </form>
    <form action="${param.basePath }getProcess" method="post" id="getProcessInfo">
        	<input type="hidden" id="processId" name="processId"/>
        	<input type="hidden" id="processOperate" name="processOperate"/>
     </form>
     <input type="hidden" id="bashPathAdd" value="${param.basePath}"/>
      <input type="hidden" id="processNoAvailable" value="N"/>
     <script src="${param.basePath}resources/js/processOper.js"></script>
</body>
</html>