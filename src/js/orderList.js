$(document).ready(function(){
    //分页
    $('.M-box1').pagination({
        totalData:count,
        showData:pageSize,
        prevContent: '<i class="icon iconfont icon-jiantou3zuo"></i>',		//上一页内容
        nextContent:'<i class="icon iconfont icon-jiantou3you"></i>',
        coping:true,
        current:1,
        count:10,
        callback:pageCallBack
    });

    $('.selectpicker').selectpicker('refresh');
    $("#data-from").datepicker({
        format : 'yyyy-mm-dd',
        autoclose : true,
        clearBtn : true,
        disableTouchKeyboard : true
    });
    $("#date-to").datepicker({
        format : 'yyyy-mm-dd',
        autoclose : true,
        clearBtn : true,
        disableTouchKeyboard : true,
        startDate : $('#date-from').val()
    }).on('changeDate', function(e) {
        $("#date-from").datepicker('setEndDate', $(this).val());
        if ($("#date-from").val() != '' && $(this).val() != '') {

        }
    });
    $("#data-from2").datepicker({
        format : 'yyyy-mm-dd'
    });
    $("#date-to2").datepicker({
        format : 'yyyy-mm-dd',
        autoclose : true,
        clearBtn : true,
        disableTouchKeyboard : true,
        startDate : $('#date-from2').val()
    }).on('changeDate', function(e) {
        $("#date-from2").datepicker('setEndDate', $(this).val());
        if ($("#date-from2").val() != '' && $(this).val() != '') {
//          historyDateRangePick();
        }
    });

});


//点击分页回调
function pageCallBack(index, jq){
    var currentPage = index.getCurrent();
    if(checkTime()) {
        renderHtml(currentPage);
    }
}
//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
var queryType="0";//默认是查看自己下的订单
queryType = getUrlParam("queryType");
function renderHtml(currentPage){
    $.ajax({
        type: "POST",
        dataType: "html",
        url: '/order/orderList.htm',
        data: {currentPage:currentPage,isAjax:"0",orderNo:$("#orderNo").val(),startDate:$("#data-from").val(),endDate:$("#date-to").val(),orderStatus:$("#orderStatus").val(),queryType:queryType,storeName:$("#storeName").val()},
        success: function(data) {
            var tabId=$("#tabId").val();
            $(tabId).html(data);
            $('.M-box1').pagination({
                totalData:count,
                showData:pageSize,
                prevContent: '<i class="icon iconfont icon-jiantou3zuo"></i>',		//上一页内容
                nextContent:'<i class="icon iconfont icon-jiantou3you"></i>',
                coping:true,
                current: currentPage,
                count:10,
                callback:pageCallBack
            });
        }
    });
}

//搜索
function searchOrder(){
    if(checkTime()){
        renderHtml(1);
    }
}
//校验时间
function checkTime(){
    var startTime=$("#data-from").val();
    var start=new Date(startTime.replace("-", "/").replace("-", "/"));
    var endTime=$("#date-to").val();
    var end=new Date(endTime.replace("-", "/").replace("-", "/"));
    if(end<start){
        return false;
    }
    return true;
}


var clicktab =  function (e){
    $(e).addClass("active").siblings("li").removeClass("active");
    $("#orderStatus").val($(e).data("status"));
    var divitem = $(e).data("txt");
    $("#tabId").val(divitem);
    renderHtml(1);
    $(divitem).show().siblings(".order-container .item").hide();

};
var cancelOrderFlag = 0;
function cancelOrder(orderId){
    if(cancelOrderFlag!=0){
        return;
    }
    cancelOrderFlag=1;
        pop_msg.show('确定取消订单吗？', 'custom', '确定', '关闭', function () {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: '/order/cancelOrder.htm',
                data: {orderId:orderId},
                success: function(data) {
                    cancelOrderFlag=0;
                    data = eval('('+data+')');
                    if(data.status=='success') {
                        renderHtml(1);
                    }else if(data.status=='nullOrder'){
                        pop_msg.show('查不到该订单支付成功的记录,取消失败');
                    }else{
                        pop_msg.show('取消失败');
                    }
                    pop_msg.hidden();//关闭弹出框s
                },
                error:function () {
                    pop_msg.hidden();//关闭弹出框s
                    pop_msg.show('取消失败');
                    cancelOrderFlag=0;
                }
            });
        }, function () {
            cancelOrderFlag=0;
            pop_msg.hidden();//关闭弹出框s
        });
}

function surePay(orderId){
    pop_msg.show('确定已支付吗？', 'custom', '确定', '关闭', function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/order/surePay.htm',
            data: {orderId:orderId},
            success: function(data) {
                data = eval('('+data+')');
                if(data.status=='success') {
                    renderHtml(1);
                }
                pop_msg.hidden();//关闭弹出框s
            },
            error:function () {
                pop_msg.hidden();//关闭弹出框s
                pop_msg.show('确认支付失败');
            }
        });
    }, function () {
        pop_msg.hidden();//关闭弹出框s
    });
}


function doIt(orderId){
    pop_msg.show('确定要做单吗？', 'custom', '确定', '关闭', function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/order/doIt.htm',
            data: {orderId:orderId},
            success: function(data) {
                data = eval('('+data+')');
                if(data.status=='success') {
                    renderHtml(1);
                }
                pop_msg.hidden();//关闭弹出框s
            },
            error:function () {
                pop_msg.hidden();//关闭弹出框s
                pop_msg.show('做单失败');
            }
        });
    }, function () {
        pop_msg.hidden();//关闭弹出框s
    });
}

function queryCret(paymentNo){
    var cretImage = '';
    $.ajax({
        type: "get",
        dataType: "json",
        async:false,
        url: '/order/getCretImage.htm',
        data: {paymentNo:paymentNo},
        success: function(data) {
            data=  eval('('+data+')');
            if(data.imageName!=null&&data.imageName!=''){
                cretImage=$("#ftpPath").val()+data.imageName;
               // $("#cretImage").click();
                //window.location.href=$("#ftpPath").val()+data.imageName;
            }else{
                pop_msg.show('未上传凭证');
            }
        }
    });
    if(cretImage!='') {
        $("#cretImage").attr("href",cretImage);
        document.getElementById("cretImage").click();
    }
}


var btn_close = function (e) {
    $(e).parents(".popModal").hide();
    $(".mask").hide();
   // ensableScroll();

};

function exportexcel(){
	var orderNo=$("#orderNo").val();
	var startDate=$("#data-from").val();
	var endDate=$("#date-to").val();
	var orderStatus=$("#orderStatus").val();
	window.location.href="orderListexport.htm?orderNo="+orderNo+"&startDate="+startDate+"&endDate="+endDate+"&orderStatus="+orderStatus+"&queryType="+queryType;
}

function exportsendexcel(){
	var orderNo=$("#orderNo").val();
	var startDate=$("#data-from").val();
	var endDate=$("#date-to").val();
	var orderStatus=$("#orderStatus").val();
	window.location.href="sendorderListexport.htm?orderNo="+orderNo+"&startDate="+startDate+"&endDate="+endDate+"&orderStatus="+orderStatus+"&queryType="+queryType;
}
var textArea = document.createElement("textarea");
function copyOrder(orderNo) {
    textArea.value = orderNo;
    textArea.id = orderNo+"_1";
    document.body.appendChild(textArea);

    var c1 = new myClipBoard({
        handlerID: orderNo,
        textID:  orderNo+"_1",
        isAttr: false,
        type:'copy'
    });
    c1.attach(); // 触发复制/剪切功能
    $("#"+orderNo+"_1").css("opacity","0.01");
}