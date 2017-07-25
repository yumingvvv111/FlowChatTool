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
        <c:choose>
                <c:when test="${sectionType=='PRO' }">
                		<label for="projectId">projectId</label>
                	     <input type="text" name="sectionId" class="form-control" id="projectId"   value="${sectionItem.sectionNo}" readonly="readonly">
                	     <div class="form-group">
				        <label for="projectName">project Name</label>
				        <input type="text" name="sectionName" class="form-control" id="projectName"  placeholder="Enter Projectname"   value="${sectionItem.name}" readonly="readonly">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description"   placeholder="Enter Project description" value="${sectionItem.description}" readonly="readonly">
				      </div>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	   <label for="domainId">domainId</label>
                	     <input type="text" name="sectionId" class="form-control" id="domainId" placeholder="Enter DomainId"   value="${sectionItem.sectionNo}" readonly="readonly">
                	     <div class="form-group">
				        <label for="domainName">domain Name</label>
				        <input type="text" name="sectionName" class="form-control" id="domainName" placeholder="Enter Domain Name"   value="${sectionItem.name}" readonly="readonly">
				      </div>
				      <div class="form-group">
				        <label for="description">Description</label>
				        <input type="text" name="sectionDesc" class="form-control" id="description" placeholder="Enter Description" value="${sectionItem.description}" readonly="readonly">
				      </div>
                </c:when>
           </c:choose>
           <c:if test="${sectionItem.process!=null }">
				<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered dataTable no-footer" id="jq-datatables-example" aria-describedby="jq-datatables-example_info">
	           		<thead>
                		<tr role="row">
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
			        	   <c:forEach items="${sectionItem.process }" var="eachPro">
								<tr>
									<td>${eachPro.processNo }</td>
									<td>${eachPro.processName }</td>
									<td>${eachPro.description }</td>
									<td></td>
									           		
			           			</tr>
			           		</c:forEach>
	           			</tbody>
	       		</table>
           </c:if>
      </div>
      <div class="form-group">
        <input type="button" name="createSectionBtn"  id="updateSectionBtn" value="Update" data-toggle="modal" data-target="#modal-blurred-bg" href="#" onclick="showFormWindow(${sectionItem.sectionId },'UPDATE');">
        <input type="button" name="cancelSectionBtn"  id="cancelSectionBtn" value="Cancel" onclick="cancelAddOrUpdateSection();">
      </div>
    <form id="getSectionForm" action="${basePath}getSection" method="get">
         <input type="hidden"  id="sectionId" name="sectionId"/>
         <input type="hidden"  id="sectionType" name="sectionType" value="${sectionType }"/>
         <input type="hidden"  id="operationType" name="operationType"/>
    </form>
</body>
</html>