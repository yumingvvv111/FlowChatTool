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
    <title>Bosch Admin</title>
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
 

    <style type="text/css">.jqstooltip {
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
    }</style>
</head>


<body class="theme-default main-menu-animated page-search">

<div id="main-wrapper">


<jsp:include page="../navigate.jsp" flush="true">
	<jsp:param value="Process" name="activeTab"/>
</jsp:include>
<!-- / #main-menu -->
<!-- /4. $MAIN_MENU -->


    <div id="content-wrapper">
        <ul class="breadcrumb breadcrumb-page">
            <div class="breadcrumb-label text-light-gray">You are here: </div>
            <li><a href="#">Home</a></li>
            <li class="active"><a href="#">Process Management</a></li>
        </ul>
       <%--  <input type="button" value="obtainTTS" onclick="obtainTTSAudioPath('<%=basePath %>');"/>
        <input type="button" value="proxyProcess" onclick="proxyProcessInfo();"/> --%>
        <div class="page-header">
            <div class="row">
                <!-- Page header, center on small screens -->
                	<h1 class="col-xs-12 col-sm-4 text-center text-left-sm">Process Management</h1>
                <div class="col-xs-12 col-sm-8">
                    <div class="row">
                        <hr class="visible-xs no-grid-gutter-h">
                        <!-- "Create project" button, width=auto on desktops -->
                        <div class="pull-right col-xs-12 col-sm-auto">
                    		<a href="javascript:addProcess();" class="btn btn-primary btn-labeled" style="width: 100%;"><span class="btn-label icon fa fa-plus"></span>Create process</a>
                        </div>
                        <!-- Margin -->
                        <div class="visible-xs clearfix form-group-margin"></div>

                        <!-- Search field -->
                        <form action="<%=basePath %>/web/processController/mainPage" class="pull-right col-xs-12 col-sm-6" id="searchProcessForm">
                            <div class="input-group no-margin">
                                <input type="text" placeholder="Enter process Id/process name" class="form-control no-padding-hr" style="border:none;background: #fff;background: rgba(0,0,0,.05);" name="searchCondition" value="${searchCondition }">
                                <span class="input-group-addon" style="border:none;background: #fff;background: rgba(0,0,0,.05);"><a class="fa fa-search" href="javascript:searchProcessLink();"></a></span>
                                <input type="hidden" name="processOperate" value="LIST"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
 	<!-- display process list -->
         <div id="process_list_div" <c:if test="${processOperate!='LIST' }">style="display:none;"</c:if>>
         	<jsp:include page="list_part.jsp" flush="true">
         		<jsp:param name="processList" value="${processList }"/>
         		<jsp:param name="searchCondition" value="${searchCondition }"/>
         	</jsp:include>
         </div>
         <div id="process_add_div" <c:if test="${processOperate!='ADD' }">style="display:none;"</c:if>>
         	<jsp:include page="add_process.jsp" flush="true">
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         	</jsp:include>
         </div>
		<div id="process_update_div" <c:if test="${processOperate!='UPDATE' }">style="display:none;"</c:if>>
         	<jsp:include page="update_process.jsp" flush="true">
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         		<jsp:param name="processItem" value="${processItem }"/>
         	</jsp:include>
         </div>
         <div id="process_display_div" <c:if test="${processOperate!='VIEW' }">style="display:none;"</c:if>>
         	<jsp:include page="display_process.jsp" flush="true">
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         		<jsp:param name="processItem" value="${processItem }"/>
         	</jsp:include>
         </div>
    </div>
<!-- / #content-wrapper -->
<div id="main-menu-bg"></div>
</div>
<!-- / #main-wrapper -->
<script src="<%=basePath %>resources/js/processOper.js"></script>
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