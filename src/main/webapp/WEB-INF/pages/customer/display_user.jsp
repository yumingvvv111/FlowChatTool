<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
 <div id="displayCustomerDiv">
         <div class="form-group">
        <label for="displayloginId">loginId</label>
        <input type="email" name="loginId" class="form-control" id="displayloginId"  value="${curCustInfo.loginId }" readonly="readonly">
      </div>
      <div class="form-group">
        <label for="displayEmailAddress">email Address</label>
        <input type="email" name="emailAddress" class="form-control" id="displayEmailAddress"  readonly="readonly" value="${curCustInfo.emailAddress }">
      </div>
      <div class="form-group">
        <label for="displayCustName">Full Name</label>
        <input type="text" name="custName" class="form-control" id="displayCustName"  readonly="readonly" value="${curCustInfo.custName }">
      </div>
      <div class="form-group">
        <label for="displayCustType">customer Type</label>
        <c:choose>
        	<c:when test="${curCustInfo.type==1 }">
				<input type="text" name="custType" class="form-control" id="displayCustType" readonly="readonly" value="Developer">        	
        	</c:when>
        	<c:otherwise>
        		<input type="text" name="custType" class="form-control" id="displayCustType" readonly="readonly" value="Administrator">
        	</c:otherwise>
        </c:choose>
      </div>
      <div class="form-group">
        <label for="updateGender">Gender</label>
        <c:choose>
        	<c:when test="${curCustInfo.gender==1 }">
				<input type="text" name="gender" class="form-control" id="displayGender" readonly="readonly" value="Male">        	
        	</c:when>
        	<c:when test="${curCustInfo.gender==2 }">
				<input type="text" name="gender" class="form-control" id="displayGender" readonly="readonly" value="Female">        	
        	</c:when>
        	<c:otherwise>
        		<input type="text" name="gender" class="form-control" id="displayGender" readonly="readonly" value="Confidential">
        	</c:otherwise>
        </c:choose>
      </div>
      <div class="form-group">
        <label for="updateState">State</label>
         <c:choose>
        	<c:when test="${curCustInfo.state==1 }">
				 <input type="text" name="displayState"  class="form-control" id="displayState" readonly="readonly" value="Authenticated">        	
        	</c:when>
        	<c:when test="${curCustInfo.state==2 }">
				 <input type="text" name="displayState"  class="form-control" id="displayState" readonly="readonly" value="Freeze">
        	</c:when>
        	<c:otherwise>
        		 <input type="text" name="displayState"  class="form-control" id="displayState" readonly="readonly" value="Register">
        	</c:otherwise>
        </c:choose>
      </div>
      <div class="form-group">
        <label for="updateState">Register Time</label>
          <input type="text" name="registerName"  class="form-control" id="displayRegisterName" readonly="readonly" value="${curCustInfo.registerTime }">
      </div>
      <div class="form-group">
       <input type="button" name="editUserBtn"  id="editUserBtn" value="edit" onclick="displayEditCustomer(${curCustInfo.custId});"/>
        <input type="button" name="closeDisplayBtn"  id="closeDisplayBtn" value="close" onclick="gotoCustMainPage();"/>
      </div>
</div>
</body>
</html>