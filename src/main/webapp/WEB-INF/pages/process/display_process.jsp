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
	<div class="form-group">
		<label for="processId">processId</label>
		<input type="text" name="processId" class="form-control" id="processId"   value="${processItem.processNo}" readonly="readonly"/>
	</div>
	<div class="form-group">
		<label for="processName">process Name</label>
		<input type="text" name="processName" class="form-control" id="processName"  value="${processItem.processName}" readonly="readonly"/>
	</div>
	<div class="form-group">
		<label for="description">Description</label>
		<input type="text" name="description" class="form-control" id="description"  value="${processItem.description}" readonly="readonly"/>
	</div>
	<div class="form-group">
		<label for="processType">process Type</label>
		<c:choose>
			<c:when test="${processItem.processType==1}">
				<input type="text" name="processType" class="form-control" id="processType"  value="Main process" readonly="readonly"/>	
			</c:when>
			<c:otherwise>
				<input type="text" name="processType" class="form-control" id="processType"  value="Sub Process" readonly="readonly"/>
			</c:otherwise>
		</c:choose>
	</div>
	<div class="form-group">
		<label for="processState">process State</label>
		<c:choose>
       		<c:when test="${processItem.state==1 }">
       		<input type="text" name="processState" class="form-control" id="processState"  value="EDIT" readonly="readonly"/>
       		</c:when>
       		<c:when test="${processItem.state==2}">
       		<input type="text" name="processState" class="form-control" id="processState"  value="RUN" readonly="readonly"/>
       		</c:when>
       		<c:when test="${processItem.state==3}">
       		<input type="text" name="processState" class="form-control" id="processState"  value="BLOCK" readonly="readonly"/>
       		</c:when>
       		<c:otherwise>
       		<input type="text" name="processState" class="form-control" id="processState"  value="DISABLED" readonly="readonly"/>
       		</c:otherwise>
       	</c:choose>
	</div>
	<div class="form-group">
		<label for="processThumbnail">process Thumbnail</label>
		<input type="text" name="processThumbnail" class="form-control" id="processThumbnail"  value="${processItem.filePath}" readonly="readonly"/>
	</div>
      <div class="form-group">
        <input type="button" name="updateProcessBtn"  id="updateProcessBtn" value="Update" onclick="displayProcess(${processItem.processId},'UPDATE');">
        <input type="button" name="updateProcessCanceBtn"  id="updateProcessCanceBtn" value="Cancel" onclick="cancelAddOrUpdateProcess();">
      </div>
     <form action="${param.basePath }getProcess" method="post" id="getProcessInfo">
        	<input type="hidden" id="processId" name="processId"/>
        	<input type="hidden" id="processOperate" name="processOperate"/>
     </form>
     	 <input type="hidden" id="bashPathValue" value="${param.basePath }"/>
     <script src="${param.basePath}resources/js/processOper.js"></script>
</body>
</html>