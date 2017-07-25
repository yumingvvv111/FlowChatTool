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
  <form id="createProcessForm" action="${param.basePath}web/processController/addProcess" method="post">
   <div class="form-group" id="required-msg-div" style="display:none;color:red;">
   Please enter the required fields!
   </div>
      <div class="form-group">
    	<label for="processId">processId *</label>
        <input type="text" name="processNo" class="form-control" id="enterProcessNo" placeholder="Enter process number" onblur="processNumberCheck('C');"/><span id="checkprocssNoErrorMsg"></span>
       </div>
        <div class="form-group">
			<label for="processName">process Name *</label>
			<input type="text" name="processName" class="form-control" id="processName" placeholder="Enter Process Name" value=""/>
		</div>
		<div class="form-group">
			<label for="processType">process type *</label>
			<select name="processType" id="processType">
				<option id="mainProcess" value="1" selected="selected">Main Process</option>
				<option id="subProcess" value="2">Sub Process</option>
			</select>
		</div>
		<div class="form-group">
			<label for="description">Description</label>
			<input type="text" name="description" class="form-control" id="description" placeholder="Enter Description" value=""/>
		</div>
		<div class="form-group">
			<label for="linkProcessses">Link the subProcesses:</label>
			<a href="#" onclick="linkTheSubProcess();">Choose</a>
		</div>
      <div class="form-group">
        <input type="button" name="createProcessBtn"  id="createProcessBtn" value="Create Process" onclick="createProcessFun();">
        <input type="button" name="cancelProcessBtn"  id="cancelProcessBtn" value="Cancel" onclick="cancelAddOrUpdateProcessFun();">
      </div>
      <input type="hidden" id="bashPathAdd" value="${param.basePath}"/>
      <input type="hidden" id="processNoAvailable" value="N"/>
    </form>
    <script src="${param.basePath}resources/js/processOper.js"></script>
</body>
</html>