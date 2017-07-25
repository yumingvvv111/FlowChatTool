<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html class="gt-ie8 gt-ie9 not-ie pxajs"><!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <title>Bosch Language Service</title>
    <meta content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
          name="viewport">
	
 		    <!-- Open Sans font from Google CDN -->
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/css-family.css">
    <!-- LanderApp's stylesheets -->
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/landerapp.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/widgets.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/pages.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/rtl.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/themes.min.css">
    <link type="text/css" rel="stylesheet"
          href="<%=basePath %>resources/css/jquery-ui.css">      
 

    <style type="text/css">
    .jqstooltip {
        position: absolute;
        left: 0px;
        top: 0px;
        visibility: hidden;
        background: rgb(0, 0, 0) transparent;
        background-color: rgba(0, 0, 0, 0.6);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
        color: white;
        font: 10px arial, san serif;
        text-align: left;
        white-space: nowrap;
        padding: 5px;
        border: 1px solid white;
        z-index: 10000;
    }

    .jqsfield {
        color: white;
        font: 10px arial, san serif;
        text-align: left;
    }
    .search_here{height: 50px; margin-bottom: 12px;}
    #searchUser{display: table-cell;height: 40px;padding: 10px 16px;font-size: 17px;line-height: 1.33;width: 78%;position:absolute;}
    #userSearchBtn{  height: 45px;padding: 10px 16px;font-size: 17px;line-height: 1.33;border-radius: 3px;border: 1px;}
    </style>
</head>


<body class="theme-default main-menu-animated page-search">

<script>var init = [];</script>
<script src="<%=basePath %>resources/js/demo.js"></script>
<div id="main-wrapper">


<jsp:include page="../navigate.jsp" flush="true">
	<jsp:param value="Customer" name="activeTab"/>
</jsp:include>

<div id="content-wrapper">
  	<ul class="breadcrumb breadcrumb-page">
    <div class="breadcrumb-label text-light-gray">You are here: </div>
		<li><a href="#">Home</a></li>
		<li class="active"><a href="#">User Management</a></li>
	</ul>
	<div class="page-header">
		<div class="row">
			<h1 class="col-xs-12 col-sm-4 text-center text-left-sm">User Management</h1>
                <div class="col-xs-12 col-sm-8">
                    <div class="row">
                        <hr class="visible-xs no-grid-gutter-h">
                        <!-- "Create project" button, width=auto on desktops -->
                        <div class="pull-right col-xs-12 col-sm-auto">
                         <a id="create_customer" class="btn btn-primary btn-labeled" style="width: 100%;height: 40px;line-height: 25px;font-size: 15px;" href="javascript:addCustomer();"
						     data-original-title="Add new customer" >Create Customer</a>
                        </div>
                        <!-- Search field -->
                        <form action="<%=basePath %>web/customerController/mainPage" method="get" id="userSearchForm">
						    <div class="search_here">
								<input type="text" id="searchUser" placeholder="Enter email address/user name" name="searchCondition" value="${searchCondition }">
								<span class="input-group-addon" style="border:none;background: #fff;background: rgba(0,0,0,.05);"><a class="fa fa-search" href="javascript:userSearch();" style="position: relative;left:49.5%;top:9px;"></a></span>
							</div>
						</form>
                    </div>
                </div>
            </div>
        </div>

<!-- Search results -->
<div class="panel-body tab-content">
    <!-- List users -->
    <!-- style="height:700px;" -->
    <div id="list_users_div" <c:if test="${showPart=='Display' || showPart=='Edit'}"> style="display:none;"</c:if>>
	  	<jsp:include page="list_user.jsp">
	  		<jsp:param value="<%=basePath %>" name="basePath"/>
	  		<jsp:param value="${customerInfoList}" name="customerInfoList"/>
	  		<jsp:param value="${searchCondition}" name="searchCondition"/>
	  	</jsp:include>
  	</div>
  	<!-- /List users -->
  	
  	<!-- add user -->
    <div id="add_user_div" style="display:none;">
	  	<jsp:include page="add_user.jsp" flush="true">
	  		<jsp:param name="basePath" value="<%=basePath %>" />
	  	</jsp:include>
  	</div>
  	<!-- /add user -->
  	
  	<!-- update user -->
    <div id="update_user_div"  <c:if test="${showPart!='Edit'}">style="display:none;"</c:if>>
	  	<jsp:include page="update_user.jsp" flush="true">
	  		<jsp:param value="<%=basePath %>" name="basePath"/>
	  		<jsp:param value="${eachUserItem}" name="eachUserItem"/>
	  	</jsp:include>
  	</div>
  	<!-- /update user -->
  	
  	<!-- display user -->
    <div id="display_users_div" <c:if test="${showPart!='Display'}">style="display:none;"</c:if>>
	  	<jsp:include page="display_user.jsp" flush="true">
	  		<jsp:param  name="curCustInfo" value="${curCustInfo}"/>
	  	</jsp:include>
  	</div>
  	<!-- /List users -->
  	
  	<!-- modify password-->
    <div id="modify_password_div"  style="display:none;">
	  	<jsp:include page="modify_password.jsp" flush="true">
	  		<jsp:param value="<%=basePath %>" name="basePath"/>
	  		<jsp:param value="${eachUserItem}" name="eachUserItem"/>
	  	</jsp:include>
  	</div>
  	<!-- /List users -->
   
</div>

</div>
<!-- / #content-wrapper -->
<div id="main-menu-bg"></div>
</div>
<!-- / #main-wrapper -->


<!-- add customer div -->


<!-- Third vender javascripts -->


<!-- Customer operation script -->

<input type="hidden" id="loginName" value="${customerInfo.custName }"/>
<input type="hidden" id="DISPLAYMSGCONTENT" value="${DISPLAYMSGCONTENT}"/>	
<script src="<%=basePath %>resources/js/customerOper.js"></script>

<div style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;" id="small-screen-width-point"></div>
<div style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;"
     id="tablet-screen-width-point"></div>
     
                    <!-- Template -->
                <div id="modal-blurred-bg" class="modal fade modal-blur" tabindex="-1" role="dialog" style="display: none;">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">×</button>
                                <h4 class="modal-title">New design instead of current view</h4>
                            </div>
                            <div class="modal-body">
                            </div>
                        </div> <!-- / .modal-content -->
                    </div> <!-- / .modal-dialog -->
                </div> <!-- / .modal -->
                <!-- / Template -->
</body>
</html>