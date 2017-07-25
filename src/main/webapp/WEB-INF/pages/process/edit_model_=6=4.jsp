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
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Bosch Language Service Process Management</title>
    <script type="text/javascript" src="<%=basePath %>resources/js/jquery-2.1.3.js"></script>
    <script type="text/javascript" src="<%=basePath %>resources/js/canvas-toBlob.js"></script>
    <script type="text/javascript" src="<%=basePath %>resources/js/FileSaver.js"></script>
    <script src="<%=basePath %>resources/js/main-debug-symbol.js"></script>
    <link href="<%=basePath %>resources/css/style.css" rel="stylesheet" type="text/css">
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
<div class="main">
    <div id="currentFile" style="display:none;">Bosch Language Service Process Management (old design, it will
        change.)
    </div>
    <div class="toolbar">
        <button class="new" onclick="newDocument()">New</button>
        <button class="open" onclick="openDocument()">Open</button>
        <button class="save" onclick="saveModel()">Save</button>
        <button class="save-to-local" onclick="saveToLocal()">Save to local</button>
        <button class="run-model" onclick="saveDocumentAs()">Run model</button>
        <button class="send-to-mail" onclick="saveDocumentAs()">Send to mail</button>
        <button class="syntax-check" onclick="saveDocumentAs()">Syntax check</button>
        <div class="logo animated bounceInLeft">
            Bosch Language Service Tool
        </div>
    </div>

    <div id="PaletteAndDiagram">
        <div id="sideBar">
            <div class="handle">Base Shape:</div>
            <div id="myPalette" class="my-palette">
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
        <button id="cancelBtn" class="elementBtn" type="button" onclick="closeElement( & #39; openDocument & #39; )">
            Cancel
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
        <button id="cancelBtn2" class="elementBtn" type="button" onclick="closeElement( & #39; removeDocument & #39; )">
            Cancel
        </button>
    </div>
    <div id="editPanel" class="edit-panel">
        <strong>Edit Property</strong>
        <div id="inputWraper" class="input-wraper">
        <input name="key" type="hidden"/>
        <label>Text:</label>
        <input name="text" type="text"/>
        <label>Category:</label>
        <input name="category" type="text"/>
        <label>Item:</label>
        <input name="item" type="text"/>
        <label>Location:</label>
        <input name="loc" type="text"/>
        </div>
        <div class="button-wraper">
            <button onclick="changeNodeProperty()">Submit</button>
            <button onclick="loadModel()">Reload</button>
        </div>
    </div>
    <div style="visibility: hidden;">
        <div class="handle">JSON:</div>
        <div id="buttons">
            <button id="loadModel" onclick="loadModel()">Load</button>
            <button id="saveModel" onclick="saveModel()">Save</button>
        </div>
                <textarea id="mySavedModel" style="width: 100%; height: 300px"> 
            { "class": "yy.GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "modelData": {"position":"230 200"},
  "nodeDataArray": [ 
{"category":"activity", "item":"generic task", "key":5, "loc":"860 820", "text":"C", "taskType":0, "boundaryEventArray":[  ],"properties":{
"propertyA1":{"type":"text","content":"text1","writeable":"true"},
"propertyA2":{"type":"text","content":"text2","writeable":"true"},
"propertyA2":{"type":"text","content":"text3","writeable":"true"},
"propertyA3":{"type":"text","content":"text4","writeable":"true"}
}},
{"category":"activity", "item":"generic task", "key":-4, "loc":"860 660", "text":"B2", "taskType":0, "boundaryEventArray":[  ]},
{"category":"activity", "item":"generic task", "key":-5, "loc":"710 570", "text":"A", "taskType":0, "boundaryEventArray":[  ]},
{"category":"activity", "item":"generic task", "key":-6, "loc":"560 730", "text":"B1", "taskType":0, "boundaryEventArray":[  ]},
{"category":"event", "item":"start", "key":101, "loc":"706.421875 275", "text":"Start", "eventType":1, "eventDimension":1},
{"category":"event", "item":"End", "key":104, "loc":"559.421875 860", "text":"End", "eventType":1, "eventDimension":8},
{"category":"subprocess", "key":801, "loc":"372.541163125423 409.743211874577", "text":"Subprocess", "isGroup":true, "taskType":0, "isSubProcess":true, "boundaryEventArray":[  ]},
{"category":"event", "item":"start", "key":-8, "loc":"480.421875 285", "text":"Start", "eventType":1, "eventDimension":1, "group":801},
{"category":"event", "item":"End", "key":-9, "loc":"508.421875 449.9999999999999", "text":"End", "eventType":1, "eventDimension":8, "group":801},
{"category":"subprocess", "key":-10, "loc":"358.359375 437.4749999999999", "text":"Subprocess", "isGroup":true, "taskType":0, "isSubProcess":true, "boundaryEventArray":[  ], "group":801},
{"category":"event", "item":"start", "key":-11, "loc":"248.421875 343.9999999999999", "text":"Start", "eventType":1, "eventDimension":1, "group":-10},
{"category":"event", "item":"End", "key":-12, "loc":"279.421875 510.9999999999999", "text":"End", "eventType":1, "eventDimension":8, "group":-10},
{"category":"gateway", "key":201, "loc":"413.421875 357", "text":"Gateway", "gatewayType":0, "group":801}
 ],
  "linkDataArray": [ 
{"from":-5, "to":-4, "fromPort":"", "toPort":"", "points":[770,570,780,570,860,570,860,585,860,600,860,620]},
{"from":-4, "to":5, "fromPort":"", "toPort":"", "points":[860,700,860,710,860,735,860,735,860,760,860,780]},
{"from":101, "to":801, "fromPort":"", "toPort":"", "points":[684.921875,275,674.921875,275,619.802586874577,275,619.802586874577,410.518211874577,564.6832987491539,410.518211874577,544.6832987491539,410.518211874577]},
{"from":801, "to":-6, "fromPort":"", "toPort":"", "points":[372.54116312542294,610.9728474983078,372.54116312542294,620.9728474983078,372.54116312542294,645.4864237491539,540,645.4864237491539,540,670,540,690]},
{"from":-11, "to":-12, "fromPort":"", "toPort":"", "points":[453.546875,428.38071187457695,473.546875,428.38071187457695,473.546875,498.38071187457695,433.546875,498.38071187457695,393.546875,498.38071187457695,393.546875,468.38071187457695]},
{"from":-8, "to":201, "fromPort":"", "toPort":"", "points":[480.421875,306.4999999999999,480.421875,316.4999999999999,480.421875,324,480.421875,324,480.421875,332,508,332,508,252,413.421875,252,413.421875,296.4999999999999,413.421875,316.4999999999999]},
{"from":201, "to":-9, "fromPort":"", "toPort":"", "visible":true, "points":[453.921875,370.4999999999999,463.921875,370.4999999999999,464.671875,370.4999999999999,464.671875,449.9999999999999,465.421875,449.9999999999999,485.421875,449.9999999999999]},
{"from":101, "to":-5, "fromPort":"", "toPort":"", "points":[706.421875,296.5,706.421875,306.5,710,306.5,710,306.5,710,510,710,530]},
{"from":-5, "to":-6, "fromPort":"", "toPort":"", "points":[710,610,710,620,710,645,580,645,580,670,580,690]},
{"from":-6, "to":104, "fromPort":"", "toPort":"", "points":[560,770,560,780,560,798.5,559.421875,798.5,559.421875,817,559.421875,837]},
{"from":5, "to":104, "fromPort":"", "toPort":"", "points":[800,820,790,820,696.2109375,820,696.2109375,860,602.421875,860,582.421875,860]}
 ]}
                </textarea>
    </div>

</div>


<div style="top: 0px; z-index: 300; position: fixed; display: none; text-align: center; left: 25%; width: 50%; padding:16px; border: 16px solid rgb(68, 68, 68); border-radius: 10px; margin-top: 10px; background-color: rgb(245, 245, 245);"></div>
<div style="z-index: 299; position: fixed; display: none; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0.8; background-color: black;"></div>
</body>
</html>