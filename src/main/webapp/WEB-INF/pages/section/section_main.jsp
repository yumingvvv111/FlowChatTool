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

<script>var init = [];</script>
<!-- Demo script -->
<script src="<%=basePath %>resources/js/demo.js"></script>
<!-- / Demo script -->

<div id="main-wrapper">


<jsp:include page="../navigate.jsp" flush="true">
	<jsp:param value="Project" name="activeTab"/>
</jsp:include>
<!-- / #main-menu -->
<!-- /4. $MAIN_MENU -->


    <div id="content-wrapper">
        <ul class="breadcrumb breadcrumb-page">
            <div class="breadcrumb-label text-light-gray">You are here: </div>
            <li><a href="#">Home</a></li>
            <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	<li class="active"><a href="#">Project Management</a></li>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	<li class="active"><a href="#">Domain Management</a></li>
                </c:when>
           </c:choose>
            
        </ul>
        <div class="page-header">

            <div class="row">
                <!-- Page header, center on small screens -->
                <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	<h1 class="col-xs-12 col-sm-4 text-center text-left-sm">Project Management</h1>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	<h1 class="col-xs-12 col-sm-4 text-center text-left-sm">Domain Management</h1>
                </c:when>
           </c:choose>
                

                <div class="col-xs-12 col-sm-8">
                    <div class="row">
                        <hr class="visible-xs no-grid-gutter-h">
                        <!-- "Create project" button, width=auto on desktops -->
                        <div class="pull-right col-xs-12 col-sm-auto">
                        	<c:choose>
                        		<c:when test="${sectionType=='PRO' }">
                        			<a href="javascript:addSection();" class="btn btn-primary btn-labeled" style="width: 100%;"><span class="btn-label icon fa fa-plus"></span>Create project</a>
                        		</c:when>
                        		<c:when test="${sectionType=='DOM' }">
                        			<a href="javascript:addSection();" class="btn btn-primary btn-labeled" style="width: 100%;"><span class="btn-label icon fa fa-plus"></span>Create Domain</a>
                        		</c:when>
                        		</c:choose>
                        </div>
                        <form id="addSectionPageForm" action="<%=basePath %>web/sectionController/addSectionPage">
                        	<input type="hidden" name="sectionType" value="${sectionType }">
                        </form>
                        <!-- Margin -->
                        <div class="visible-xs clearfix form-group-margin"></div>

                        <!-- Search field -->
                        <form action="<%=basePath %>web/sectionController/mainPage" class="pull-right col-xs-12 col-sm-6" id="sectionSearchForm">
                            <div class="input-group no-margin">
                                
                                <c:choose>
                        		<c:when test="${sectionType=='PRO' }">
									<input type="text" placeholder="Enter project Id/project name" class="form-control no-padding-hr" style="border:none;background: #fff;background: rgba(0,0,0,.05);" name="searchCondition" value="${searchCondition}">
                        		</c:when>
                        		<c:when test="${sectionType=='DOM' }">
                        			<input type="text" placeholder="Enter domain Id/domain name" class="form-control no-padding-hr" style="border:none;background: #fff;background: rgba(0,0,0,.05);" name="searchCondition" value="${searchCondition}">
                        		</c:when>
                        		</c:choose>
                        		<span class="input-group-addon" style="border:none;background: #fff;background: rgba(0,0,0,.05);"><a class="fa fa-search" href="javascript:sectionSearchBtn();"></a></span>
                        		<input type="hidden" id="sectionType" name="sectionType" value="${sectionType }"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
<c:if test="${!empty curSectionInfo}">
        <div class="panel">
            <div class="panel-heading">
             <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	<span class="panel-title">Current Project</span>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	<span class="panel-title">Current Domain</span>
                </c:when>
           </c:choose>
         
           		  <div id="active_title_detail" <c:if test="${operationType!='UPDATE'&&operationType!='VIEW' }">style="display:none;"</c:if>>
           			Project ID:<a data-title="Enter username" data-pk="1" data-type="text" id="bs-x-editable-username" href="javascript:displaySection('${curSectionInfo.sectionId}','VIEW');" class="editable editable-click">${curSectionInfo.sectionNo }</a>
	           			<c:choose>
			                <c:when test="${sectionType=='PRO' }">
			                	  <td>Project Name：</td>
			                </c:when>
			                <c:when test="${sectionType=='DOM' }">
			                	  <td>Domain Name：</td>
			                </c:when>
	          			 </c:choose>
	        			${curSectionInfo.name }
	        			<a data-title="more..." data-pk="1"   id="bs-x-editable-username" href="javascript:moreCurSectionInfo();" class="editable editable-click">more...</a>
        			</div>
            </div>
            <div class="panel-body" id="cur_active_body_div" <c:if test="${operationType=='UPDATE'||operationType=='VIEW'|| operationType=='CREATE'}">style="display:none;"</c:if>>
<div style="width:80%; float:left;"><table style="clear: both" class="table table-bordered table-striped" id="user">
    <tbody>
    <tr>
        <td width="35%">Project ID</td>
        <td width="65%"><a data-title="Enter username" data-pk="1" data-type="text" id="bs-x-editable-username" href="javascript:displaySection('${curSectionInfo.sectionId}','VIEW');" class="editable editable-click">${curSectionInfo.sectionNo }</a></td>
    </tr>
    <tr>
     <c:choose>
                <c:when test="${sectionType=='PRO' }">
                	  <td>Project Name</td>
                </c:when>
                <c:when test="${sectionType=='DOM' }">
                	  <td>Domain Name</td>
                </c:when>
           </c:choose>
        <td>${curSectionInfo.name }</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>${curSectionInfo.description }</td>
    </tr>
    <tr>
        <td>Status</td>
        <td>
        	 <span id="${curSectionInfo.sectionId }_cur_pdStatus">
		        <c:choose>
		        	<c:when test="${curSectionInfo.pdStatus==2 }">
						 Binding        	
		        	</c:when>
		        	<c:when test="${curSectionInfo.pdStatus==3 }">
						 Unfinished
		        	</c:when>
		        	<c:when test="${curSectionInfo.pdStatus==4 }">
						Failed
		        	</c:when>
		        	<c:otherwise>
		        		Normal
		        	</c:otherwise>
		        </c:choose>
		        </span>
        </td>
    </tr>
    <tr>
        <td>update Date</td>
        <td> ${curSectionInfo.updateTime }</td>
    </tr>
    <tr>
        <td>opertion</td>
        <td> 
        	<c:choose>
				<c:when test="${sectionType=='PRO' }">
					<c:choose>
						<c:when test="${customerInfo.curProjectId==curSectionInfo.sectionId }">
							<a  title="" href="javascript:activeSection(${curSectionInfo.sectionId },'${sectionType}','UNACTIVE');"><i class="fa fa-pencil">unActive</i></a>
						</c:when>
						<c:otherwise>
							<a  title="" href="javascript:activeSection(${curSectionInfo.sectionId },'${sectionType}','ACTIVE');"><i class="fa fa-pencil">Active</i></a>
						</c:otherwise>
					</c:choose>
				</c:when>
				<c:when test="${sectionType=='DOM' }">
					<c:choose>
						<c:when test="${customerInfo.curDomainId==curSectionInfo.sectionId }">
							<a  title="" href="javascript:activeSection(${curSectionInfo.sectionId },'${sectionType}','UNACTIVE');"><i class="fa fa-pencil">unActive</i></a>
						</c:when>
						<c:otherwise>
							<a  title="" href="javascript:activeSection(${curSectionInfo.sectionId },'${sectionType}','ACTIVE');"><i class="fa fa-pencil">Active</i></a>
						</c:otherwise>
					</c:choose>
				</c:when>
			</c:choose>
			<c:choose>
				<c:when test="${curSectionInfo.pdStatus==2 }">
					<a  href="javascript:updateBlockFunction();" id="${curSectionInfo.sectionId }_cur_section_update"><i class="fa fa-pencil">update</i></a>
					<div id="${curSectionInfo.sectionId}_cur_lockOper">
						<a  title="" href="javascript:sectionItemOper('<%=basePath %>',${curSectionInfo.sectionId },'${sectionType }',${curSectionInfo.pdStatus},1,'unlock');"><i class="fa fa-pencil">unlock</i></a>
					</div>
				</c:when>
				<c:otherwise>
					<a data-toggle="modal" data-target="#modal-blurred-bg" href="#" onclick="javascript:showFormWindow(${curSectionInfo.sectionId },'UPDATE');" id="${curSectionInfo.sectionId }_cur_section_update"><i class="fa fa-pencil">update</i></a>
					<div id="${curSectionInfo.sectionId}_cur_lockOper">
						<a  title="" href="javascript:sectionItemOper('<%=basePath %>',${curSectionInfo.sectionId },'${sectionType }',${curSectionInfo.pdStatus},2,'lock');"><i class="fa fa-pencil">lock</i></a>
					</div>
				</c:otherwise>
			</c:choose>
        </td>
    </tr>
   	</tbody>
</table> </div>
<div style="width:20%; height: 176px; overflow:hidden; border: 1px solid #E4E4E4;float:right;border-left: none;">
    <script>
        init.push(function () {
            // Easy Pie Charts
            var easyPieChartDefaults = {
                animate: 2000,
                scaleColor: false,
                lineWidth: 6,
                lineCap: 'square',
                size: 90,
                trackColor: '#e5e5e5'
            }

            $('#easy-pie-chart-2').easyPieChart($.extend({}, easyPieChartDefaults, {
                barColor: LanderApp.settings.consts.COLORS[1]
            }));

        });
    </script>
    <div class="stat-panel text-center">
        <div class="stat-row">
            <div class="stat-cell bg-dark-gray padding-sm text-xs text-semibold">
                <i class="fa fa-flash"></i>&nbsp;&nbsp;percent complete
            </div>
        </div> <!-- /.stat-row -->
        <div class="stat-row">
            <div class="stat-cell bordered no-border-t no-padding-hr">
                <div class="pie-chart" data-percent="93" id="easy-pie-chart-2">
                    <div class="pie-chart-label">93%</div></div>
            </div>
        </div> <!-- /.stat-row -->
    </div>
</div>
<a data-title="zoom..." data-pk="1"   id="bs-x-editable-username" href="javascript:zoomCurSectionInfo();" class="editable editable-click">zoom...</a>
            </div>
        </div>

</c:if>
	<!-- display section list -->
         <div id="section_list_div" <c:if test="${operationType=='UPDATE'||operationType=='VIEW'|| operationType=='CREATE' }">style="display:none;"</c:if>>
         	<jsp:include page="list_part.jsp" flush="true">
         		<jsp:param name="sectionType" value="${sectionType}"/>
         		<jsp:param name="sectionList" value="${sectionList }"/>
         		<jsp:param name="searchCondition" value="${searchCondition }"/>
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         	</jsp:include>
         </div>
         <div id="section_add_div" <c:if test="${operationType!='CREATE'}">style="display:none;"</c:if>>
         	<jsp:include page="add_section.jsp" flush="true">
         		<jsp:param name="sectionType" value="${sectionType}"/>
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         		<jsp:param name="allProcess" value="${allProcess}"/>
         	</jsp:include>
         </div>
		<div id="section_update_div" <c:if test="${operationType!='UPDATE' }">style="display:none;"</c:if>>
         	<jsp:include page="update_section.jsp" flush="true">
         		<jsp:param name="sectionType" value="${sectionType}"/>
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         		<jsp:param name="sectionItem" value="${sectionItem }"/>
         	</jsp:include>
         </div>
        <div id="section_display_div" <c:if test="${operationType!='VIEW' }">style="display:none;"</c:if>>
         	<jsp:include page="display_section.jsp" flush="true">
         		<jsp:param name="sectionType" value="${sectionType}"/>
         		<jsp:param name="basePath" value="<%=basePath %>"/>
         		<jsp:param name="sectionItem" value="${sectionItem }"/>
         	</jsp:include>
         </div>
    </div>
<!-- / #content-wrapper -->
<div id="main-menu-bg"></div>
</div>
<!-- / #main-wrapper -->
         	<jsp:include page="process_list.jsp" />
  
<script src="<%=basePath %>resources/js/sectionOper.js"></script>
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
                <div id="addProcess">
                	<form action="#">
                		<div style="width: 100%;height: 100%;">
                			<div id="chosenPart" style="width: 40%;position: absolute;">
                			Chosed process
                				<c:if test="${chosedProcess!=null }">
                				<c:forEach var="eachPro" items="${ chosedProcess}">
                					<input type="checkbox" id="${eachPro.processId }" value="${eachPro.processId }" checked="checked"/>${eachPro.processNo }
                				</c:forEach>
                				</c:if>
                			</div>
                			<div id="waitChoosePart" style="width: 40%;position: absolute;">
                			Optional Process
                			<c:if test="${optionalProcess!=null }">
                				<c:forEach var="eachPro" items="${optionalProcess }">
                					<input type="checkbox" id="${eachPro.processId }" value="${eachPro.processId }"/>${eachPro.processNo }
                				</c:forEach>
                			</c:if>
                			</div>
                		</div>
						<input type="button" id="addProcessBtn" onclick="addProcessBtn();" value="add"/>
						<input type="button" id="cancelProcessBtn" onclick="cancelProcessBtn();" value="cancel"/>                	
                	</form>
                </div>
                div id="modal-blurred-bg" class="modal fade modal-blur" tabindex="-1" role="dialog" style="display: none;">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">×</button>
                                <h4 class="modal-title">Update</h4>
                            </div>
                            <div class="modal-body">
                                
                            </div>
                        </div> <!-- / .modal-content -->
                    </div> <!-- / .modal-dialog -->
                </div> <!-- / .modal -->
</body>
</html>