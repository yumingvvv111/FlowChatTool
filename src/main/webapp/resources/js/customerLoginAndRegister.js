
function checkRegLoginId(){
	var basePath = $("#registerBasepath").val();
	var loginId=$("#registerLoginId").val();
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
		success:function(data){
			if(data=='YES'){
				$("#checkLoginIdErrorMsg").css("color","red");
				$("#checkLoginIdErrorMsg").text("The loginId is already exist!");
				//$("#registerLoginId").select();
			}else if(data=='NO'){
				$("#checkLoginIdErrorMsg").text("The loginId is available!");
				$("#checkLoginIdErrorMsg").css("color","green");
				$("#registerPwd").focus();
				$("#LoginIdAvailable").val("Y");
			}else if(data=='EMPTY'){
				$("#checkLoginIdErrorMsg").css("color","red");
				$("#checkLoginIdErrorMsg").text("The loginId can not be empty!");
				//$("#registerLoginId").focus();
			}
		},
		error:function(){
			$("#checkLoginIdErrorMsg").css("color","red");
			$("#checkLoginIdErrorMsg").text("The network is error,please check the server!");
			$("#registerLoginId").select();
		}
	});
}

function emailAddrCheck(checkId){
	var Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/; 
	if (Regex.test(checkId)){
		return true;
	}
	return false;
}
function checkRegPwd(){
	var enterPwd=$("#registerPwd").val();
	if($("#registerPwd").val().length<=0){
		$("#checkPwdErrorMsg").css("color","red");
		$("#checkPwdErrorMsg").text("The password can not be empty!");
		//$("#registerPwd").focus();
	}else if($("#registerPwd").val().length<8||$("#registerPwd").val().length>16){
		$("#checkPwdErrorMsg").css("color","red");
		$("#checkPwdErrorMsg").text("The length of password must between 8 and 16!");
		//$("#registerPwd").select();
	}else{
		$("#passwordAvailable").val("Y");
		$("#checkPwdErrorMsg").css("color","green");
		$("#checkPwdErrorMsg").text("OK!");
		$("#registerRePwd").focus();
	}
}
function checkRegRePwd(){
	var enterRePwd=$("#registerRePwd").val();
	if($("#registerRePwd").val().length<=0){
		$("#checkRePwdErrorMsg").css("color","red");
		$("#checkRePwdErrorMsg").text("The password can not be empty!");
		//$("#registerRePwd").focus();
	}else if($("#registerRePwd").val()!=$("#registerPwd").val()){
		$("#checkRePwdErrorMsg").css("color","red");
		$("#checkRePwdErrorMsg").text("The password must be the same at the top of the password!");
		//$("#registerRePwd").select();
	}else if($("#registerRePwd").val().length<8||$("#registerRePwd").val().length>16){
		$("#checkRePwdErrorMsg").css("color","red");
		$("#checkRePwdErrorMsg").text("The length of password must between 8 and 16!");
		//$("#registerRePwd").select();
	}else{
		$("#rePasswordAvailable").val("Y");
		$("#checkRePwdErrorMsg").css("color","green");
		$("#checkRePwdErrorMsg").text("OK!");
		$("#RegisterBtn").focus();
	}
}

function registerCust(event){
    var isLoginIdAvailable = $("#LoginIdAvailable").val()=="N",
        isPasswordAvailable = $("#passwordAvailable").val()=="N",
        isRePasswordAvailable = $("#rePasswordAvailable").val()=="N";
	isLoginIdAvailable && checkRegLoginId();
	isPasswordAvailable && checkRegPwd();
	isRePasswordAvailable && checkRegRePwd();
        if(isLoginIdAvailable || isPasswordAvailable || isRePasswordAvailable){
          event.stopPropagation();
          event.preventDefault();
          return false;
        }else{
		$("#registerForm").submit();
	}
}

function resetReg(event){
	$("#registerLoginId").val('');
	$("#registerPwd").val('');
	$("#registerRePwd").val('');
	$("#checkLoginIdErrorMsg").text('');
	$("#checkPwdErrorMsg").text('');
	$("#checkRePwdErrorMsg").text('');
	$("#registerLoginId").focus();
	return false;
}

function createCustomerBtn(){
	  var isLoginIdAvailable = $("#LoginIdAvailable").val()=="N",
      isPasswordAvailable = $("#passwordAvailable").val()=="N",
      isRePasswordAvailable = $("#rePasswordAvailable").val()=="N";
	isLoginIdAvailable && checkRegLoginId();
	isPasswordAvailable && checkRegPwd();
	isRePasswordAvailable && checkRegRePwd();
      if(isLoginIdAvailable || isPasswordAvailable || isRePasswordAvailable){
        event.stopPropagation();
        event.preventDefault();
        return false;
      }else{
		$("#createCustomerForm").submit();
	}
}