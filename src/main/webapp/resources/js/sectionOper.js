$(function() {
    $( "#addProcess" ).dialog({
      autoOpen: false,
      modal: true,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
    
    $( "#createSectionBtn" ).click(function() {
    	if($("#sectionNoAvailable").val()=='N'){
    		checkSectionNumber();
    	}
    	if($("#sectionNoAvailable").val()=='Y'){
    		$("#createSectionForm").submit();
    	}else{
    		return false;
    	}
    });
});

function addSection(){
	 $("#addSectionPageForm").submit();
	 zoomCurSectionInfo();
}



function cancelAddOrUpdateSection(){
	 $( "#section_list_div" ).css( "display","" );
	 $( "#section_add_div" ).css( "display","none" );
	 $( "#section_update_div" ).css( "display","none" );
	 $( "#section_display_div" ).css( "display","none" );
}


function displaySection(sectionId,operationType){
	zoomCurSectionInfo();
	$("#sectionId").val(sectionId);
	$("#operationType").val(operationType);
	$("#getSectionForm").submit();
}

function showFormWindow(sectionId,operationType){
	var form = $("#getSectionForm");
	$("#sectionId").val(sectionId);
	$("#operationType").val(operationType);
	$.ajax({
        type: "GET",
        url:form.attr('action'),
        data:form.serialize(),// 你的formid
        error: function(request) {
            alert("Connection error");
        },
        success: function(data) {
        	setTimeout(function(){
        		$(data).each(function(i,e){
        			if(/main-wrapper/.test($(e).attr('id'))){
        				$(".modal-body").html($(e).find('#section_list_div').add($(e).find('#section_update_div')).add($(e).find('#section_display_div')));
        				}
        			})
        	},1000);
        }
    });
}

function updateSection(){
	$("#updateSectionForm").submit();
}

function linkTheProcess(){
	$( "#addProcess" ).dialog( "open" );
}

function sectionItemOper(basePath,sectionId,sectionType,preState,changeState,operType){
	$.ajax({
		url:basePath+'web/sectionController/sectionOper',
		data:{
			sectionId:sectionId,
			sectionType:sectionType,
			preState:preState,
			changeState:changeState,
			operType:operType
		},
		type:'post',
		cache:false,
		async:false,
		dataType:'',
		success:function(data){
			if(data=='S'){
				var curTd="#"+sectionId+"_pdStatus";
				var curLock="#"+sectionId+"_lockOper";
				var curUpdateLink="#"+sectionId+"_section_list_update";
				var url=basePath;
				url = url.replace(/&/g,"%26");
				url = url.replace(/#/g,"%23");
				var activeStatus="#"+sectionId+"_cur_pdStatus";
				var activeItemExist=false;
				if($(activeStatus).length>0){
					activeItemExist=true;
				}
				var curItemExist=false;
				if($(curTd).length>0){
					curItemExist=true;
				}
				var activeUpdateLink="#"+sectionId+"_cur_section_update";
				var activeLockLink="#"+sectionId+"_cur_lockOper";
				var lockLink ='<a  href="javascript:sectionItemOper(&quot;'+url+'&quot;,'+sectionId+',&quot;'+sectionType+'&quot;,'+changeState+',2,&quot;lock&quot;);"><i class=&quot;fa fa-pencil&quot;>lock</i></a>';
				var unLockLink ='<a  href="javascript:sectionItemOper(&quot;'+url+'&quot;,'+sectionId+',&quot;'+sectionType+'&quot;,'+changeState+',1,&quot;unlock&quot;);"><i class=&quot;fa fa-pencil&quot;>unlock</i></a>';
				var updateLock="javascript:updateBlockFunction();";
				var updateUnlock="javascript:displaySection("+sectionId+",'UPDATE');";
				switch(changeState){
				case 1:
					if(curItemExist){$(curTd).text("Normal");$(curLock).html(lockLink);$(curUpdateLink).attr('href',updateUnlock);}
					if(activeItemExist){$(activeStatus).text("Normal");$(activeLockLink).html(lockLink);$(activeUpdateLink).attr('href',updateUnlock);}
					break;
				case 2:
					if(curItemExist){$(curTd).text("BIND");$(curLock).html(unLockLink);$(curUpdateLink).attr('href',updateLock);}
					if(activeItemExist){$(activeStatus).text("BIND");$(activeLockLink).html(unLockLink);$(activeUpdateLink).attr('href',updateLock);}
					break;
				case 3:
					if(curItemExist){$(curTd).text("UNFINISHED");$(curLock).html(lockLink);$(curUpdateLink).attr('href',updateUnlock);}
					if(activeItemExist){$(activeStatus).text("UNFINISHED");$(activeLockLink).html(lockLink);$(activeUpdateLink).attr('href',updateUnlock);}
					break;
				case 4:
					if(curItemExist){$(curTd).text("FAIL");$(curLock).html(lockLink);$(curUpdateLink).attr('href',updateUnlock);}
					if(activeItemExist){$(activeStatus).text("FAIL");$(activeLockLink).html(lockLink);$(activeUpdateLink).attr('href',updateUnlock);}
					break;
				default:
					
				}
			}else if(data=='E'){
				//integrate the msg popup.
			}else if(data=='F'){
				
			}
		},
		error:function(){
			
		}
	});
}

function updateBlockFunction(){
	alert("This item has been locked!");
}
function activeSection(sectionId,sectionType,operType){
	$("#activeId").val(sectionId);
	$("#activeSectionType").val(sectionType);
	$("#activeOperType").val(operType);
	$("#actionOperForm").submit();
}

 
function moreCurSectionInfo(){
	$("#cur_active_body_div").css("display","");
	$("#active_title_detail").css("display","none");
}
function zoomCurSectionInfo(){
	$("#cur_active_body_div").css("display","none");
	$("#active_title_detail").css("display","");
}
function sectionSearchBtn(){
  $("#sectionSearchForm").submit();
}
function checkSectionNumber(operType){
	var basePath = $("#checkBashPath").val();
	if("C"==operType){
		var sectionNo=$("#sectionNumber").val();
	}else if("U"==operType){
		var sectionNo=$("#updateSectionNumber").val();
	}
	var sectionType = $("#sectionType").val();
	var intSectionType=0;
	if("DOM"==sectionType){
		intSectionType=1;
	}else{
		intSectionType=0;
	}
	if(sectionNo=="" || typeof(sectionNo)=="undefined"){
		if("C"==operType){
			$("#checkSectionNumberErrorMsg").css("color","red");
			$("#checkSectionNumberErrorMsg").text("The No. of section can not be empty!");
		}else if("U"==operType){
			$("#checkSectionNumberUpdateErrorMsg").css("color","red");
			$("#checkSectionNumberUpdateErrorMsg").text("The No. of section can not be empty!");
		}
	}else{
		$.ajax({
			url:basePath+'/web/sectionController/obtainSectionByNo',
			data:{
				sectionNo:sectionNo,
				sectionType:intSectionType
			},
			type:'get',
			cache:false,
			dataType:'',
			async:false,
			success:function(data){
				if(data=='NO'){
					if("C"==operType){
						$("#checkSectionNumberErrorMsg").text("The section number is available!");
						$("#checkSectionNumberErrorMsg").css("color","green");
					}else if("U"==operType){
						$("#checkSectionNumberUpdateErrorMsg").text("The section number is available!");
						$("#checkSectionNumberUpdateErrorMsg").css("color","green");
					}
					
					$("#sectionName").focus();
					$("#sectionNoAvailable").val("Y");
				}else if(data=='YES'){
					if("C"==operType){
						$("#checkSectionNumberErrorMsg").css("color","red");
						$("#checkSectionNumberErrorMsg").text("The section number has already existed!");
					}else if("U"==operType){
						$("#checkSectionNumberUpdateErrorMsg").css("color","red");
						$("#checkSectionNumberUpdateErrorMsg").text("The section number has already existed!");
					}
				}else if(data=='EMPTY'){
					if("C"==operType){
						$("#checkSectionNumberErrorMsg").css("color","red");
						$("#checkSectionNumberErrorMsg").text("The section number can not be empty!");
					}else if("U"==operType){
						$("#checkSectionNumberUpdateErrorMsg").css("color","red");
						$("#checkSectionNumberUpdateErrorMsg").text("The section number can not be empty!");
					}
				}
			},
			error:function(){
				if("C"==operType){
					$("#checkSectionNumberErrorMsg").css("color","red");
					$("#checkSectionNumberErrorMsg").text("The network is error,please check the server!");
				}else if("U"==operType){
					$("#checkSectionNumberUpdateErrorMsg").css("color","red");
					$("#checkSectionNumberUpdateErrorMsg").text("The network is error,please check the server!");
				}
				$("#sectionNo").select();
			}
		});
	}
}