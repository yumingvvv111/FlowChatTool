<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<style type="text/css">
	#main-menu #main-menu-inner #menu-content-demo .btn-group{width:100%;}
	#main-menu #main-menu-inner #menu-content-demo .btn-group .btn{height:22px;line-height:20px;padding:0;margin-right: 3px;}
	.navigation{background:#636366;}
	.navigation li:hover{background: #545459}
	
	.hiddenit{
				right: 1%;
				width: 30%;
				height: 30px;
				line-height: 30px;
				border: 1px #c0f4ae solid;
				top:10px;
				background: #dff1d9;
				position: fixed;
				color: #8b9546;
				font-weight: 500;
				text-align: center;
				z-index:9999;
			}
			.hiddenit strong{
				color: #468946;
			}
			
</style>
<!--  
<link type="text/css" rel="stylesheet" href="<%=basePath %>resources/css/bootstrap.min.css">
<link type="text/css" rel="stylesheet" href="<%=basePath %>resources/css/landerapp.min.css">
<link type="text/css" rel="stylesheet" href="<%=basePath %>resources/css/themes.min.css">
<link type="text/css" rel="stylesheet" href="<%=basePath %>resources/css/animate.min.css">
-->

</head>
<body>
	<!-- 2. $MAIN_NAVIGATION ===========================================================================
		
	Main navigation
-->
<div role="navigation" class="navbar navbar-inverse" id="main-navbar">
<!-- Main menu toggle -->
<button id="main-menu-toggle" style="background: #666BC2;color:white;" type="button"><i class="navbar-icon fa fa-bars icon"></i><span class="hide-menu-text">HIDE MENU</span>
</button>

<div class="navbar-inner">
<!-- Main navbar header -->
<div class="navbar-header" style="background: #666BC2;color:white;">

    <!-- Logo -->
    <a class="navbar-brand" href="javascript:gotoCustMainPage();">
        <strong style="font-size:11px; letter-spacing:1px;color:white;">BLS Tool</strong></a>
	<form id="gotoCustMainPageForm" action="<%=path%>/web/customerController/mainPage">
		<input type="hidden" name="curPageNo" value="0" id="curPageNo">
		<input type="hidden" name="perPage" value="0" id="curPageNo">
		<input type="hidden" name="curPageLastId" value="0" id="curPageNo">
	</form>
	
    <!-- Main navbar toggle -->
    <button data-target="#main-navbar-collapse" data-toggle="collapse" class="navbar-toggle collapsed" type="button"><i
            class="navbar-icon fa fa-bars"></i></button>

</div>
<!-- / .navbar-header -->

<div class="collapse navbar-collapse main-navbar-collapse" id="main-navbar-collapse" style="background: #666BC2;">
<div>
<ul class="nav navbar-nav" style="border: 0;">
    <li>
        <a href="javascript:gotoCustMainPage();" style="color: white;">Home</a>
    </li>
    <!--<li class="dropdown">-->
        <!--<a data-toggle="dropdown" class="dropdown-toggle" href="#">Draw Process </a>-->
        <!--<ul class="dropdown-menu">-->
            <!--<li><a href="#">process list</a></li>-->
            <!--<li><a href="#">edit process</a></li>-->
            <!--<li class="divider"></li>-->
            <!--<li><a href="#">run process</a></li>-->
        <!--</ul>-->
    <!--</li>-->
</ul>
<!-- / .navbar-nav -->

<div class="right clearfix" style="border: 0;">
<ul class="nav navbar-nav pull-right right-navbar-nav">


<!-- /3. $END_NAVBAR_ICON_BUTTONS -->
 
<li class="dropdown">
    <a data-toggle="dropdown" class="dropdown-toggle user-menu" href="#" style="color:white;">
        <img src="<%=basePath %>resources/images/2.jpg">
        <span>John Doe</span>
    </a>
    <ul class="dropdown-menu">
        <li><a href="#">Profile <span class="label label-warning pull-right">new</span></a></li>
        <li><a href="#">Account <span class="badge badge-primary pull-right">new</span></a></li>
        <li><a href="#"><i class="dropdown-icon fa fa-cog"></i>&nbsp;&nbsp;Settings</a></li>
        <li class="divider"></li>
        <li><a href="<%=path%>/web/customerController/logout"><i class="dropdown-icon fa fa-power-off"></i>&nbsp;&nbsp;Log Out</a></li>
    </ul>
</li>
</ul>
<!-- / .navbar-nav -->
</div>
<!-- / .right -->
</div>
</div>
<!-- / #main-navbar-collapse -->
</div>
<!-- / .navbar-inner -->
</div>
<!-- / #main-navbar -->
<!-- /2. $END_MAIN_NAVIGATION -->


<div role="navigation" id="main-menu">
    <div id="main-menu-inner">
        <div id="menu-content-demo" class="menu-content top animated fadeIn">
            <!-- Menu custom content demo
                 Javascript: html/assets/demo/demo.js
             -->
            <div>
                <div class="text-bg">
                	<span class="text-slim">Welcome,</span>
                	<span class="text-semibold">
                		<c:choose>
                			<c:when test="${not empty customerInfo.custName}">${customerInfo.custName}</c:when>
                			<c:otherwise>${customerInfo.loginId}</c:otherwise>
                		</c:choose>
                	</span>
                </div>

                <div class="btn-group">
                	<!-- send mail -->
                	<!-- <i class="fa fa-envelope"></i> -->
                    <a class="btn btn-xs btn-primary btn-outline dark" style="border: 0" href="#"><i class="fa fa-envelope"></i></a>
                    <!-- view profile information -->
                    <!-- <i class="fa fa-user"></i> -->
                    <a class="btn btn-xs btn-primary btn-outline dark" style="border: 0" href="#"><i class="fa fa-user"></i></a>
                    <!-- editor profile information -->
                    <!-- <i class="fa fa-cog"></i> -->
                    <a class="btn btn-xs btn-primary btn-outline dark" style="border: 0" href="#"><i class="fa fa-cog"></i></a>
                    <!-- logout -->
                    <!-- <i class="fa fa-power-off"></i> -->
                    <a class="btn btn-xs btn-danger btn-outline dark" style="border: 0" href="<%=path%>/web/customerController/logout" style="width:60px;"><i class="fa fa-power-off"></i></a>
                </div>
                <a class="close" href="#" style="left: 150%;">×</a>
            </div>
        </div>
        <ul class="navigation">
            <li <c:if test="${activeTab=='Customer'}">class="active"</c:if>>
                <a href="javascript:gotoCustMainPage();"><i
                        class="menu-icon fa fa-bar-chart-o"></i><span
                        class="mm-text mmc-dropdown-delay animated fadeIn">User Management</span></a>
            </li>
            <li <c:if test="${activeTab=='Project'}">class="active"</c:if>>
                <a href="<%=path%>/web/sectionController/mainPage?sectionType=PRO"><i class="menu-icon fa fa-files-o"></i><span
                        class="mm-text mmc-dropdown-delay animated fadeIn">Project Management</span></a>

            </li>
            <li <c:if test="${activeTab=='Domain'}">class="active"</c:if>>
                <a href="<%=path%>/web/sectionController/mainPage?sectionType=DOM"><i class="menu-icon fa fa-files-o"></i><span
                        class="mm-text mmc-dropdown-delay animated fadeIn">Domain Management</span></a>

            </li>
            <li <c:if test="${activeTab=='Process'}">class="active"</c:if>>
                <a href="<%=path%>/web/processController/mainPage?processOperate=LIST"><i class="menu-icon fa fa-files-o"></i><span
                        class="mm-text mmc-dropdown-delay animated fadeIn">Process Management</span></a>

            </li>

        </ul>
        
        <!-- / .navigation -->

    </div>
    <!-- / #main-menu-inner -->
</div>
<!-- / #main-menu -->
<!-- alert message div -->
<div class="hiddenit" style="display:none;" id="commonMsg">
			<strong>Well done</strong> You successfully read this important alert message.
		</div>
<!-- Third part js  -->
<script src="<%=basePath %>resources/js/vender/jquery-1.11.1.min.js"></script>
<script src="<%=basePath %>resources/js/vender/jquery-ui-1.9.2.custom.js"></script>
<script src="<%=basePath %>resources/js/bootstrap.min.js"></script>
<script src="<%=basePath %>resources/js/vender/landerapp.min.js"></script>
<!-- Customer operation script -->
<script src="<%=basePath %>resources/js/base.js"></script>

</body>
</html>