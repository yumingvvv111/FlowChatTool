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
  <form id="updateSectionForm" action="${basePath}updateSection" method="post">
      <div class="form-group">
        <c:choose>
        		
                <c:when test="${sectionType=='PRO' }">
                		<label for="projectId">projectId</label>
                	     <input type="text" name="sectionId" class="form-control" id="projectId"  placeholder="Enter ProjectId"  value="${sectionItem.sectionNo}">
                	     <div class="form-group">
				        <label for="projectName">project Name</label>
				        <input type="text" name="sectionName" class="form-control" id="projectName"  placeholder="Enter Projectname"   value="${sectionItem.name}">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description"   placeholder="Enter Project description" value="${sectionItem.description}">
				      </div>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	   <label for="domainId">domainId</label>
                	     <input type="text" name="sectionId" class="form-control" id="domainId" placeholder="Enter DomainId"   value="${sectionItem.sectionNo}">
                	     <div class="form-group">
				        <label for="domainName">domain Name</label>
				        <input type="text" name="sectionName" class="form-control" id="domainName" placeholder="Enter Domain Name"   value="${sectionItem.name}">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description" placeholder="Enter Description" value="${sectionItem.description}">
				      </div>
                </c:when>
           </c:choose>
      </div>
      <div class="form-group">
       <input type="hidden" name="sectionType"  id="sectionType" value="${sectionType }"/>
       <input type="hidden" name="id"  id="id" value="${sectionItem.sectionId }"/>
        <input type="button" name="createSectionBtn"  id="createSectionBtn" value="Update" onclick="updateSection();">
        <input type="button" name="cancelSectionBtn"  id="cancelSectionBtn" value="Cancel" onclick="cancelAddOrUpdateSection();">
      </div>
    </form>
    <form id="getSectionForm" action="${basePath}getSection" method="get">
         <input type="hidden"  id="updateSectionId" name="updateSectionId"/>
         <input type="hidden"  id="updateSectionType" name="updateSectionType" value="${sectionType }"/>
    </form>
</body>
</html>