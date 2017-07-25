function hideba(){
	setTimeout("hidediv()",5000);
}			
			
function hidediv(){
	$(".hiddenit").fadeOut(2000);
}
			
function openit(){
	$(".hiddenit").fadeIn(1000);
	hideba();
}

function gotoCustMainPage(){
	$("#gotoCustMainPageForm").submit();
}