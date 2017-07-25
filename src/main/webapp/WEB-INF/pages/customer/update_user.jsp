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
	<div id="updateCustomer"> 
		<form id="updateCustomerForm" action="${basePath}updateCustomer" method="post">
	         <div class="form-group">
	        <label for="loginId">loginId</label>
	        <input type="email" name="updateloginId" class="form-control" id="updateloginId"  value="${curCustInfo.loginId }" readonly="readonly">
	      </div>
	      <div class="form-group">
	        <label for="emailAddress">email Address</label>
	        <input type="email" name="emailAddress" class="form-control" id="emailAddress" placeholder="Enter email Address" value="${curCustInfo.emailAddress }" onblur="updateEmailAddrCheck();"/><span id="checkEmailAddrErrorMsg"></span>
	      </div>
	      <div class="form-group">
	        <label for="updateCustName">Full Name</label>
	        <input type="text" name="custName" class="form-control" id="updateCustName" placeholder="Enter Full Name" value="${curCustInfo.custName }">
	      </div>
	      <div class="form-group">
	        <label for="updateCustType">customer Type</label>
	        <span style="display: block;">
	        <c:choose>
	        	<c:when test="${curCustInfo.type ==2 }">
			        <input type="radio" name="custType" id="updateCustTypeA" value="2" checked="checked"/>Administration
			        <input type="radio" name="custType" id="updateCustTypeD" value="1"/>Developer	
	        	</c:when>
	        	<c:otherwise>
	        		<input type="radio" name="custType" id="updateCustTypeA" value="2"/>Administration
			        <input type="radio" name="custType" id="updateCustTypeD" value="1"  checked="checked"/>Developer	
	        	</c:otherwise>
	        </c:choose>
	        
	        </span>
	      </div>
	      <div class="form-group">
	        <label for="updateGender">Gender</label>
	         <span style="display: block;">
	         	<c:choose>
	        	<c:when test="${curCustInfo.gender ==2 }">
	        		<input type="radio" name="gender" id="updateGenderM" value="1"/>Male
		        	<input type="radio" name="gender" id="updateGenderFemale" value="2" checked="checked"/>Female
		        	<input type="radio" name="gender" id="updateGenderOther" value="0"/>Other
	        	</c:when>
	        	<c:when test="${curCustInfo.gender ==1 }">
			        <input type="radio" name="gender" id="updateGenderM" value="1" checked="checked"/>Male
		        	<input type="radio" name="gender" id="updateGenderFemale" value="2"/>Female
		        	<input type="radio" name="gender" id="updateGenderOther" value="0"/>Other	
	        	</c:when>
	        	<c:otherwise>
	        		<input type="radio" name="gender" id="updateGenderM" value="1"/>Male
		        	<input type="radio" name="gender" id="updateGenderFemale" value="2"/>Female
		        	<input type="radio" name="gender" id="updateGenderOther" value="0"  checked="checked"/>Other		
	        	</c:otherwise>
	        </c:choose>
	        </span>
	      </div>
	          <div class="form-group">
	        <label for="updateState">State</label>
	         <select name="custState" id="updateState">
	         	<option value="0" <c:if test="${curCustInfo.state==0}">selected="selected"</c:if>>Not Verified</option>
	         	<option value="1" <c:if test="${curCustInfo.state==1}">selected="selected"</c:if>>Verified</option>
	         	<option value="2" <c:if test="${curCustInfo.state==2}">selected="selected"</c:if>>Blocked</option>
	         	<option value="3" <c:if test="${curCustInfo.state==3}">selected="selected"</c:if>>Failure</option>
	         	<option></option>
	         </select>
	      </div>
	      <div class="form-group">
	       <input type="hidden" name="custId"  id="updateCustId" value="${curCustInfo.custId }"/>
	        <input type="button" name="updateBtn"  id="updateBtn" value="update" onclick="updateCustomerBtn();"/>
	        <input type="button" name="cancelUpdateBtn"  id="cancelUpdateBtn" value="Cancel" onclick="gotoCustMainPage();"/>
	      </div>
    </form>
	</div>
</body>
</html>