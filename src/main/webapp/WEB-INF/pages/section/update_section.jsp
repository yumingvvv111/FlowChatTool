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
                		<label for="sectionNumber">project Number</label>
                	     <input type="text" name="sectionId" class="form-control" id="updateSectionNumber"  placeholder="Enter Project Number"  value="${sectionItem.sectionNo}"  onblur="checkSectionNumber('U');"><span id="checkSectionNumberUpdateErrorMsg"></span>
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
                	   <label for="sectionNumber">domain Number</label>
                	     <input type="text" name="sectionId" class="form-control" id="updateSectionNumber" placeholder="Enter DomainId"   value="${sectionItem.sectionId}"  onblur="checkSectionNumber('U');"><span id="checkSectionNumberUpdateErrorMsg"></span>
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
           <c:choose>
           <c:when test="${chosedMap!=null }">
				<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered dataTable no-footer" id="jq-datatables-example" aria-describedby="jq-datatables-example_info">
	           		<thead>
                		<tr role="row">
                			<th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;"></th>
                			<th class="sorting_asc" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;">ID</th>
                			<th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Browser: activate to sort column ascending" style="width: 265px;">
				               	name
				            </th>
				             <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">description</th>
				            <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">state</th>
				            <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">operation</th>
						</tr>
						</thead>
						<tbody>
			        	   <c:forEach items="${chosedMap }" var="eachPro">
			        	   	<c:if test="${eachPro!=null}">
								<tr>
									<td><input type="checkbox" id="${eachPro.key.processId }" value="${eachPro.key.processId}" name="processLinkedId" <c:if test="${eachPro.value==1 }">checked</c:if>></td>
									<td>${eachPro.key.processNo }</td>
									<td>${eachPro.key.processName }</td>
									<td>${eachPro.key.description }</td>
									<td>${eachPro.key.state }</td>
									<td></td>
									           		
			           			</tr>
			           		</c:if>
			           		</c:forEach>
	           			</tbody>
	       		</table>
           </c:when>
           <c:when test="${optionalProcess!=null }">
           		<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered dataTable no-footer" id="jq-datatables-example" aria-describedby="jq-datatables-example_info">
	           		<thead>
                		<tr role="row">
                			<th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;"></th>
                			<th class="sorting_asc" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;">ID</th>
                			<th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Browser: activate to sort column ascending" style="width: 265px;">
				               	name
				            </th>
				             <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">description</th>
				            <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">state</th>
				            <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">operation</th>
						</tr>
						</thead>
						<tbody>
			        	   <c:forEach items="${optionalProcess }" var="eachPro">
								<tr>
									<td><input type="checkbox" id="${eachPro.processId }" value="${eachPro.processId}" name="processLinkedId"></td>
									<td>${eachPro.processNo }</td>
									<td>${eachPro.processNo }</td>
									<td>${eachPro.processName }</td>
									<td>${eachPro.description }</td>
									<td></td>
			           			</tr>
			           		</c:forEach>
	           			</tbody>
	       		</table>
           </c:when>
           </c:choose>
      </div>
      <div class="form-group">
       <input type="hidden" name="sectionType"  id="sectionType" value="${sectionType }"/>
       <input type="hidden" name="id"  id="id" value="${sectionItem.sectionId }"/>
        <input type="button" name="createSectionBtn"  id="updateSectionBtn" value="Update" onclick="updateSection();">
        <input type="button" name="cancelSectionBtn"  id="cancelSectionBtn" value="Cancel" onclick="cancelAddOrUpdateSection();">
      </div>
    </form>
    <form id="getSectionForm" action="${basePath}getSection" method="get">
         <input type="hidden"  id="sectionId" name="sectionId"/>
         <input type="hidden"  id="sectionType" name="sectionType" value="${sectionType }"/>
         <input type="hidden"  id="operationType" name="operationType"/>
    </form>
    <input type="hidden" id="checkBashPath" value="${basePath}"/>
</body>
</html>