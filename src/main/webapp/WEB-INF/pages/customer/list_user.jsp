<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<style type="text/css">
	#create_customer{}
</style>
</head>
<body>
	<input type="hidden" id="allcounts" value="${customerCount }">
	 <div id="search-tabs-users" class="search-users tab-pane fade active in">
        <table class="table table-hover">
            <thead>
            <tr>
                <th class="text-center">Serial Num</th>
                <th>User</th>
                <th>Full Name</th>
                <th>E-mail</th>
                <th>Operator</th>
            </tr>
            </thead>
            
            <tbody>
            <c:choose> 
            		<c:when test="${customerInfoList!=null && fn:length(customerInfoList)>0}">
            			<c:forEach items="${customerInfoList}" var="eachCustInfo">
	            			<tr>
				                <td class="text-center">${eachCustInfo.custId }</td>
				                <td>
				                    <img class="avatar" alt="" src="<%=basePath %>resources/images/1.jpg"> &nbsp;&nbsp;
				                    <a href="javascript:displayCustomer('${eachCustInfo.custId}');">${eachCustInfo.custName }</a>
				                </td>
				                <td>${eachCustInfo.custName }</td>
				                <td>${eachCustInfo.emailAddress }</td>
				                <td>
				                	<c:choose>
				                		<c:when test="${eachCustInfo.type!=0}">
				                		<!-- Administrator -->
				                		<!-- <i class="fa fa-pencil"></i> -->
						                	<a class="btn btn-xs btn-outline btn-success add-tooltip" title="" href="javascript:displayEditCustomer('${eachCustInfo.custId}');"
						                       data-original-title="Edit"><i class="fa fa-pencil"></i></a>
						                   <!--  <a class="btn btn-xs btn-outline btn-danger add-tooltip" title="" href="#"
						                       data-original-title="Delete" onclick="rem();"><i class="fa fa-times"></i></a>
						                    <a class="btn btn-xs btn-outline btn-info add-tooltip" title="" href="#"
						                       data-original-title="Ban user" onclick="sor();"><i class="fa fa-lock"></i></a> -->
						                    <input type="hidden" id="${eachCustInfo.custId}_loginId" value="${ eachCustInfo.loginId}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_custName" value="${ eachCustInfo.custName}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_custEmail" value="${ eachCustInfo.emailAddress}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_gender" value="${ eachCustInfo.gender}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_type" value="${ eachCustInfo.type}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_state" value="${ eachCustInfo.state}"/>
						                   <input type="hidden" id="${eachCustInfo.custId}_registerTime" value="${ eachCustInfo.registerTime}"/>
				                		</c:when>
				                		<c:otherwise>
				                		<!-- Developer -->
				                			<a class="btn btn-xs btn-outline add-tooltip" title="" href="javascript:editCustomer('${eachCustInfo.custId }')"
						                       data-original-title="Edit"><i class="fa fa-pencil"></i></a>
						                    <!-- <a class="btn btn-xs btn-outline add-tooltip" title="" href="javascript:void(0)"
						                       data-original-title="Delete"><i class="fa fa-times"></i></a>
						                    <a class="btn btn-xs btn-outline add-tooltip" title="" href="javascript:void(0)"
						                       data-original-title="Ban user"><i class="fa fa-lock"></i></a> -->
				                		</c:otherwise>
				                	</c:choose>
				                </td>
				            </tr>
            			</c:forEach>
             		</c:when>
            		<c:otherwise>
            		<tr>
            			<td>
							No results!            			
            			</td>
            		</tr>
            		</c:otherwise>
            	</c:choose>
            </tbody>
        </table>
   		<c:if test="${customerInfoList!=null && fn:length(customerInfoList)>0}">
         <jsp:include page="../pagination.jsp?pageList=+${pageList}">
             	<jsp:param value="${curPageNo }" name="page"/>
             	<jsp:param value="${totalPages }" name="totalPages"/>
             	<jsp:param value="${curPageLastId }" name="curPageLastId"/>
             	<jsp:param value="${perPage }" name="perPage"/>
           		<jsp:param value="${allCount }" name="allCount"/>
           		<jsp:param value="${searchCondition }" name="searchCondition"/>
         </jsp:include>
       </c:if>
    </div>
    <form id="displayUserForm" action="<%=basePath %>web/customerController/displayCustomer">
    	<input type="hidden" id="disCustId" name="disCustId">
    	<input type="hidden" id="showPart" name="showPart">
    </form>
</body>
</html>