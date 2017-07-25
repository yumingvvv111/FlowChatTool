<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Welcome to DSTools</title>

<head>
	
</head>
<script type="text/javascript" >
	function init(){
		window.location.replace("<%=path%>/web/customerController/loginPage");
	}
</script>
<body onload="init();">
</body>
</html>
