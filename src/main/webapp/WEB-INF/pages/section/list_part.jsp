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
		
	<div class="table-primary">
            <div role="grid" id="jq-datatables-example_wrapper" class="dataTables_wrapper form-inline no-footer"><div class="table-header clearfix"><div class="table-caption">
              <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	     Project List
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	    Domain List
                </c:when>
           </c:choose>
            </div><div class="DT-lf-right"></div></div>
            <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered dataTable no-footer" id="jq-datatables-example" aria-describedby="jq-datatables-example_info">
                <thead>
                <tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;">ID</th><th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Browser: activate to sort column ascending" style="width: 265px;">
                <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	         Project Name
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	       Domain Name
                </c:when>
           </c:choose>
            
                
                </th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;">Discription</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Engine version: activate to sort column ascending" style="width: 150px;">Status</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="CSS grade: activate to sort column ascending" style="width: 105px;">Start Date</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="CSS grade: activate to sort column ascending" style="width: 105px;">Operation</th>
                </tr>
                </thead>
                <tbody>
				<c:choose>
            		<c:when test="${!empty sectionList && sectionList!=null}">
            			<c:forEach items="${sectionList}" var="eachSectionInfo">
                <tr class="gradeA odd">
                    <td class="sorting_1">${eachSectionInfo.sectionNo }</td>
                    <td>
                     <a href="javascript:displaySection('${eachSectionInfo.sectionId}','VIEW');">${eachSectionInfo.name}</a>
                    </td>
                    <td>${eachSectionInfo.description }</td>
                    <td class="center" >
                    <span id="${eachSectionInfo.sectionId }_pdStatus">
	                    <c:choose>
				        	<c:when test="${eachSectionInfo.pdStatus==2 }">
								 Binding        	
				        	</c:when>
				        	<c:when test="${eachSectionInfo.pdStatus==3 }">
								 Unfinished
				        	</c:when>
				        	<c:when test="${eachSectionInfo.pdStatus==4 }">
								Failed
				        	</c:when>
				        	<c:otherwise>
				        		Normal
				        	</c:otherwise>
				        </c:choose>
				      </span>
       				 </td>
                    <td class="center">${eachSectionInfo.createTime }</td>
                     <td class="center">
                     <c:choose>
		                <c:when test="${sectionType=='PRO' }">
		                	 <c:choose>
	                     		<c:when test="${customerInfo.curProjectId==eachSectionInfo.sectionId }">
	                     			<a  title="" href="javascript:activeSection(${eachSectionInfo.sectionId },'${sectionType}','UNACTIVE');"><i class="fa fa-pencil">unActive</i></a>
	                     		</c:when>
	                     		<c:otherwise>
	                     			<a  title="" href="javascript:activeSection(${eachSectionInfo.sectionId },'${sectionType}','ACTIVE');"><i class="fa fa-pencil">Active</i></a>
	                     		</c:otherwise>
                     		</c:choose>
		                </c:when>
		                <c:when test="${sectionType=='DOM' }">
		                	   <c:choose>
		                     		<c:when test="${customerInfo.curDomainId==eachSectionInfo.sectionId }">
		                     			<a  title="" href="javascript:activeSection(${eachSectionInfo.sectionId },'${sectionType}','UNACTIVE');"><i class="fa fa-pencil">unActive</i></a>
		                     		</c:when>
		                     		<c:otherwise>
		                     			<a  title="" href="javascript:activeSection(${eachSectionInfo.sectionId },'${sectionType}','ACTIVE');"><i class="fa fa-pencil">Active</i></a>
		                     		</c:otherwise>
		                     	</c:choose>
		                </c:when>
		           </c:choose>
                     	<c:choose>
                     		<c:when test="${eachSectionInfo.pdStatus==2 }">
                     			<a  href="javascript:updateBlockFunction();" id="${eachSectionInfo.sectionId }_section_list_update"><i class="fa fa-pencil">update</i></a>
                     			<div id="${eachSectionInfo.sectionId}_lockOper">
                     				<a  title="" href="javascript:sectionItemOper('<%=basePath %>',${eachSectionInfo.sectionId },'${sectionType }',${eachSectionInfo.pdStatus},1,'unlock');"><i class="fa fa-pencil">unlock</i></a>
                     			</div>
                     		</c:when>
                     		<c:otherwise>
                     		<a data-toggle="modal" data-target="#modal-blurred-bg" href="#" onclick="javascript:showFormWindow(${eachSectionInfo.sectionId },'UPDATE');" id="${eachSectionInfo.sectionId }_section_list_update"><i class="fa fa-pencil">update</i></a>
                     		<div id="${eachSectionInfo.sectionId}_lockOper">
                     			<a  title="" href="javascript:sectionItemOper('<%=basePath %>',${eachSectionInfo.sectionId },'${sectionType }',${eachSectionInfo.pdStatus},2,'lock');"><i class="fa fa-pencil">lock</i></a>
                     		</div>
                     		</c:otherwise>
                     	</c:choose>
                       	<%-- <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	<c:choose>
                     		<c:when test="${customerInfo.curProjectId==eachSectionInfo.id }">
                     			<a  title="" href="javascript:void(0)"><i class="fa fa-pencil">unBinding</i></a>
                     		</c:when>
                     		<c:otherwise>
                     			<a  title="" href="javascript:void(0)"><i class="fa fa-pencil">binding</i></a>
                     		</c:otherwise> 
                     </c:choose>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	<c:choose>
                     		<c:when test="${customerInfo.curDomainId==eachSectionInfo.id }">
                     			<a  title="" href="javascript:void(0)"><i class="fa fa-pencil">unBinding</i></a>
                     		</c:when>
                     		<c:otherwise>
                     			<a  title="" href="javascript:void(0)"><i class="fa fa-pencil">binding</i></a>
                     		</c:otherwise>
                     	</c:choose>
                </c:when>
           </c:choose>
                    	<a  title="" href="javascript:void(0)"><i class="fa fa-pencil">remove</i></a> --%>
                     </td>
                </tr>
                </c:forEach>
                </c:when>
                <c:otherwise>
                	 <tr>
                	 	<td colspan="6">
                	 		No Records!
                	 	</td>
                	 </tr>
                
                </c:otherwise>
                </c:choose>
                </tbody>
            </table>
            
            <!-- <div class="table-footer clearfix"><div class="DT-label"><div class="dataTables_info" id="jq-datatables-example_info" role="alert" aria-live="polite" aria-relevant="all">Showing 1 to 10 of 57 entries</div></div><div class="DT-pagination"><div class="dataTables_paginate paging_simple_numbers" id="jq-datatables-example_paginate"><ul class="pagination"><li class="paginate_button previous disabled" aria-controls="jq-datatables-example" tabindex="0" id="jq-datatables-example_previous"><a href="#">Previous</a></li><li class="paginate_button active" aria-controls="jq-datatables-example" tabindex="0"><a href="#">1</a></li><li class="paginate_button " aria-controls="jq-datatables-example" tabindex="0"><a href="#">2</a></li><li class="paginate_button " aria-controls="jq-datatables-example" tabindex="0"><a href="#">3</a></li><li class="paginate_button " aria-controls="jq-datatables-example" tabindex="0"><a href="#">4</a></li><li class="paginate_button " aria-controls="jq-datatables-example" tabindex="0"><a href="#">5</a></li><li class="paginate_button " aria-controls="jq-datatables-example" tabindex="0"><a href="#">6</a></li><li class="paginate_button next" aria-controls="jq-datatables-example" tabindex="0" id="jq-datatables-example_next"><a href="#">Next</a></li></ul></div></div></div>
             -->
            
            </div>
        </div>
        <c:if test="${!empty sectionList && sectionList!=null}">
			<jsp:include page="../pagination.jsp?pageList=+${pageList}">
             	<jsp:param value="${curPageNo }" name="page"/>
             	<jsp:param value="${totalPages }" name="totalPages"/>
             	<jsp:param value="${curPageLastId }" name="curPageLastId"/>
             	<jsp:param value="${perPage }" name="perPage"/>
             	<jsp:param value="${sectionType }" name="sectionType"/>
             	<jsp:param value="${allCount }" name="allCount"/>
             	<jsp:param value="${searchCondition }" name="searchCondition"/>
             </jsp:include>
       </c:if>
        <form id="actionOperForm" action="${basePath}activeSection" method="post">
        	<input type="hidden" id="activeId" name="id"/>
        	<input type="hidden" id="activeSectionType" name="sectionType"/>
        	<input type="hidden" id="activeOperType" name="operType"/>
        </form>
<script src="<%=basePath %>resources/js/sectionOper.js"></script>
</body>
</html>