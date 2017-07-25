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
        <form id="createCustomerForm" action="${param.basePath }web/customerController/addCustomer" method="post">
      <div class="form-group">
        <label for="loginId">loginId(email Address)</label>
        <input type="text" data-type="email" name="loginId" class="form-control" id="registerLoginId" placeholder="Email format" value="" onblur='checkRegLoginId();'><span id="checkLoginIdErrorMsg"></span>
      </div>
      <div class="form-group">
        <label for="custName">Full Name</label>
        <input type="text" name="custName" class="form-control" id="custName" placeholder="Enter Full Name" value=""><span class="Error">The customer name can not be empty!</span>
      </div>
      <div class="form-group">
        <label for="gender">Gender</label>
        <input type="radio" name="custGender" id="Male" value="1" checked="checked"/>Male
        <input type="radio" name="custGender" id="Female" value="2"/>Female
        <input type="radio" name="custGender" id="Other" value="0"/>Other
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" name="loginPwd" class="form-control" id="registerPwd" onblur="checkRegPwd();" placeholder="The length of the password is 8 to 16"><span id="checkPwdErrorMsg"></span>
      </div>
      <div class="form-group">
        <label for="confirmLoginPassword">Confirmed password</label>
        <input type="password" name="loginConfirmPwd" class="form-control" onblur="checkRegRePwd();" id="registerRePwd" placeholder="Enter the same password"><span id="checkRePwdErrorMsg"></span>
      </div>
      <div class="form-group">
        <label for="createType">User type</label>
        <input type="radio" name="userType" id="userTypeD" value="1" checked="checked"/>Developer
        <input type="radio" name="userType" id="userTypeA" value="2"/>Administrator
      </div>
      <div class="form-group">
	    <input type="hidden" name="createType" id="operateType" value="ADD"/>
        <input type="button" name="createBtn"  id="createBtn" value="Create" onclick="createCustomerBtn();">
        <input type="button" name="cancelBtn"  id="cancelBtn" value="Cancel" onclick="cancelCreateUserBtn();">
      </div>
    </form>
    <form action="${param.basePath }web/customerController/mainPage" id="goToMainpageForm" name="gotoMainpageForm">
    	<input type="hidden" name="curPageNo" value="0" id="curPageNo">
    </form>
    <input type="hidden" id="registerBasepath" value="${param.basePath }"/>
    <input type="hidden" id="LoginIdAvailable" value="N"/>
	<input type="hidden" id="passwordAvailable" value="N"/>
	<input type="hidden" id="rePasswordAvailable" value="N"/>
    <script src="${param.basePath }resources/js/customerLoginAndRegister.js"></script>
    
</body>
</html>