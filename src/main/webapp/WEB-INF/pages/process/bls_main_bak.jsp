<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<div id="coFrameDiv" style="height:0px;display:none;">
   <!--  <iframe id="coToolbarFrame" src="./libs/placeholder.html"
            style="height:0px;width:100%;display:none;"></iframe> -->
</div>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=GBK">
    <title>Bosch Language Service Process Management</title>
    
    <script src="<%=basePath %>resources/js/main-min.js"></script>
    <link href="<%=basePath %>resources/css/style.css" rel="stylesheet" type="text/css">
    <style></style>
    <link rel="stylesheet" id="coToolbarStyle"
          href="chrome-extension://mkfokfffehpeedafpekjeddnmnjhmcmk/toolbar/styles/placeholder.css" type="text/css">
    <!--<script type="text/javascript" id="cosymantecbfw_removeToolbar">-->
        <!--(function () {-->
            <!--var toolbarElement = {}, parent = {}, interval = 0, retryCount = 0, isRemoved = false;-->
            <!--if (window.location.protocol === 'file:') {-->
                <!--interval = window.setInterval(function () {-->
                    <!--toolbarElement = document.getElementById('coFrameDiv');-->
                    <!--if (toolbarElement) {-->
                        <!--parent = toolbarElement.parentNode;-->
                        <!--if (parent) {-->
                            <!--parent.removeChild(toolbarElement);-->
                            <!--isRemoved = true;-->
                            <!--if (document.body && document.body.style) {-->
                                <!--document.body.style.setProperty('margin-top', '0px', 'important');-->
                            <!--}-->
                        <!--}-->
                    <!--}-->
                    <!--retryCount += 1;-->
                    <!--if (retryCount > 10 || isRemoved) {-->
                        <!--window.clearInterval(interval);-->
                    <!--}-->
                <!--}, 10);-->
            <!--}-->
        <!--})();</script>-->
</head>
<body>
<div>
    <div id="currentFile">Bosch Language Service Process Management (old design, it will change.)</div>
    <div id="menuBar">
        <ul id="nav">
            <li><a href="javascript:void(0)">File</a>
                <ul>
                    <li><a href="javascript:void(0)" onclick="newDocument()">New</a></li>
                    <li><a href="javascript:void(0)" onclick="openDocument()">Open...</a></li>
                    <li><a href="javascript:void(0)" onclick="saveDocument()">Save</a></li>
                    <li><a href="javascript:void(0)" onclick="saveDocumentAs()">Save As...</a>
                    </li>
                    <li><a href="javascript:void(0)" onclick="removeDocument()">Delete...</a>
                    </li>
                </ul>
            </li>
            <li><a href="javascript:void(0)">Edit</a>
                <ul>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.undo()">Undo</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.redo()">Redo</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.cutSelection()">Cut</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.copySelection()">Copy</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.pasteSelection()">Paste</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.deleteSelection()">Delete</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.selectAll()">Select All</a></li>
                </ul>
            </li>
            <li><a href="javascript:void(0)">Align</a>
                <ul>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignLeft()">Left Sides</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignRight()">Right Sides</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignTop()">Tops</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignBottom()">Bottoms</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignCenterX()">Center X</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignCenterY()">Center Y</a></li>
                </ul>
            </li>
            <li><a href="javascript:void(0)">Space</a>
                <ul>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignRow(askSpace())">In Row...</a></li>
                    <li><a href="javascript:void(0)"
                           onclick="myDiagram.commandHandler.alignColumn(askSpace())">In Column...</a></li>
                </ul>
            </li>
            <li><a href="javascript:void(0)">Options</a>
                <ul>
                    <li><a href="javascript:void(0)">
                        <input id="grid" type="checkbox" name="options" value="grid"
                               onclick="updateGridOption()">Grid</a></li>
                    <li><a href="javascript:void(0)">
                        <input id="snap" type="checkbox" name="options" value="0" onclick="updateSnapOption()">Snapping</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!--END menu bar -->

    
    <div id="PaletteAndDiagram">
        <div id="sideBar">
            <div class="handle">Palette:</div>
            <div id="myPalette"
                 style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
                <canvas width="290" height="625" tabindex="0"
                        style="position: absolute; top: 0px; left: 0px; z-index: 2; -webkit-user-select: none; width: 290px; height: 625px; cursor: auto;">
                    This text is displayed if your browser does not support the Canvas HTML element.
                </canvas>
                <div style="position: absolute; overflow: auto; width: 290px; height: 625px; z-index: 1;">
                    <div style="position: absolute; width: 1px; height: 1px;"></div>
                </div>
                <div style="position: absolute; overflow: auto; width: 307px; height: 625px; z-index: 1;">
                    <div style="position: absolute; width: 1px; height: 869.65px;"></div>
                </div>
            </div>
            <div class="handle">Overview:</div>
            <div id="myOverview" style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0);">
                <canvas width="307" height="225" tabindex="0"
                        style="position: absolute; top: 0px; left: 0px; z-index: 2; -webkit-user-select: none; width: 307px; height: 225px;">
                    This text is displayed if your browser does not support the Canvas HTML element.
                </canvas>
                <div style="position: absolute; overflow: auto; width: 307px; height: 225px; z-index: 1;">
                    <div style="position: absolute; width: 1px; height: 1px;"></div>
                </div>
                <div style="position: absolute; overflow: auto; width: 307px; height: 225px; z-index: 1;">
                    <div style="position: absolute; width: 1px; height: 1px;"></div>
                </div>
            </div>
        </div>
        <div id="myDiagram"
             style="position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
            <canvas width="1013" height="700" tabindex="0"
                    style="position: absolute; top: 0px; left: 0px; z-index: 2; -webkit-user-select: none; width: 1013px; height: 700px; cursor: auto;">
                This text is displayed if your browser does not support the Canvas HTML element.
            </canvas>
            <div style="position: absolute; overflow: auto; width: 1013px; height: 700px; z-index: 1;">
                <div style="position: absolute; width: 1px; height: 1px;"></div>
            </div>
            <div style="position: absolute; overflow: auto; width: 1013px; height: 700px; z-index: 1;">
                <div style="position: absolute; width: 1px; height: 1px;"></div>
            </div>
        </div>
    </div>

    <div id="openDocument" class="draggable" style="visibility: hidden;">
        <div id="openDraggableHandle" class="handle">Open File</div>
        <div id="openText" class="elementText">Choose file to open...</div>
        <select id="mySavedFiles" class="mySavedFiles"></select>
        <br>
        <button id="openBtn" class="elementBtn" type="button" onclick="loadFile()" style="margin-left: 70px">Open
        </button>
        <button id="cancelBtn" class="elementBtn" type="button" onclick="closeElement(&#39;openDocument&#39;)">Cancel
        </button>
    </div>

    <div id="removeDocument" class="draggable" style="visibility: hidden;">
        <div id="removeDraggableHandle" class="handle">Delete File</div>
        <div id="removeText" class="elementText">Choose file to remove...</div>
        <select id="mySavedFiles2" class="mySavedFiles"></select>
        <br>
        <button id="removeBtn" class="elementBtn" type="button" onclick="removeFile()" style="margin-left: 70px">
            Remove
        </button>
        <button id="cancelBtn2" class="elementBtn" type="button" onclick="closeElement(&#39;removeDocument&#39;)">
            Cancel
        </button>
    </div>

    <div style="visibility: hidden;">
        <div class="handle">JSON:</div>
        <div id="buttons">
            <button id="loadModel" onclick="loadModel()">Load</button>
            <button id="saveModel" onclick="saveModel()">Save</button>
        </div>
        <textarea id="mySavedModel" style="width: 100%; height: 300px"> 
            { "class": "go.GraphLinksModel",
            "linkFromPortIdProperty": "fromPort",
            "linkToPortIdProperty": "toPort",
            "modelData": {"position":"230 200"},
            "nodeDataArray": [
            {"category":"activity", "item":"generic task", "key":5, "loc":"1010 540", "text":"A",
            "taskType":0, "boundaryEventArray":[ ]},
            {"category":"activity", "item":"generic task", "key":-4, "loc":"860 540", "text":"B",
            "taskType":0, "boundaryEventArray":[ ]},
            {"category":"activity", "item":"generic task", "key":-5, "loc":"710 540", "text":"C",
            "taskType":0, "boundaryEventArray":[ ]},
            {"category":"activity", "item":"generic task", "key":-6, "loc":"560 540", "text":"D",
            "taskType":0, "boundaryEventArray":[ ]}
            ],
            "linkDataArray": [
            {"from":-6, "to":-5, "fromPort":"", "toPort":""},
            {"from":-5, "to":-4, "fromPort":"", "toPort":""},
            {"from":-4, "to":5, "fromPort":"", "toPort":""}
            ]}
        </textarea>
    </div>

</div>


<div style="top: 0px; z-index: 300; position: fixed; display: none; text-align: center; left: 25%; width: 50%; padding:16px; border: 16px solid rgb(68, 68, 68); border-radius: 10px; margin-top: 10px; background-color: rgb(245, 245, 245);"></div>
<div style="z-index: 299; position: fixed; display: none; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0.8; background-color: black;"></div>

</body>
</html>