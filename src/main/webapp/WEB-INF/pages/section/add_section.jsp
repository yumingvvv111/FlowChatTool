<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>Insert title here</title>
</head>
<body>
  <form id="createSectionForm" action="${basePath}addSection" method="post">
      <div class="form-group">
        <c:choose>
        		
                <c:when test="${sectionType=='PRO' }">
                		<label for="sectionNumber">project Number</label>
                	     <input type="text" name="sectionId" class="form-control" id="sectionNumber" placeholder="Enter ProjectId" value="" onblur="checkSectionNumber('C');"><span id="checkSectionNumberErrorMsg"></span>
                	     <div class="form-group">
				        <label for="projectName">project Name</label>
				        <input type="text" name="sectionName" class="form-control" id="sectionName" placeholder="Enter Project Name" value="">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description" placeholder="Enter Description" value="">
				      </div>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	   <label for="sectionNumber">domain Number</label>
                	     <input type="text" name="sectionId" class="form-control" id="sectionNumber" placeholder="Enter DomainId" value="" onblur="checkSectionNumber('C');"><span id="checkSectionNumberErrorMsg"></span>
                	     <div class="form-group">
				        <label for="domainName">domain Name</label>
				        <input type="text" name="sectionName" class="form-control" id="sectionName" placeholder="Enter Domain Name" value="">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description" placeholder="Enter Description" value="">
				      </div>
                </c:when>
           </c:choose>
           			  <div class="form-group">
           				<label for="linkProcessses">Link the processes:</label>
				         <table class="table table-hover">
					         <thead>
					         <tr>
					         	 <th class="text-center">ID</th>
					             <th>Process Number</th>
					             <th>Process Name</th>
					             <th>Process Status</th>
					         </tr>
					         </thead>
					         <tbody>
					         	<c:forEach var="eachPro" items="${allProcess }">
					         	<tr>
					         		<td>
					         			<input type="checkbox" value="${eachPro.processId }" name="processIds"/>
					         		</td>
					         		<td>
					         			 <a href="javascript:displayProcess('${eachPro.processId}','VIEW');" target="_blank">${eachPro.processNo }</a>
					         		</td>
					         		<td>
					         			${eachPro.processName }
					         		</td>
					         		<td>
					         			${eachPro.state }
					         		</td>
					         	</tr>
					         	</c:forEach>
					         </tbody>
					         </table>
				      </div>
      </div>
      <div class="form-group">
       <input type="hidden" name="sectionType"  id="sectionType" value="${sectionType }"/>
        <input type="button" name="createSectionBtn"  id="createSectionBtn" value="Create">
        <input type="button" name="cancelSectionBtn"  id="cancelSectionBtn" value="Cancel" onclick="cancelAddOrUpdateSection();">
      </div>
    </form>
    <input type="hidden" id="checkBashPath" value="<%=basePath %>"/>
    <input type="hidden" id="sectionNoAvailable" value="N"/>
          <script src="<%=basePath %>resources/js/processOper.js"></script>
</body>
</html>