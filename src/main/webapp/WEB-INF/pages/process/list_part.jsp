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
            <div role="grid"  id="jq-datatables-example_wrapper" class="dataTables_wrapper form-inline no-footer">
            <div class="table-header clearfix" style="background: white;color:black;">
            <div class="table-caption">Process List</div>
            </div>
            <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered dataTable no-footer" id="jq-datatables-example" aria-describedby="jq-datatables-example_info">
                <thead>
                <tr role="row" style="">
                <th class="sorting_asc" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Rendering engine: activate to sort column ascending" style="width: 179px;color: black;">ID</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Browser: activate to sort column ascending" style="width: 265px;color: black;">Process Name</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending" style="width: 241px;color: black;">Discription</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Engine version: activate to sort column ascending" style="width: 150px;color: black;">Process type</th> 
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="Engine version: activate to sort column ascending" style="width: 150px;color: black;">State</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="CSS grade: activate to sort column ascending" style="width: 105px;color: black;">Update Date</th>
                <th class="sorting" tabindex="0" aria-controls="jq-datatables-example" rowspan="1" colspan="1" aria-label="CSS grade: activate to sort column ascending" style="width: 105px;color: black;">Operation</th>
                </tr>
                </thead>
                <tbody>
				<c:choose>
            		<c:when test="${!empty processList && processList!=null}">
            			<c:forEach items="${processList}" var="eachprocessInfo">
                <tr class="gradeA odd">
                    <td class="sorting_1">${eachprocessInfo.processNo }</td>
                    <td>
                     <a href="javascript:displayProcess('${eachprocessInfo.processId}','VIEW');">${eachprocessInfo.processName}</a>
                    </td>
                    <td>${eachprocessInfo.description }</td>
                    <td>
                    	<c:choose>
                    		<c:when test="${eachprocessInfo.processType==1 }">
                    			Main Process
                    		</c:when>
                    		<c:otherwise>
                    			Sub Process
                    		</c:otherwise>
                    	</c:choose>
                    </td>
                    <td class="center">
                    <c:choose>
			       		<c:when test="${eachprocessInfo.state==1 }">
			       		 EDIT
			       		</c:when>
			       		<c:when test="${eachprocessInfo.state==2}">
			       		RUN
			       		</c:when>
			       		<c:when test="${eachprocessInfo.state==3}">
			       		BLOCK
			       		</c:when>
			       		<c:otherwise>
			       		DISABLED
			       		</c:otherwise>
			       	</c:choose>
                    </td>
                    <td class="center">${eachprocessInfo.updateTime }</td>
                     <td class="center">
                     	<a  title="" href="javascript:displayProcess(${eachprocessInfo.processId },'UPDATE');"><i class="fa fa-pencil">update</i></a>
                     	<a  title="" href="javascript:gotoEditMode(${eachprocessInfo.processId});"><i class="fa fa-pencil">edit mode</i></a>
                     	<a  title="" href="javascript:runProcess(${eachprocessInfo.processId });"><i class="fa fa-pencil">run mode</i></a>
                     </td>
                </tr>
                </c:forEach>
                </c:when>
                <c:otherwise>
                	 <tr>
                	 	<td colspan="5">
                	 		No process records!
                	 	</td>
                	 </tr>
                
                </c:otherwise>
                </c:choose>
                </tbody>
            </table>
            </div>
        </div>
        <c:if test="${!empty processList && processList!=null}">
			<jsp:include page="../pagination.jsp">
             	<jsp:param value="${curPageNo }" name="page"/>
             	<jsp:param value="${totalPages }" name="totalPages"/>
             	<jsp:param value="${curPageLastId }" name="curPageLastId"/>
             	<jsp:param value="${perPage }" name="perPage"/>
             	<jsp:param value="${allCount }" name="allCount"/>
             	<jsp:param value="${searchCondition }" name="searchCondition"/>
             </jsp:include>
       </c:if>
       <input type="hidden" id="bashPathValue" value="<%=basePath %>"/>
        <form action="${param.basePath }getProcess" method="post" id="getProcessInfo">
        	<input type="hidden" id="processId" name="processId"/>
        	<input type="hidden" id="processOperate" name="processOperate"/>
        </form>
		<script src="<%=basePath %>resources/js/processOper.js"></script>
</body>
</html>