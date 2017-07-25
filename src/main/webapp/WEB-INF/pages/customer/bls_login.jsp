<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="<%=basePath %>resources/css/bls-page.css" rel="stylesheet" type="text/css">
<title>Bosch Language Service Login Page</title>
</head>
<body>
<div class="login-wraper">
    <form name="loginForm" action="<%=path%>/web/customerController/login" method="post" id="loginForm">
        <input type="text" name="loginId" id="LoginId" placeholder="email fromat" onblur="checkLoginId();"><span id="checkLoginIdErrorMsg"></span>
        <input type="password" name="loginPwd" id="loginPwd"  onblur="checkPwd();"><span id="checkPwdErrorMsg"></span>
        <button class="button-left" onclick="loginBtn.call(this, event);">Login</button>
    </form>
     <button class="button-right" onclick="javascrtpt:window.location.href='<%=path%>/web/customerController/registerPage'">Register</button>
</div>
<input type="hidden" id="loginBashPath" value="<%=basePath %>"/>
<input type="hidden" id="LoginIdAvailable" value="N"/>
<input type="hidden" id="passwordAvailable" value="N"/>
<div class="user-gate"><a href="<%=path%>/web/customerController/loginPage">Login</a> | <a href="<%=path%>/web/customerController/registerPage">Register</a></div>
<!-- Customer operation script -->
<script src="<%=basePath %>resources/js/vender/jquery-1.11.1.min.js"></script>
<script src="<%=basePath %>resources/js/customerOper.js"></script>
</body>
</html>