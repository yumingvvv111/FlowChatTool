alert(9999);

window.__m8 = '';
window.__m6 = '';
window.__superDebugger = 3;
window.__monitorEvent = false;
//window.__printKey = false;
window.__begin = !0;
window.__evals = {all:''};
window.__E=false;
window.__YY__ = {fns: {}, S: function (k, arguments) {
  var matchs = /([a-zA-Z]+)([0-9]+)/.exec(k);
  var C__A__R = arguments.callee.caller && arguments.callee.caller !== null && arguments.callee.caller
    , C__A__L = arguments.callee
    , R_N = C__A__R ? C__A__R._$name : 'globalContext'
    , L_N;
  //function printKey(callee){
  //var key = callee.__G();
  //  console.log(key + '::' + callee._$name + ';');
  //}
//  (C__A__L._$name || (C__A__L['_$name'] = k)) && (window.__YY__.fns.k || (window.__YY__.fns.k = C__A__L.toString()));
  window.__YY__.fns[k] = C__A__L.toString();
  L_N = C__A__L._$name=k;
  //window.__printKey && printKey(C__A__L);
  if (((window.__monitorEvent && typeof arguments[0] === 'object' && arguments[0] !== null && arguments[0].preventDefault) || window.__m8.indexOf('A') !== -1 || window.__m8.indexOf(matchs[1] + '*,') !== -1 || window.__m8.indexOf(k + ',') !== -1) && (window.__m6.indexOf(matchs[1] + '*,') === -1 && window.__m6.indexOf(k + ',') === -1)) {
    switch (window.__superDebugger) {
      case 0:
        console.log(R_N + ':::' + L_N + ';');
        break;
      case 1:
        return true;
        break;
      case 2:
        console.log('\n ' + R_N + ':::\n' + L_N, '(' + C__A__L.name + ')', C__A__L, Array.prototype.slice.call(arguments));
        break;
      case 3:
        void(0);
        break;
      case 4:
        console.log('%c'+L_N,'color:red');
        console.trace();
        break;
    }
  }
  return !1;
},gE: function(key){
  return (__evals[key] || '') + ';'+__evals.all;
}};


var interval = 0, stop = false;
var process = '<div id="process_div"  class="crm_MTxet_chuli Mcrm_quan">已处理<span id="process" style="color:red">0</span>条</div>';
var accountImportNotice = '<p>1、模板中的表头不可更改，不可删除；</p><p>2、其中客户名称为必填项，其他均为选填项；</p>' +
  '<p>3、填写客户地址时，特别行政区名称需填写在模板中的省份字段下，由省/自治区直辖的县级行政区划，需将其名称直接填写在模板中的市字段下。</p>';
var contactImportNotice = '<p>1、模板中的表头不可更改，不可删除；</p><p>2、其中联系人姓名与所属客户为必填项，其他均为选填项。</p>';
var goalImportNotice = '<p>1、模板中的表头不可更改，不可删除；</p><p>2、项目顺序可以调整，不需要的项目可以删减；</p>' +
'<p>3、其中部门/用户，各个目标值为必填项，必须保留；</p><p>4、此次只对部门、考核目标、姓名重复时，做不导入或者覆盖导入的限制。</p>';
var cur_year = new Date().getFullYear();
var goalSelectYear = '<select id="goal_selectYear" style="margin-left: 15px;display: none">' + '<option value="' + 

(cur_year - 1) + '">' + (cur_year - 1) +
  '财年</option><option selected="selected" value="' + cur_year + '">' + cur_year + '财年</option> <option value="' +

(cur_year + 1) + '">' +
  (cur_year + 1) + '财年</option></select>';
var templateUrl = '/common/scrmImport/getTemplate/objName/';

function handleMessage(message, pClose){
//a1<
  if (__begin&&__YY__.S("a1", arguments)) {debugger;}
  $('#start_import').html('开始导入');
  stop = true;
  messageFrame('导入错误！', '<p class="boxImport_cg">' + message + '</p>', pClose);
  var overlay = document.getElementById('import_overlay');
  overlay.style.display='none';
  }
function handleResult(success, failed){
//a2<
  if (__begin&&__YY__.S("a2", arguments)) {debugger;}
  stop = true;
  var failLink = '，点击下载 <span><a href="/common/scrmImport/getFailed/objName/' + ck_admin.objname + '" id="fail_link" target="_blank" title="' + ck_admin.objlabel + '导入失败报告">' + ck_admin.objlabel + '导入失败报告.CSV</a></span>';
  var message = '<p class="boxImport_cg">导入成功<span>' + success + '</span>条</p>';
  $('#start_import').html('开始导入');
  if (failed == 0) {
  message += '<p class="boxImport_sbai">导入失败' + failed + '条</p>';
  messageFrame('导入完成！', message, true);
  } else {
  message += '<p class="boxImport_sbai">导入失败' + failed + '条' + failLink + '</p>';
  messageFrame('导入完成！', message, true);
  var overlay = document.getElementById('import_overlay');
  overlay.style.display='none';
  }

  $('#import_overlay').hide();
  $('#admin_account_tab').trigger('click');
  }
function messageFrame(head, message, pClose) {
//a3<
  if (__begin&&__YY__.S("a3", arguments)) {debugger;}
  $('#message_head').text(head);
  $('#message_body').empty().html(message);
  $('#import_message').dialog({
  width:450,
  height:'auto',
  resizable:false,
  modal:true,
  title: ck_admin.objlabel + '导入',
  close: function() {
//a4<
  if (__begin&&__YY__.S("a4", arguments)) {debugger;}
  if (pClose) {
  $('#import').dialog('close');
  }
  },
  'dialogClass':'scrm_list_profile_msg'
  });
  }

$(function(){
//a5<
  if (__begin&&__YY__.S("a5", arguments)) {debugger;}
  // 点击导入按钮
  $('.import_button').bind('click',function(){
//a6<
  if (__begin&&__YY__.S("a6", arguments)) {debugger;}
  $('#real_file').attr('value', '');
  $('#selected_file').attr('value', '');
  $('#import_overlay').hide();
  $('#goalimport_replace').hide();

  var templateHref = templateUrl + ck_admin.objname;
  $('#goal_selectYear').remove();
  $('#tmplate_link').after(goalSelectYear);

  if (ck_admin.objname == 'Account') {
  var notice = accountImportNotice;
  } else if (ck_admin.objname == 'Contact') {
  var notice = contactImportNotice;
  } else if (ck_admin.objname == 'Goal') {
  var notice = goalImportNotice;
  templateHref = templateHref + '/year/' + cur_year;
  $('#goal_selectYear').show();
  $('#goalimport_replace').show();
  } else {
  return false;
  }
  $('#import_notice').html(notice);
  $('#tmplate_link').attr('href', templateHref);
  $('#tmplate_link').text('下载【' + ck_admin.objlabel + '导入模板】');
  $('#import_file').attr('action', '/common/scrmImport/import/objName/' + ck_admin.objname);

  $('#import').dialog({
  width:450,
  height:'auto',
  resizable:false,
  modal:true,
  close: function(){
//a7<
  if (__begin&&__YY__.S("a7", arguments)) {debugger;}
  stop = true;
  clearInterval(interval);
  $(".Mzysx01").hide();
  $(".Mchakan01 .Myinc01").show();
  $(".MHao").hide();
  },
  title: ck_admin.objlabel + '导入',
  'dialogClass':'scrm_list_profile_edit'
  });
  $('#import').css('width','450px');
  $('.scrm_list_profile_edit').css('top','20%');
  });

  $('#select_file').bind('click', function(){
//a8<
  if (__begin&&__YY__.S("a8", arguments)) {debugger;}
  $('#real_file').trigger('click');
  });

  $('#message_close').bind('click', function(){
//a9<
  if (__begin&&__YY__.S("a9", arguments)) {debugger;}
  $('#import_message').dialog('close');
  });

  $('#import').on('change', '#goal_selectYear', function(){
//a10<
  if (__begin&&__YY__.S("a10", arguments)) {debugger;}
  var year = $(this).children('option:selected').val();
  var templateHref = templateUrl + ck_admin.objname + '/year/' + year;
  $('#tmplate_link').attr('href', templateHref);
  })

  // 文件上传按钮
  if($.browser.msid){
  $('#real_file').bind('propertychange input',function(){
//a11<
  if (__begin&&__YY__.S("a11", arguments)) {debugger;}
  var filename = $(this).val();
  if(-1 != filename.lastIndexOf('\\')){
  var index = filename.lastIndexOf('\\');
  filename = filename.substr(index+1);
  }
  var i = filename.lastIndexOf('.');
  var ext = filename.substr(i+1);
  if (!!ext && ext != 'csv') {
  handleMessage('只支持csv格式', false);
  return false;
  }
  $('#selected_file').attr('value', filename);
  });
  }else{
  $('#real_file').bind('change',function(){
//a12<
  if (__begin&&__YY__.S("a12", arguments)) {debugger;}
  var filename = $(this).val();
  if(-1 != filename.lastIndexOf('\\')){
  var index = filename.lastIndexOf('\\');
  filename = filename.substr(index+1);
  }else if(-1 != $(this).val().lastIndexOf('/')){
  var index = $(this).val().lastIndexOf('/');
  filename = filename.substr(index+1);
  }

  var i = filename.lastIndexOf('.');
  var ext = filename.substr(i+1);
  if (!!ext && ext != 'csv') {
  handleMessage('只支持csv格式', false);
  return false;
  }
  $('#selected_file').attr('value', filename);
  });
  }

  // 开始导入
  $('#start_import').bind('click',function(){
//a13<
  if (__begin&&__YY__.S("a13", arguments)) {debugger;}
  var filename = $('#selected_file').attr('value');
  if (''==filename) {
  handleMessage('请选择上传文件', false);
  return false;
  }
  var i = filename.lastIndexOf('.');
  var ext = filename.substr(i+1);
  if (!!ext && ext != 'csv') {
  handleMessage('只支持csv格式', false);
  }

  $(this).html(process);
  $('#import_overlay').show();
  $('#import_file').submit();
  stop = false;
  interval = setInterval(function(){
//a14<
  if (__begin&&__YY__.S("a14", arguments)) {debugger;}
  if(stop) clearInterval(interval);
  $.ajax({
  url: "/common/scrmImport/getProcess/objName/"+ck_admin.objname,
  async:false,
  type: "POST",
  dataType: 'json',
  success:function(data){
//a15<
  if (__begin&&__YY__.S("a15", arguments)) {debugger;}
  var count = data['count'];
  $('#process').text(count);
  }
  });

  }
  ,500
  );

  return false;
  });

  })
