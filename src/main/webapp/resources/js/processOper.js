function displayProcess(processId,operationType){
	$("#processId").val(processId);
	$("#processOperate").val(operationType);
	$("#getProcessInfo").submit();
}
 
function cancelAddOrUpdateProcess(){
	var bashPath= $("#bashPathValue").val();
	window.location.href=bashPath+"web/processController/mainPage?processOperate=LIST";
}

function updateProcess(){
	$("#updateProcessForm").submit();
}
  

function addProcess(){
	 $( "#process_list_div" ).css( "display","none" );
	 $( "#process_update_div" ).css( "display","none" );	
	 $( "#process_display_div" ).css( "display","none" );	
	 $( "#process_add_div" ).css( "display","" );	
}

function checkProcessEnterVal(){
	if($("#processName").val()=='' || $("#processName").val()==null){
		return false;
	}
	if($("#enterProcessNo").val()=='' || $("#enterProcessNo").val()==null){
		return false;
	}
	return true;
}
function createProcessFun(){
	if(!checkProcessEnterVal()){
		$("#required-msg-div").css("display","");
		return false;
	}
	
	if($("#processNoAvailable").val()=="N"){
		processNumberCheck();
		if($("#processNoAvailable").val()=="N"){
			return false;
		}
	}
	$("#required-msg-div").css("display","none");
	var bashPath = $("#bashPathAdd").val();
	$.ajax({
		url:bashPath+'/web/processController/addProcess',
		data:{
			processNo: $("#enterProcessNo").val(),
			processName:$("#processName").val(),
			processType:$("#processType").val(),
			description:$("#description").val()
		},
		type:'post',
		cache:false,
		dataType:'',
		async:false,
		success:function(data){
			if(data!=null || data!=-1){
				 if(confirm("Do you want to draw the process now?")){
					 window.open(bashPath+"web/processController/editMode?processId="+data);
				 }
				 window.location.href=bashPath+"web/processController/mainPage?processOperate=LIST";
			}else{
				$("#required-msg-div").css("color","red");
				$("#required-msg-div").text("The process Id has already existed, please enter another one!");
				$("#processId").focus();
			}
		},
		error:function(){
			$("#required-msg-div").css("color","red");
			$("#required-msg-div").text("The network is error,please check the server!");
		}
	});
}

function cancelCreateUserBtn(){
	$("#goToMainpageForm").submit();
}
function gotoEditMode(processId){
	var bashPath= $("#bashPathValue").val();
	 window.open(bashPath+"web/processController/editMode?processId="+processId);
}
function searchProcessLink(){
	$("#searchProcessForm").submit();
}
function processNumberCheck(operType){
	var basePath = $("#bashPathAdd").val();
	if("C"==operType){
		var processNo=$("#enterProcessNo").val();
	}else if("U"==operType){
		var processNo =$("#updateProcessNo").val();
	}
	if(processNo=="" || typeof(processNo)=="undefined"){
		if("C"==operType){
			$("#checkprocssNoErrorMsg").css("color","red");
			$("#checkprocssNoErrorMsg").text("The processNo can not be empty!");
		}else{
			$("#checkprocssNoUpdateErrorMsg").css("color","red");
			$("#checkprocssNoUpdateErrorMsg").text("The processNo can not be empty!");
		}
	}else{
		$.ajax({
			url:basePath+'/web/processController/obtainProByNo',
			data:{
				processNo:processNo
			},
			type:'get',
			cache:false,
			dataType:'',
			async:false,
			success:function(data){
				if(data=='NO'){
					if("C"==operType){
						$("#checkprocssNoErrorMsg").text("The process number is available!");
						$("#checkprocssNoErrorMsg").css("color","green");
					}else{
						$("#checkprocssNoUpdateErrorMsg").text("The process number is available!");
						$("#checkprocssNoUpdateErrorMsg").css("color","green");
					}
					$("#processName").focus();
					$("#processNoAvailable").val("Y");
				}else if(data=='YES'){
					if("C"==operType){
						$("#checkprocssNoErrorMsg").css("color","red");
						$("#checkprocssNoErrorMsg").text("The process number has already existed!");
					}else{
						$("#checkprocssNoUpdateErrorMsg").css("color","red");
						$("#checkprocssNoUpdateErrorMsg").text("The process number has already existed!");
					}
				}else if(data=='EMPTY'){
					if("C"==operType){
						$("#checkprocssNoErrorMsg").css("color","red");
						$("#checkprocssNoErrorMsg").text("The process number can not be empty!");
					}else{
						$("#checkprocssNoUpdateErrorMsg").css("color","red");
						$("#checkprocssNoUpdateErrorMsg").text("The process number can not be empty!");
					}
				}
			},
			error:function(){
				$("#checkprocssNoErrorMsg").css("color","red");
				$("#checkprocssNoErrorMsg").text("The network is error,please check the server!");
				$("#processNo").select();
			}
		});
	}
}

function obtainTTSAudioPath(basePath){
	$.ajax({
		url:basePath+'/web/processController/obtainAudioPath',
		data:{
			processId:"001",shapeId:"22",content:"Danny",audioPath:"",pathVersion:1
		},
		type:'post',
		cache:false,
		dataType:'text',
		async:false,
		success:function(data){
			if(data=='EMPTY'){
				alert("can't get the audio");
			}else{
				alert("The audio path is:"+data);
			}
		},
		error:function(){
			alert("error");
		}
});
}


function proxyProcessInfo(){
	$.ajax({
		url:'http://localhost:8080/blstEngine/services/processService/proxy',
		data:{
			processId:"002",content:"226",version:"Hello",userId:"10002"
		},
		type:'post',
		cache:false,
		dataType:'json',
		async:false,
		success:function(data){
			if(data=='EMPTY'){
				alert("can't get the audio");
			}else{
				alert("The audio path is:"+data);
			}
		},
		error:function(){
			alert("error");
		}
});
}