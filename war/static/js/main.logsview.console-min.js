var logsViewConsole={v:{webCrawlerId:null,logsTimer:null,isShow:false,logsWindowHeight:200,logsWindowHeightDefault:200},fn:{init:function(){if(logsViewConsole.v.logsTimer!=null){clearTimeout(logsViewConsole.v.logsTimer)}logsViewConsole.v.logsTimer=null;for(var c in webCrawlerJsonData){if(isNaN(c)){continue}var b=webCrawlerJsonData[c]["name"];var a='<li class="console_item" lang="'+webCrawlerJsonData[c]["id"]+'">'+b+"</li>";$(".logsViewConsoleWindow").find(".logs").find(".selectdiv").find(".selectdrop").append(a)}$(".logsViewConsole").click(function(){if($(".logsViewConsoleWindow").is(":hidden")){if(logsViewConsole.v.webCrawlerId==null||logsViewConsole.v.webCrawlerId==undefined){if(webCrawlerId==null||webCrawlerId==undefined){showInfo(nc.i18n("res.not.select.crawler"));return}logsViewConsole.v.webCrawlerId=webCrawlerId}logsViewConsole.v.isShow=true;$(".logsViewConsoleWindow").find(".logs").find(".selectdiv").find(".selectdrop li").each(function(){var e=$(this).attr("lang");var d=$(this).text();$(this).removeClass("selectdiv_item_selected");if(e==webCrawlerId){$(".logsViewConsoleWindow").find(".logs").find(".select_title").text(d);$(this).addClass("selectdiv_item_selected")}})}else{logsViewConsole.v.isShow=false}if(logsViewConsole.v.webCrawlerId==null||logsViewConsole.v.webCrawlerId==undefined){if(webCrawlerId==null||webCrawlerId==undefined){showInfo(nc.i18n("res.not.select.crawler"));return}}moveAllTrWithObj($(".logsViewConsoleWindow").find(".logs").find("table"));jsonrpc.logService.consoleLogs(function(e,f,g){if(f){return}if(logsViewConsole.v.isShow){var d=$(".ui-layout-content").height();d=d-(logsViewConsole.v.logsWindowHeightDefault+28);$(".ui-layout-content").height(d);$(".logsViewConsoleWindow").show();logsViewConsole.fn.initEvent();logsViewConsole.fn.log();$(".logsViewConsoleWindow").find(".logs").find(".selectdiv").hover(function(){$(this).addClass("selectdiv_datahighlight");$(".logsViewConsoleWindow").find(".logs").find(".selectdrop").show()},function(){$(this).removeClass("selectdiv_datahighlight");$(".logsViewConsoleWindow").find(".logs").find(".selectdrop").hide()});$(".logsViewConsoleWindow").find(".logs").find(".console_item").click(function(){var i=$(this).attr("lang");var h=$(this).text();logsViewConsole.fn.changeConsole($(this),i,h);$(this).mouseout()});$(".logsViewConsoleWindow").find(".logs").find(".console_item").hover(function(){$(this).addClass("selectdiv_item_datahighlight")},function(){$(this).removeClass("selectdiv_item_datahighlight")})}else{var d=$(".ui-layout-content").height();d=d+(logsViewConsole.v.logsWindowHeightDefault+28);$(".ui-layout-content").height(d);$(".logsViewConsoleWindow").hide();if(logsViewConsole.v.logsTimer!=null){clearTimeout(logsViewConsole.v.logsTimer)}}},logsViewConsole.v.webCrawlerId,logsViewConsole.v.isShow)})},changeConsole:function(d,c,b){if(c==logsViewConsole.v.webCrawlerId){return}var a=logsViewConsole.v.webCrawlerId;jsonrpc.logService.consoleLogs(function(e,f,g){if(f){return}logsViewConsole.v.isShow=true;logsViewConsole.v.webCrawlerId=c;$(".logsViewConsoleWindow").find(".logs").find(".console_item").each(function(){$(this).removeClass("selectdiv_item_selected")});d.addClass("selectdiv_item_selected");$(".logsViewConsoleWindow").find(".logs").find(".select_title").text(b);if(logsViewConsole.v.logsTimer==null){logsViewConsole.fn.log()}jsonrpc.logService.consoleLogs(function(h,i,j){if(i){return}},a,false)},c,true)},log:function(){jsonrpc.logService.readConsoleLogs(function(result,exception,profile,ele){result=eval(result);for(var i in result){if(isNaN(i)){continue}var row="";var logs=(result[i]["logs"]==null?"":result[i]["logs"]);var remark=(result[i]["remark"]==null?"":result[i]["remark"]);if(result[i]["key"]!=null&&result[i]["key"]!=""){var key=(result[i]["key"]==null?"":("logs_"+result[i]["key"]));row+="<tr id='"+key+"' class='simplehighlight'>";var status=(result[i]["status"]==null?"":result[i]["status"]);var color=(result[i]["color"]==null?"":("logs_"+result[i]["color"]));if(result[i]["isUpdate"]){$(".logsViewConsoleWindow .logs").find("#"+key).find(".logs_status").text(status);$(".logsViewConsoleWindow .logs").find("#"+key).find(".logs_status").removeClass("logs_blue logs_red logs_green");$(".logsViewConsoleWindow .logs").find("#"+key).find(".logs_status").addClass(color);$(".logsViewConsoleWindow .logs").find("#"+key).find(".logs_remark").text(remark);continue}else{var type=(result[i]["type"]==null?"":result[i]["type"]);if(type==1){type=nc.i18n("res.logs.type.crawl")}else{if(type==2){type=nc.i18n("res.logs.type.crawl.retry")}else{if(type==3){type=nc.i18n("res.logs.type.deploy")}else{if(type==4){type=nc.i18n("res.logs.type.deploy.retry")}else{if(type==5){type=nc.i18n("res.logs.type.download")}else{if(type==6){type=nc.i18n("res.logs.type.download.retry")}else{type=""}}}}}}var date=(result[i]["date"]==null?"":result[i]["date"]);row+="<td>"+date+"</td>";row+="<td>"+type+"</td>";row+="<td>[<span style='width:70px;display: inline-block;' class='logs_status "+color+"'>"+status+"</span>]</td>"}}else{row="<tr class='simplehighlight'>";row+="<td></td>";row+="<td></td>";row+="<td></td>"}row+='<td><div contenteditable="true" style="overflow: hidden; line-height: 22px; height: 22px; text-overflow: ellipsis;"  class="logs_body"></div></td>';row+='<td><div contenteditable="true" style="overflow: hidden; line-height: 22px; height: 22px; text-overflow: ellipsis;padding-left: 20px;" class="logs_remark" ></div></td>';row+="</tr>";var rowObj=$(row);rowObj.find(".logs_body").text(logs);rowObj.find(".logs_remark").text(remark);rowObj.appendTo(".logsViewConsoleWindow .logs table");$(".logsViewConsoleWindow").find(".logs").animate({scrollTop:$(".logsViewConsoleWindow .logs")[0].scrollHeight},0);$(".logsViewConsoleWindow").find(".logs").find("table").find(".simplehighlight").hover(function(){$(this).children().addClass("logs_datahighlight")},function(){$(this).children().removeClass("logs_datahighlight")})}if(logsViewConsole.v.isShow){logsViewConsole.v.logsTimer=setTimeout(function(){logsViewConsole.fn.log()},1500)}},logsViewConsole.v.webCrawlerId,0,20)},clean:function(){moveAllTrWithObj($(".logsViewConsoleWindow").find(".logs").find("table"))},min:function(){var c=logsViewConsole.v.logsWindowHeight-25;logsViewConsole.v.logsWindowHeight=25;$(".logsViewConsoleWindow").find(".logs").height(logsViewConsole.v.logsWindowHeight);var a=$(".ui-layout-content").height();a=a+c;$(".ui-layout-content").height(a);var b=$(".logsViewConsoleWindow").find(".logs").find(".resize").attr("lang");$(".logsViewConsoleWindow").find(".logs").find(".resize").addClass(b).removeClass("resize");$(".logsViewConsoleWindow").find(".logs").find(".min").addClass("resize").removeClass("min");logsViewConsole.fn.initEvent()},max:function(){var a=$(".ui-layout-content").height();$(".ui-layout-content").height(0);logsViewConsole.v.logsWindowHeight=logsViewConsole.v.logsWindowHeight+a;$(".logsViewConsoleWindow").find(".logs").height(logsViewConsole.v.logsWindowHeight);var b=$(".logsViewConsoleWindow").find(".logs").find(".resize").attr("lang");$(".logsViewConsoleWindow").find(".logs").find(".resize").addClass(b).removeClass("resize");$(".logsViewConsoleWindow").find(".logs").find(".max").addClass("resize").removeClass("max");logsViewConsole.fn.initEvent()},resize:function(){var c=logsViewConsole.v.logsWindowHeight-logsViewConsole.v.logsWindowHeightDefault;var a=$(".ui-layout-content").height();a=a+c;$(".ui-layout-content").height(a);$(".logsViewConsoleWindow").find(".logs").height(logsViewConsole.v.logsWindowHeightDefault);logsViewConsole.v.logsWindowHeight=logsViewConsole.v.logsWindowHeightDefault;var b=$(".logsViewConsoleWindow").find(".logs").find(".resize").attr("lang");$(".logsViewConsoleWindow").find(".logs").find(".resize").addClass(b).removeClass("resize");logsViewConsole.fn.initEvent()},initEvent:function(){$(".logsViewConsoleWindow").find(".logs").find(".min").unbind("click");$(".logsViewConsoleWindow").find(".logs").find(".max").unbind("click");$(".logsViewConsoleWindow").find(".logs").find(".resize").unbind("click");$(".logsViewConsoleWindow").find(".logs").find(".min").click(function(){logsViewConsole.fn.min()});$(".logsViewConsoleWindow").find(".logs").find(".max").click(function(){logsViewConsole.fn.max()});$(".logsViewConsoleWindow").find(".logs").find(".resize").click(function(){logsViewConsole.fn.resize()});$(".logsViewConsoleWindow").find(".logs").find(".min").attr("title",nc.i18n("res.console.min"));$(".logsViewConsoleWindow").find(".logs").find(".max").attr("title",nc.i18n("res.console.max"));$(".logsViewConsoleWindow").find(".logs").find(".resize").attr("title",nc.i18n("res.console.resize"))}}};