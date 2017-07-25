<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
String path = request.getContextPath();
String processId = request.getParameter("processId");
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE>
<html>
<div id="coFrameDiv" style="height:0px;display:none;">
</div>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Bosch Language Service Process Management v1</title>
    
    <link href="<%=basePath %>resources/css/lib/kendo.common.min.css" rel="stylesheet" />
    <link href="<%=basePath %>resources/css/lib/kendo.rtl.min.css" rel="stylesheet" />
    <link href="<%=basePath %>resources/css/lib/kendo.metro.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="<%=basePath %>resources/css/lib/styles.css" />
    
    <script src="<%=basePath %>resources/js/jquery-2.1.3.js"></script>
    <script src="<%=basePath %>resources/js/angular.js"></script>
    <script src="<%=basePath %>resources/js/jszip.min.js"></script>
    <script src="<%=basePath %>resources/js/kendo.all.min.js"></script>
    <script src="<%=basePath %>resources/js/kendo.timezones.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>resources/js/canvas-toBlob.js"></script>
    <script type="text/javascript" src="<%=basePath %>resources/js/FileSaver.js"></script>
    <script src="<%=basePath %>resources/js/main-debug.js"></script>
    <script src="<%=basePath %>resources/js/process-page.js"></script>
    <script type="text/javascript">
    function getBasePath(){
    	return '<%=basePath %>';
    }
    </script>
    </head>
    <body>
</head>
<body>
<input type="hidden" id="processId" value="<%=processId %>"/>
<div id="currentFile" style="display:none;">Bosch Language Service Process Management</div>
<div id="menu">
<div class="header">
            DSTools
</div>
        <ul></ul>
</div>
    <div id="splitter">
        <div id="left-pane" style="background:#f0f0f0;">
            <div class="pane-content" id="sideBar">
                <ul id="shapesPanelBar">
                    <li>
                        Library
                        <div class="palettel-wraper" style="display:none;">
                        <div id="myPalette1" class="my-palette slide-wrapper shape-content-height">
                <canvas class="sidebar-canvas shape-content-height">
                    This text is displayed if your browser does not support the Canvas HTML element.
                </canvas>
            </div></div>
                    </li>
                    <li>
                        Overview
                        <div class="overview-height"><div id="myOverview" class="overview-height">
                <canvas class="sidebar-canvas">
                    This text is displayed if your browser does not support the Canvas HTML element.
                </canvas>
            </div></div>
                    </li>
                </ul>
            </div>
        </div>
        <div id="center-pane">
            <div class="pane-content">
                    <div id="myDiagram" style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
            <canvas tabindex="0"
                    style="position: absolute; top: 0px; left: 0px; z-index: 2; -webkit-user-select: none; width: 1013px; cursor: auto;">
                This text is displayed if your browser does not support the Canvas HTML element.
            </canvas>
         </div>
            </div>
            
            <div id="openDocument" class="draggable" style="visibility: hidden;">
        <div id="openText" class="elementText">Choose file to open...</div>
        <select id="mySavedFiles" class="mySavedFiles"></select>
        <br>
        <button id="openBtn" aria-disabled="false" role="button" class="k-button" data-role="button" type="button" onclick="loadFile()" style="margin-left: 70px">Open
        </button>
        <button id="cancelBtn" aria-disabled="false" role="button" class="k-button" data-role="button" type="button" onclick="closeElement('openDocument')">
            Cancel
        </button>
    </div>
    <div id="loadFromJson">
    <p>Please select a json file from local host</p>
    <input type="file" id="uploadJson"/>
    </div>
    <div id="listAllPaths">
    </div>
    <div id="removeDocument" class="draggable" style="visibility: hidden;">
        <div id="removeDraggableHandle" class="handle">Delete File</div>
        <div id="removeText" class="elementText">Choose file to remove...</div>
        <select id="mySavedFiles2" class="mySavedFiles"></select>
        <br>
        <button id="removeBtn" class="elementBtn" type="button" onclick="removeFile()" style="margin-left: 70px">
            Remove
        </button>
        <button id="cancelBtn2" class="elementBtn" type="button" onclick="closeElement('removeDocument')">
            Cancel
        </button>
    </div>
        </div>
        <div id="right-pane">
            <div class="pane-content">
                <ul id="configurationPanelBar">
                    <li style="display:none">
                    Canvas Properties
                    <div id="canvasProperties">
                        <ul>
                            <li>
                                <span>Background Color:</span>
                                <input id="canvasBackgroundColorPicker" class="colorPicker" />
                            </li>
                            <li>
                                <span>Layout:</span>
                                <input id="canvasLayout" />
                            </li>
                        </ul>
                    </div>
                    </li>
                    <li>
                    Edit Properties
                    <input id="key" type="hidden"/>
                    <input id="category" type="hidden"/>
                    <input id="item" type="hidden"/>
                    <div id="shapeProperties">
                        <ul>
                            <li class="propery-item" data-category="common">
                                <span>Title:</span>
                                <input id="shapeTitle" class="comboBox fk-shapeTitle" placeholder="Select text..."/>
                            </li>
                            <li class="propery-item" data-category="shape">
                                <span>Description:</span>
                                <textarea id="description" class="k-widget fk-shapeDescription shape-description" placeholder="Type text here..."></textarea>
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Content:</span>
                                <textarea id="ProContent" class="k-widget fk-content" placeholder="Content..."></textarea>
                            </li>
                            <li class="propery-item" data-category="font">
                                <span>Text Align:</span>
                                <input id="TextAlign" class="comboBox fk-textAlign" placeholder="left"/>
                            </li>
                            <li class="propery-item" data-category="font">
                                <span>Font Size:</span>
                                <input type="text" id="fontSize" class="numeric fk-fontSize" />
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Background Color:</span>
                                <input id="shapeBackgroundColorPicker" class="comboBox colorPicker fk-shapeBackgroundColorPicker" data-callback="updateShapeBackground"/>
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Background image:</span>
                                <textarea id="shapeBackgroundImagePicker" class="k-widget fk-ImagePicker" placeholder="ImageDataUrl"></textarea>
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Stroke Color:</span>
                                <input id="shapeStrokeColorPicker" class="colorPicker fk-shapeStrokeColorPicker" data-callback="updateShapeStrokeColor"/>
                            </li>
                            <li class="propery-item" data-category="shape">
                                <span>Stroke Weight:</span>
                                <input type="text" id="shapeStrokeWidth" class="numeric fk-shapeStrokeWidth" />
                            </li>
                            <li class="propery-item" data-category="shape">
                                <span>Width:</span>
                                <input type="text" id="shapeWidth" class="numeric fk-shapeWidth" />
                            </li>
                            <li class="propery-item" data-category="shape">
                                <span>Height:</span>
                                <input type="text" id="shapeHeight" class="numeric fk-shapeHeight" />
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Position X:</span>
                                <input type="text" id="shapePositionX" class="numeric fk-shapePositionX" />
                            </li>
                            <li class="propery-item" data-category="common">
                                <span>Position Y:</span>
                                <input type="text" id="shapePositionY" class="numeric fk-shapePositionY" />
                            </li>
                            
                        </ul>
                    </div>
                    </li>
                    
                    <li>
                    Align
                    <div id="alignConfiguration" style="width: 100%; padding: 10px; box-sizing: border-box; text-align: left;">
                        <button class="configurationButtons" data-position="top">
                            <span class="alignTop"></span>
                        </button><button class="configurationButtons" data-position="bottom">
                            <span class="alignBottom"></span>
                        </button><button class="configurationButtons" data-position="left">
                            <span class="alignLeft"></span>
                        </button><button class="configurationButtons" data-position="right">
                            <span class="alignRight"></span>
                        </button><button class="configurationButtons" data-position="horizontal">
                            <span class="alignHor"></span>
                        </button><button class="configurationButtons" data-position="vertical">
                            <span class="alignVer"></span>
                        </button>
                    </div>
                    </li>
                    <li>
                    Arrange
                    <div id="arrangeConfiguration">
                        <div style="width: 100%; padding: 10px; box-sizing: border-box; text-align: left;">
                            <button class="configurationButtons">
                                <span class="toFront"></span>
                            </button><button class="configurationButtons">
                                <span class="toBack"></span>
                            </button>
                        </div>
                    </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div id="bottom-box">
        <div class="action-buttons">
        <button name="link" class="action-link" title="Link"></button>
        <button name="select" class="action-select" title="Select"></button>
        <button name="move" class="action-move" title="Move"></button>
        <button name="zoom" class="action-zoom" title="Zoom"></button>
        <button name="zoomIn" class="action-zoomin" title="Zoom In"></button>
        <button name="zoomOut" class="action-zoomout" title="Zoom Out"></button>
        <button name="grid" class="action-grid" title="Grid"></button>
        <input id="grid" name="options" value="grid" type="checkbox" style="display: none;">
            <select class="zoom-value">
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
            </select>
    </div>
        <input id="diagramZoom" />
        <input type="text" id="diagramZoomIndicator" class="k-textbox" value="100" style="width: 40px; vertical-align: middle;" />
    </div>

   <div style="visibility: hidden;">
                <textarea id="mySavedModel" style="width: 100%; height: 300px"> </textarea>
    </div>
</body>
</html>