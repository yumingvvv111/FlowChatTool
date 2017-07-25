$(function(){
	var msgFlag=$("#DISPLAYMSGCONTENT").val();
	if(!(msgFlag=="" || (typeof(msgFlag)=="undefined"))){
		$("#commonMsg").html(msgFlag);
		openit();
	}
});
function loginBtn(){
	checkLoginId();
	 checkPwd();
	var isLoginIdAvailable = $("#LoginIdAvailable").val()=="N";
    var isPasswordAvailable = $("#passwordAvailable").val()=="N";
    if(isLoginIdAvailable || isPasswordAvailable){
      event.stopPropagation();
      event.preventDefault();
      return false;
    }else{
    	$("#loginForm").submit();
    }
}



function checkLoginId(){
	var basePath = $("#loginBashPath").val();
	var loginId=$("#LoginId").val();
	if(!emailAddrCheck(loginId)){
		$("#checkLoginIdErrorMsg").css("color","red");
		$("#checkLoginIdErrorMsg").text("The content of the input must be the mail format!");
		return false;
	}
	$.ajax({
		url:basePath+'/web/customerController/checkLoginIdUsed',
		data:{
			loginId:loginId
		},
		type:'get',
		cache:false,
		dataType:'',
		async:false,
		success:function(data){
			if(data=='YES'){
				$("#checkLoginIdErrorMsg").text("The loginId is available!");
				$("#checkLoginIdErrorMsg").css("color","green");
				$("#loginPwd").focus();
				$("#LoginIdAvailable").val("Y");
			}else if(data=='NO'){
				$("#checkLoginIdErrorMsg").css("color","red");
				$("#checkLoginIdErrorMsg").text("The loginId does not available!");
			}else if(data=='EMPTY'){
				$("#checkLoginIdErrorMsg").css("color","red");
				$("#checkLoginIdErrorMsg").text("The loginId can not be empty!");
				//$("#registerLoginId").focus();
			}
		},
		error:function(){
			$("#checkLoginIdErrorMsg").css("color","red");
			$("#checkLoginIdErrorMsg").text("The network is error,please check the server!");
			$("#LoginId").select();
		}
	});
}


function checkPwd(){
	var enterPwd=$("#loginPwd").val();
	if($("#loginPwd").val().length<=0){
		$("#checkPwdErrorMsg").css("color","red");
		$("#checkPwdErrorMsg").text("The password can not be empty!");
		//$("#registerPwd").focus();
	}else if($("#loginPwd").val().length<8||$("#loginPwd").val().length>16){
		$("#checkPwdErrorMsg").css("color","red");
		$("#checkPwdErrorMsg").text("The length of password must between 8 and 16!");
		//$("#registerPwd").select();
	}else{
		$("#passwordAvailable").val("Y");
		$("#checkPwdErrorMsg").css("color","green");
		$("#checkPwdErrorMsg").text("OK!");
		$("#loginPwd").focus();
	}
}

function emailAddrCheck(emailAddr){
	if(emailAddr=="" || (typeof(emailAddr)=="undefined")){
		return false;
	}
	var Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/; 
	if (Regex.test(emailAddr)){
		return true;
	}
	return false;
}


function displayCustomer(custId){
	$("#disCustId").val(custId);
	$("#showPart").val("Display");
	$("#displayUserForm").submit();
}
function displayEditCustomer(custId){
	$("#disCustId").val(custId);
	$("#showPart").val("Edit");
	$("#displayUserForm").submit();
}

function updateCustomerBtn(){
	$("#updateCustomerForm").submit();
}

function validateUpdateElement(loginId){
	$.ajax({
		url:'<%=basePath%>web/customerController/checkLoginIdUsed',
		data:{
			loginId:loginId
		},
		type:'post',
		cache:false,
		dataType:'',
		success:function(data){
			if(data=='SUCCESS'){
				
			}
		},
		error:function(){
			
		}
	});
	
}

function fillInData(custId){
	var _custLoginId = custId+"_loginId";
	var _custName=custId+"_custName";
	var _custEmail=custId+"_custEmail";
	var _gender=custId+"_gender";
	var _type=custId+"_type";
	var _state=custId+"_state";
	var _registerTime=custId+"_registerTime";
	$("#updateloginId").val($("#"+_custLoginId).val());
	$("#updateCustId").val(custId);
	
	$("#emailAddress").val($("#"+_custEmail).val());
	$("#updateCustName").val($("#"+_custName).val());
	var genderVal= $("#"+_gender).val();
	if(genderVal==1){
		$("#updateGenderM").attr("checked",true);
	}else if(genderVal==2){
		$("#updateGenderFemale").attr("checked",true);
	}else{
		$("#updateGenderOther").attr("checked",true);
	}
	var custTypeVal= $("#"+_type).val();
	if(custTypeVal==2){
		$("#updateCustTypeA").attr("checked",true);
	}else if(custTypeVal==1){
		$("#updateCustTypeD").attr("checked",true);
	}
	$("#updateState").val($("#"+_state).val());
	
}


function fillInDisplayData(custId){
	var _custLoginId = custId+"_loginId";
	var _custName=custId+"_custName";
	var _custEmail=custId+"_custEmail";
	var _gender=custId+"_gender";
	var _type=custId+"_type";
	var _state=custId+"_state";
	var _registerTime=custId+"_registerTime";
	
	$("#displayloginId").val($("#"+_custLoginId).val());
	$("#displayEmailAddress").val($("#"+_custEmail).val());
	$("#displayCustName").val($("#"+_custName).val());
	$("#displayRegisterName").val($("#"+_registerTime).val());
	var custTypeVal= $("#"+_type).val();
	if(custTypeVal==2){
		$("#displayCustType").val("Adminstration");
	}else{
		$("#displayCustType").val("Developer");
	}
	var genderVal= $("#"+_gender).val();
	if(genderVal==0){
		$("#displayGender").val("Confidential");
	}else if(genderVal==1){
		$("#displayGender").val("Male");
	}else{
		$("#displayGender").val("Female");
	}
	var stateVal=$("#"+_state).val();
	if(stateVal==0){
		$("#displayState").val("Register"); 
	}else if(stateVal==1){
		$("#displayState").val("Authenticated"); 
	}else{
		$("#displayState").val("Freeze");
	}
	
	
}

 
function addCustomer(){
	 $( "#list_users_div" ).css( "display","none" );
	 $( "#add_user_div" ).css( "display","" );	
	 $( "#update_user_div" ).css( "display","none" );	
	 $( "#display_users_div" ).css( "display","none" );	
	 $( "#modify_password_div" ).css( "display","none" );
}

function cancelCreateUserBtn(){
	$("#goToMainpageForm").submit();
}
function userSearch(){
	$("#userSearchForm").submit();
}

function updateEmailAddrCheck(){
	var emailAddr = $( "#emailAddress").val();
	if(emailAddrCheck(emailAddr)){
		$("#checkEmailAddrErrorMsg").text("OK!");
		$("#checkEmailAddrErrorMsg").css("color","green");
	}else{
		$("#checkEmailAddrErrorMsg").text("The content of the input must be the mail format!");
		$("#checkEmailAddrErrorMsg").css("color","red");
	}
	
}