<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="<%=basePath %>resources/css/bls-page.css" rel="stylesheet" type="text/css">
<title>Bosch Language Service Register Page</title>
</head>
<body>
<div class="register-wraper">
        <form name="registerForm" action="<%=path%>/web/customerController/addCustomer" method="post">
        <input type="text" name="loginId" data-type="email" id="registerLoginId" onblur='checkRegLoginId();'><span id="checkLoginIdErrorMsg"></span>
        <input type="password" name="loginPwd" id="registerPwd" data-type="password" onblur="checkRegPwd();" placeholder="The length of the password is 8 to 16"><span id="checkPwdErrorMsg"></span>
        <input type="password" name="rePassword" data-type="rePassword" onblur="checkRegRePwd();" id="registerRePwd" placeholder="Enter the same password"><span id="checkRePwdErrorMsg"></span>
        <input type="hidden" name="operateType" value="REGISTER"/>
        <button class="button-left" id="RegisterBtn" onclick="registerCust.call(this, event);">Register</button>
    </form>
    <button class="button-right" onclick="resetReg.call(this,event);">Reset</button>
</div>
<input type="hidden" id="LoginIdAvailable" value="N"/>
<input type="hidden" id="passwordAvailable" value="N"/>
<input type="hidden" id="rePasswordAvailable" value="N"/>
<input type="hidden" id="registerBasepath" value="<%=path%>"/>
<div class="user-gate"><a href="<%=path%>/web/customerController/loginPage">Login</a> | <a href="<%=path%>/web/customerController/registerPage">Register</a></div>
<!-- Customer operation script -->
<script src="<%=basePath %>resources/js/customerLoginAndRegister.js"></script>
<script src="<%=basePath %>resources/js/vender/jquery-1.11.1.min.js"></script>

</body>
</html>