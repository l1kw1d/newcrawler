var myLayout;var jsonrpc;var $tabs;var configInfor;var tasksNode;var appNode;var siteId;var webCrawlerId;var siteJsonData=new Array();var webCrawlerJsonData=new Array();var queueJsonDataMap=new Map();var siteJsonDataMap=new Map();var httpRequestMap=new Map();var customInterMap=new Map();var customPluginMap=new Map();var emailNoticeMap=new Map();var dataDeployMap=new Map();var webCrawlerUrlMap=new Map();var crawlQueueHasImplMap=new Map();var sessionMap=new Map();var loadConfig=false;var server_location;var isLocalSpider=false;var isReConfigBoxSize=false;function isLocal(){var a=window.location.host;if(a.indexOf("newcrawler.com")!=-1){return false}return true}var removeLoading=function(a){a.parents(".ui-tabs-panel").find(".ol_loading_mask").remove();a.parents(".ui-tabs-panel").find(".ol_loading").remove()};var showLoading=function(b,a){b.parents(".ui-tabs-panel").append('<div class="ol_loading_mask"></div><div class="ol_loading"></div>');if(a==null||a==undefined){a=0.4}b.parents(".ui-tabs-panel").find(".ol_loading_mask").css("opacity",a)};var html_loading='<div id="loading" class="loading-logo-wp-cot" style="display: block; overflow: hidden; visibility: visible;"><div class="loading-logo-wp"><span class="loading-s-bg"><img src="../../static/images/loading.gif" alt="loading" /></span><p>'+nc.i18n("res.loading")+"</p></div></div>";function login(){alert("Please Login.");window.location.href="../login.html"}$(document).mousedown(function(a){if(!($(a.target).hasClass("message-box")||$(a.target).hasClass("ui-widget-overlay")||$(a.target).parents(".message-box").length>0||$(a.target).parents(".ui-dialog").length>0)){message("hide")}});function loadInit(b,a){if(b!=null&&b!=undefined){a()}else{setTimeout(function(){loadInit(b,a)},500)}}$(document).ready(function(){$("#loading").remove();$("#optional-container").css("display","block");$.layout.config.panes.cssDemo.border="0";$.layout.config.panes.cssDemo={padding:"3px",border:"0",overflow:"auto"};$.layout.config.resizers.cssDemo={background:"rgba(221, 221, 221, 0)"};$.layout.config.togglers.cssDemo={background:"rgba(170, 170, 170, 0.1)",border:"0px"};myLayout=$("#optional-container").layout({applyDemoStyles:true,west:{size:235}});initTabs();JSONRpcClient.profile_async=true;JSONRpcClient.max_req_active=5;JSONRpcClient.requestId=1;jsonrpc=new JSONRpcClient("../../JSON-RPC/MEMBER");$("#tabsview").on("click","span.ui-icon-close",function(){var index=$("li",$tabs).index($(this).parent());$tabs.tabs("remove",index)});$(".header-footer").hover(function(){$(this).addClass("ui-state-hover")},function(){$(this).removeClass("ui-state-hover")});jsonrpc.configService.getConfigInfor(function(result,exception,profile){result="("+result+")";configInfor=eval(result);server_location=configInfor.location;if(server_location==null||server_location==undefined||server_location==""){server_location="www"}var eclass=$(".locationdiv").find("#loaction").attr("class");$(".locationdiv").find("#loaction").removeClass(eclass).addClass(server_location);if(configInfor.local=="Y"){isLocalSpider=true;webCrawlerId=1}loadMenu();var host=window.location.host;if(host.indexOf("newcrawler.com")!=-1){initLocation()}document.onkeydown=bodyOnkeydown;newcrawlerTools()})});function initLocation(){var a=window.location.href;$(".locationdiv").show();$(".locationdiv").mouseover(function(){$(this).stop().height(80);$(".locationdiv").find(".locationdrop").show();return false}).mouseout(function(){$(this).stop().height(16);$(".locationdiv").find(".locationdrop").hide();return false});$(".locationdiv").find(".locationdrop").find("li").click(function(){var e=$(this).attr("lang");$(this).mouseout();if(server_location!=e){server_location=e;var c=$(".locationdiv").find("#loaction").attr("class");$(".locationdiv").find("#loaction").removeClass(c).addClass(server_location);var d=window.location.protocol;var b=window.location.href;b=b.substring(b.indexOf("."));b=d+"//"+server_location+b;b=encodeURIComponent(b);b="/location?location="+server_location+"&url="+b;window.location.replace(b)}})}function loadMenu(){$("#ui-layout-treeview").html(nc.i18n("res.loading"));$.ajax({type:"GET",url:"menu.html",async:true,cache:true,success:function(a){$("#ui-layout-treeview").html(a);tasksNode=$("#tasksNode");appNode=$("#appNode");$("#treeview").treeview({animated:"fast",collapsed:false,unique:true});bindEvent();initTreeNode()}})}function bindEvent(){$(".file").unbind("click");$(".file").click(function(){message("hide");var b=$("#tabsview >ul >li").size();var a=$(this).attr("title");siteId=$(this).attr("siteId");siteId=parseInt(siteId);webCrawlerId=$(this).attr("webCrawlerId");webCrawlerId=parseInt(webCrawlerId);isReConfigBoxSize=false;if(selectTab(a)){return false}addTab($(this).html(),a);return false})}function bindEventWebCrawler(){$(".webCrawler").unbind("click");$(".webCrawler").click(function(){webCrawlerId=$(this).attr("webCrawlerId");webCrawlerId=parseInt(webCrawlerId);var b=""+webCrawlerId;siteJsonData=siteJsonDataMap.get(b);var a=crawlQueueHasImplMap.get(b);if(a==null){jsonrpc.crawlQueueService.hasImplements(function(c,d,e){if(c===true){a=true}else{a=false}crawlQueueHasImplMap.put(b,a)},webCrawlerId)}return false})}function initTreeNode(){var nodeHTML='<li id="loading" style="background: none;"><div style="width: 100%;" class="placeholder"><span style="margin-left: 20px;">'+nc.i18n("res.loading")+"</span></div></li>";$(nodeHTML).appendTo("#treeview");jsonrpc.webCrawlerAppService.query(function(result,exception,profile){if(!exception){var data=eval(result);webCrawlerJsonData=data;for(var i in data){if(isNaN(i)){continue}var webCrawlerId=data[i]["id"];var name=data[i]["name"];var webCrawlerUrl=data[i]["url"];if(webCrawlerId!=null&&webCrawlerId!=undefined){createWebCrawlerNode(webCrawlerId,webCrawlerUrl,name)}}bindEventWebCrawler()}$("#treeview li[id='loading']").remove();logsViewConsole.fn.init()})}function createWebCrawlerNode(e,g,c){var a="name-"+e;var d="webcrawler-"+e;var f="<li id='"+d+"' class='closed webCrawler'  webCrawlerId='"+e+"'  ><span id='"+a+"' class='folder folder-inactive'>"+c+"</span>";f+="<ul id='"+e+"'>";f+='<li id="loading"><div style="width: 100%;" class="placeholder"><span style="margin-left: 20px;">'+nc.i18n("res.loading")+"</span></div></li>";f+="</ul></li>";var b=$(f).appendTo("#treeview");$("#treeview").treeview({add:b});if(isLocalSpider){initWebCrawlerNode(e)}else{jsonrpc.webCrawlerAppService.check(function(h,i,j){$("ul[id="+e+"] li[id='loading']").remove();if(h){initWebCrawlerNode(e)}},e,g)}}function freshWebCrawlerNode(a){$("ul[id="+a+"]").empty();var b='<li id="loading"><div style="width: 100%;" class="placeholder"><span style="margin-left: 20px;">'+nc.i18n("res.loading")+"</span></div></li>";$(b).appendTo("ul[id="+a+"]");initWebCrawlerNode(a)}function initWebCrawlerNode(webCrawlerId){var nameNodeId="name-"+webCrawlerId;jsonrpc.siteTasksService.query(webCrawlerId,function(result,exception,profile,webCrawlerId){$("ul[id="+webCrawlerId+"] li[id='loading']").remove();if(exception!=null){if($("ul[id="+webCrawlerId+"]").parent().hasClass("expandable")){$("ul[id="+webCrawlerId+"]").parent().removeClass("expandable")}if($("ul[id="+webCrawlerId+"]").parent().hasClass("lastExpandable")){$("ul[id="+webCrawlerId+"]").parent().removeClass("lastExpandable").addClass("last")}if($("ul[id="+webCrawlerId+"]").parent().hasClass("collapsable")){$("ul[id="+webCrawlerId+"]").parent().removeClass("collapsable")}if($("ul[id="+webCrawlerId+"]").parent().hasClass("lastCollapsable")){$("ul[id="+webCrawlerId+"]").parent().removeClass("lastCollapsable").addClass("last")}$("ul[id="+webCrawlerId+"]").parent().removeClass("webCrawler").unbind("click");$("ul[id="+webCrawlerId+"]").parent().find(".hitarea").remove();$("ul[id="+webCrawlerId+"]").remove();return}var nodeHTML="";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="SiteTasksByCreate.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.siteTasksByCreate")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="BackupAndRestore.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.backupAndRestore")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="LogsView.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.menu.log.view")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="StatisticInfo.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.menu.statistic.info")+"</span></li>";nodeHTML+="<li id='name-config' class='closed' ><span class='folder set' >"+nc.i18n("res.webCrawlerConfig")+"</span>";nodeHTML+="<ul>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="HttpRequest.html" webCrawlerId="'+webCrawlerId+'" siteId="">'+nc.i18n("res.httpRequest")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="HttpInterManage.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.httpInterManage")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="SessionManager.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.sessionManage")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="EmailNotice.html" webCrawlerId="'+webCrawlerId+'" siteId="">'+nc.i18n("res.emailNotice")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="PluginManage.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.pluginManage")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="SpiderManage.html" webCrawlerId="'+webCrawlerId+'"  siteId="">'+nc.i18n("res.spiderManage")+"</span></li>";nodeHTML+='<li><span class="file" style="cursor: pointer;" title="WebCrawlerConfig.html" webCrawlerId="'+webCrawlerId+'" siteId="">'+nc.i18n("res.webCrawlerConfig.more")+"</span></li>";nodeHTML+="</ul></li>";var branches=$(nodeHTML).appendTo("ul[id="+webCrawlerId+"]");$("#treeview").treeview({add:branches});$("ul[id="+webCrawlerId+"]").parent().find("#"+nameNodeId).removeClass("folder-inactive");if(result!=null&&result!=""&&result!="null"){var siteData=eval(result);var key=""+webCrawlerId;siteJsonDataMap.put(key,siteData);for(var i in siteData){if(isNaN(i)){continue}var siteId=siteData[i]["id"];if(siteId!=null&&siteId!=undefined){createSiteTaskNode(webCrawlerId,siteId,siteData[i]["name"])}}}bindEvent()},webCrawlerId)}function updateWebCrawlerNode(c,b){var a="name-"+c;$("#"+a).html(b)}function removeWebCrawlerNode(c){var b="webcrawler-"+c;var a=$("#"+b);removeNode(a)}function createSiteTaskNode(d,f,b){var e=getSiteTaskNode(d,f,b);var a=$(e).appendTo("#"+d);$("#treeview").treeview({add:a});var c=""+d;siteJsonData=siteJsonDataMap.get(c)}function addSiteJsonData(b){var a=""+webCrawlerId;siteJsonDataMap.put(a,b)}function updateSiteTaskNode(c,d,b){var a="name-"+c+"-"+d;$("#"+a).html(b)}function removeSiteTaskNode(b,d){var c="site-"+b+"-"+d;var a=$("#"+c);removeNode(a)}function getSiteTaskNode(c,f,b){var a="name-"+c+"-"+f;var e="site-"+c+"-"+f;var d="<li id='"+e+"' class='closed' ><span class='folder' id='"+a+"' title='"+f+"'>"+b+"</span><ul>";d+='<li><span class="file" style="cursor: pointer;" title="SiteTasksByEdit.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.siteTasksByEdit")+"</span></li>";d+='<li><span class="file" style="cursor: pointer;" title="CrawlRules.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.crawlRules")+"</span></li>";d+='<li><span class="file" style="cursor: pointer;" title="DeployRules.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.dataDeploy")+"</span></li>";d+='<li><span class="file"  style="cursor: pointer;"  title="CrawlUrlList.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.crawlUrlList")+"</span></li>";d+='<li><span class="file"  style="cursor: pointer;"  title="CrawlDataList.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.crawlDataList")+"</span></li>";d+='<li><span class="file"  style="cursor: pointer;"  title="ScheduledTasks.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.scheduledTasks")+"</span></li>";d+='<li><span class="file"  style="cursor: pointer;"  title="CrawlAlert.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.crawlAlert")+"</span></li>";d+='<li><span class="file"  style="cursor: pointer;"  title="BackupAndRestoreBySite.html" webCrawlerId="'+c+'" siteId="'+f+'">'+nc.i18n("res.backupAndRestoreBySite")+"</span></li>";d+="</ul></li>";return d}function removeNode(a){$("#treeview").treeview({remove:a})}function querySiteList(){var data=jsonrpc.siteTasksService.query(webCrawlerId);return eval(data)}var sync_count_lock=0;function syncCount(d,c,a){if(c){var b=setInterval(function(){if(sync_count_lock==0){sync_count_lock=1;var e=$("#"+d).find("#"+c).val();e=parseInt(e)+a;$("#"+d).find("#"+c).val(e);clearInterval(b);sync_count_lock=0}},200)}}function fillHttpRequest(formId,eleId,isAllowNull,syncEleId,callback){var key=""+webCrawlerId;var data=httpRequestMap.get(key);if(data==null){syncCount(formId,syncEleId,1);jsonrpc.httpRequestService.query(function(result,exception,profile){var data=result;if(data==null||data==""){return}data=eval(data);httpRequestMap.put(key,data);fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId)}else{fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}}}function fillSelectOption(e,a,b,d){var f=$("#"+e).find("select[name='"+a+"']").val();$("#"+e).find("select[name='"+a+"']").children().remove();if(b){addOption(e,a,"","",false)}for(var c in d){if(isNaN(c)){continue}addOption(e,a,d[c]["name"],d[c]["id"],false)}$("#"+e).find("select[name='"+a+"']").val(f)}function fillEmailNotice(formId,eleId,isAllowNull,syncEleId,callback){var key=""+webCrawlerId;var data=emailNoticeMap.get(key);if(data==null){syncCount(formId,syncEleId,1);jsonrpc.emailNoticeService.query(function(result,exception,profile){var data=result;if(data==null||data==""){return}data=eval(data);emailNoticeMap.put(key,data);fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId)}else{fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}}}function fillCustomInter(type,formId,eleId,isAllowNull,syncEleId,callback){var key=""+webCrawlerId;var data=customInterMap.get(key);if(data==null){syncCount(formId,syncEleId,1);jsonrpc.httpInterService.query(function(result,exception,profile){var data=result;if(data==null||data==""){return}data=eval(data);customInterMap.put(key,data);fillSelectOption2(type,formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId)}else{fillSelectOption2(type,formId,eleId,isAllowNull,data);if(callback){callback()}}}function fillSelectOption2(d,f,a,b,e){var g=$("#"+f).find("select[name='"+a+"']").val();$("#"+f).find("select[name='"+a+"']").children().remove();if(b){addOption(f,a,"","",false)}for(var c in e){if(isNaN(c)){continue}if(e[c]["type"]==d){addOption(f,a,e[c]["name"],e[c]["id"],false)}}$("#"+f).find("select[name='"+a+"']").val(g)}function fillCustomPlugin(type,formId,eleId,isAllowNull,syncEleId,callback){var key=""+webCrawlerId;var data=customPluginMap.get(key);if(data==null){syncCount(formId,syncEleId,1);jsonrpc.pluginConfigService.query(function(result,exception,profile){var data=result;if(data==null||data==""){return}data=eval(data);customPluginMap.put(key,data);fillSelectOption2(type,formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId)}else{fillSelectOption2(type,formId,eleId,isAllowNull,data);if(callback){callback()}}}function fillSelectOption3(f,a,b,e){var g=$("#"+f).find("select[name='"+a+"']").val();$("#"+f).find("select[name='"+a+"']").children().remove();if(b){addOption(f,a,"","",false)}for(var c in e){if(isNaN(c)){continue}var d=e[c]["name"]+"("+e[c]["rate"]+"/"+e[c]["rateUnit"]+")";addOption(f,a,d,e[c]["name"],false)}$("#"+f).find("select[name='"+a+"']").val(g)}function fillQueue(formId,eleId,isAllowNull,syncEleId,callback){var key=""+webCrawlerId;var data=queueJsonDataMap.get(key);if(data==null){syncCount(formId,syncEleId,1);jsonrpc.crawlQueueService.query(function(result,exception,profile){var data=result;if(data==null||data==""){return}data=eval(data);queueJsonDataMap.put(key,data);fillSelectOption3(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId)}else{fillSelectOption3(formId,eleId,isAllowNull,data);if(callback){callback()}}}function fillSite(d,a,b){var c=siteJsonData;fillSelectOption(d,a,b,c)}function fillRulesVer(formId,eleId,isAllowNull,syncEleId,callback){syncCount(formId,syncEleId,1);jsonrpc.crawlRulesVerService.query(function(result,exception,profile){var data=result;data=eval(data);fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId,siteId)}function fillUrlCheck(formId,eleId,isAllowNull,syncEleId,callback){syncCount(formId,syncEleId,1);jsonrpc.urlCheckService.query(function(result,exception,profile){var data=result;data=eval(data);fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId,siteId)}function fillDeploy(formId,eleId,isAllowNull,syncEleId,callback){syncCount(formId,syncEleId,1);jsonrpc.dataDeployService.query(function(result,exception,profile){var data=result;data=eval(data);fillSelectOption(formId,eleId,isAllowNull,data);if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId,siteId)}function fillLabelWithName(d,a,c,b,e){fillLabel(d,a,c,b,false,null,e)}function fillLabelWithId(d,a,c,b,e){fillLabel(d,a,c,b,true,null,e)}function fillLabel(formId,eleId,rulesVerId,isAllowNull,isWithId,syncEleId,callback){syncCount(formId,syncEleId,1);jsonrpc.crawlRulesService.query(function(result,exception,profile){var data=result;data=eval(data);$("#"+formId).find("select[name='"+eleId+"']").children().remove();if(isAllowNull){addOption(formId,eleId,"","",false)}for(var i in data){if(isNaN(i)){continue}if(data[i]["labelType"]=="2"||data[i]["labelType"]=="4"||data[i]["isOffset"]=="true"||data[i]["isTemp"]=="true"){continue}var name=data[i]["name"];var id=data[i]["id"];if(!isWithId){id=name}addOption(formId,eleId,name,id,false)}if(callback){callback()}syncCount(formId,syncEleId,-1)},webCrawlerId,siteId,rulesVerId)}function getDataDeployMap(){var key=""+webCrawlerId;var data=dataDeployMap.get(key);if(data==null){var deployList=jsonrpc.dataDeployService.query(webCrawlerId);if(deployList==null||deployList==""){return null}deployList=eval(deployList);if(deployList!=null){var deployMap=new Map();for(var i in deployList){if(isNaN(i)){continue}var id=deployList[i]["id"];var name=deployList[i]["name"];deployMap.put(id+"",name)}dataDeployMap.put(key,deployMap);data=deployMap}}return data}function getWebCrawlerUrl(){var a=""+webCrawlerId;var b=webCrawlerUrlMap.get(a);if(b==null){var d=jsonrpc.webCrawlerAppService.getUrl(webCrawlerId);if(d==null){return null}var c=d[0];webCrawlerUrlMap.put(a,c);b=c}return b}function getSiteName(e){var c=""+webCrawlerId;var d=siteJsonDataMap.get(c);var a=null;for(var b in d){if(isNaN(b)){continue}if(d[b]["id"]==e){a=d[b]["name"];break}}return a}function updateSelectByCustomPlugin(c,a,b){if(b=="1"){updateSelect(c,a,"urlfetchPluginId")}else{if(b=="2"){updateSelect(c,a,"filterPlugin")}else{if(b=="3"){updateSelect(c,a,"fileSavePluginId")}else{if(b=="4"){updateSelect(c,a,"deployPluginId")}}}}}function removeSelectByCustomPlugin(a){removeSelect(a,"filterPlugin");removeSelect(a,"fileSavePluginId");removeSelect(a,"deployPluginId");removeSelect(a,"urlfetchPluginId")}function initConfigBox(){initConfigBoxWithObj($(".configBox"))}function reConfigBoxSize(){if($("#config-box")){$("#config-box").dialog("option","width",950);$("#config-box").dialog("option","minWidth",950);$("#config-box").dialog("option","height",450);$("#config-box").dialog("option","minHeight",450);var d=$("#config-box").dialog("option","maxHeight");var a=$("#config-box").height();if(a>d){$("#config-box").dialog("option","height",d)}var c=$("#config-box").dialog("option","maxWidth");var b=$("#config-box").width();if(b>c){$("#config-box").dialog("option","width",c)}$("#config-box").dialog("option","position",{my:"center",at:"center",of:window})}}function initConfigBoxWithObj(a){a.unbind("click");a.click(function(){openConfigBox($(this));return false})}function openConfigBox(c,b){isReConfigBoxSize=true;var a=c.attr("lang");$("#config-box").dialog("open");$("#config-box #config").html(html_loading);$("#config-box").dialog("option","title","Loading...");$("#config-box #config").load(a,function(){loadConfig=true;$("#config-box #config").find(":button:not(.link-button):not(.ui-button)").addClass("jfk-button jfk-button-standard");var d=$("#config-box #config").find("#mainTitle").text();$("#config-box #config").find("#mainTitle").parents("tr").remove();$("#config-box #config > table").css({"border-spacing":"0px"});$("#config-box").dialog("option","title",d);reConfigBoxSize();if(b){b($("#config-box"))}})}function newcrawlerTools(){if(webCrawlerId==null||webCrawlerId==""){nc.i18n("res.not.select.crawler");return}var c=getWebCrawlerUrl();var a=c+"member/readxpath?webCrawlerId="+webCrawlerId;var b="javascript:(function() { open('"+a+"&u='+encodeURIComponent(document.location.href),'_self').focus(); })();";jQuery(".logo").attr("href",b);jQuery(".logo").click(function(){jQuery(".logoTitle").click();return false})};