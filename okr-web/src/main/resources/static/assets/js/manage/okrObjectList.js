var pageObj = pageObj || {};
require(["jQuery"], function () {
    $.extend(pageObj, {

        options: {useEasing: true, useGrouping: true},
        currentType: '',
        currentTeamId: '',
        editFlag: '',

        loadOKRObjects: function (type, teamId) {
            var _this = this;
            require(["jQueryBlockUI"], function () {
                $("#message").block();
                $.ajax({
                    url: App["contextPath"] + "/manage/okrObject/getOkrListByType.json",
                    type: "POST",
                    data: JSON.stringify({searchVO: {type: type, teamId: teamId}}),
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {
                    pageObj.currentType = type;
                    pageObj.currentTeamId = teamId;
                    res && _this.buildOKRObjects(res);
                }).always(function () {
                    $("#message").unblock();
                });
            });
        },

        buildOKRObjects: function (res) {
            require(["Underscore", "jQueryUtils", "AppUtils"], function () {
                var $okrObjectList = $("#okrObjectList"); $okrObjectList.empty();
                var statusList = enumUtil.getEnum("objectivesStatusList.json");
                var executeList = enumUtil.getEnum("executeStatusList.json");
                $.each(res.info, function (idx, object) {
                    var okrHeader =
                        '<div class="okr-header">' +
                        '   <div class="area-charts">' +
                        '       <div id="[%=object.id%]" style="width: 100%;height: 100%;"></div>' +
                        '       <div class="charts-total">' +
                        '           <span class="num" data-end="[%=object.progress%]" data-new="[%=object.progress%]">[%=object.progress%]</span>' +
                        '           <em>%</em>' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="okr-header-desc">' +
                        '       <h3 class="name">' +
                        '           [%=object.name%]' +
                        '           <div class="action">' +
                        '               <em class="em-start [%=statusList[object.status].cssClass%]">[%=statusList[object.status].name%]</em>' +
                        '               <a class="btn-del text-primary" onclick="pageObj.deleteFunc([%=object.id%]);"><i class="icon-del"></i>删除</a>' +
                        '               <a class="btn-del text-primary" onclick="pageObj.addOrUpdateObject([%=object.id%]);"><i class="icon-edit"></i>编辑</a>' +
                        '           </div>' +
                        '       </h3>' +
                        '       <p>[%=object.description%]</p>' +
                        '   </div>' +
                        '   <div class="desc"><a class="btn btn-primary waves-effect waves-light" onclick="">查看详情</a></div>' +
                        '</div>';
                    var okrCon = '<div class="okr-con">' +
                        '   <ul class="okr-list">' +
                        '       [%if(!_.isNull(object.resultsExtList) && object.resultsExtList.length>0){%]' +
                        '           [%_.each(object.resultsExtList, function(item){%]' +
                        '               <li>' +
                        '                   <div class="okr-list-in">' +
                        '                       <h4>' +
                        '                           K1：[%=item.name%]' +
                        '                           <div class="action">' +
                        '                               <span class="txt-all [%=executeList[item.status].cssClass%]">' +
                        '                                   <i class="iconfont icon-dot"></i>[%=executeList[item.status].name%]' +
                        '                               </span>' +
                        '                           </div>' +
                        '                       </h4>' +
                        '                       <div class="participant">' +
                        '                           <span class="name">参与人员：</span>' +
                        '                           <ul class="participant-list">' +
                        '                               [%if(!_.isNull(object.joinUsers) && object.joinUsers.length>0){%]' +
                        '                                   [%_.each(object.joinUsers, function(user){%]' +
                        '                                       <li class="part-item"><span><img src="/assets/images/temp/pic.png"></span></li>' +
                        '                                   [%});%]' +
                        '                                   <li class="part-item"><a href=""><i class="iconfont icon-more"></i></a></li>' +
                        '                               [%}%]' +
                        '                           </ul>' +
                        '                       </div>' +
                        '                   </div>' +
                        '                   <div class="okr-list-tab">' +
                        '                       <p class="scroll-bar">' +
                        '                           <i class="complete"></i>' +
                        '                           <i class="new"></i>' +
                        '                           <span class="vals">' +
                        '                               <em class="num" data-end="[%=item.preProgress%]" data-new="[%=item.progress%]">[%=item.progress%]</em>%' +
                        '                           </span>' +
                        '                       </p>' +
                        '                       <div class="action">' +
                        '                           <a class="btn-del text-primary" onclick="pageObj.deleteResultFunc([%=item.id%])"><i class="icon-del"></i>删除</a>' +
                        '                           <a class="btn-other text-primary" onclick="pageObj.addCheckin([%=item.id%])"><i class="icon-refresh"></i>进度</a>' +
                        '                           <a class="btn-del text-primary" onclick="pageObj.addOrUpdateResult([%=item.id%], [%=object.id%])"><i class="icon-edit"></i>编辑</a>' +
                        '                       </div>' +
                        '                   </div>' +
                        '               </li>' +
                        '           [%});%]' +
                        '       [%}%]' +
                        '   </ul>' +
                        '</div>';
                    var header = UnderscoreUtil.getHtmlByText(okrHeader, {object: object, statusList: statusList});
                    $okrObjectList.append(header);
                    var con = UnderscoreUtil.getHtmlByText(okrCon, {object: object, executeList: executeList});
                    $okrObjectList.append(con);

                    pageObj.showHideOperationButton();
                    pageObj.pieEchartsFunc(object.id, object.progress);
                });
            });
        },

        // 操作按钮显示隐藏处理
        showHideOperationButton: function () {
            switch (pageObj.currentType) {
                case '1':
                    $('#addObject').show();
                    break;
                case '2':
                    if (pageObj.editFlag === '1') {
                        $('#addObject').show();
                    } else {
                        $('#addObject').hide();
                        $('.btn-del').hide();
                    }
                    break;
                case '3':
                    if ($('#companyEditFlag').val() === '1') {
                        $('#addObject').show();
                    } else {
                        $('#addObject').hide();
                        $('.btn-del').hide();
                    }
                    break;
            }
        },

        pieEchartsFunc: function (id, progress) {
            require(["echarts"], function (echarts){
                var option = {
                    title: {text: '', x: 'center', y:"80%", textStyle: {fontSize: '12px', color:"#545454"}},
                    tooltip: {trigger: 'item', formatter: "{b} {d}%"},
                    legend: {orient: 'vertical', x: 'left', y:"-20%", data:['已完成','']},
                    series: [
                        {name:'', type:'pie', radius: ['60%', '75%'], avoidLabelOverlap: false, color:['#f57677','#dedede'],
                            label: {normal: {show: false, position: 'center'}, emphasis: {show: true, textStyle: {fontSize: '22px'}}},
                            labelLine: {normal: {show: false}},
                            data:[{value:progress, name: '已完成'}, {value: (100 - progress), name: '未完成'}]
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById(id));
                myChart.setOption(option);
            });
            require(["countUp"], function (CountUp) {
                $(".charts-total .num,.vals .num").each(function () {
                    var countUp = new CountUp(this, 0, $(this).data("new"), 0, 1, pageObj.options);
                    countUp.start();
                });
                $(".vals .num").each(function () {
                    var $bar=$(this).parents(".scroll-bar");
                    $bar.find(".complete").width($(this).data("end")+"%");
                    $bar.find(".new").width($(this).data("new")+"%");
                });
            });
        },

        tabClick: function (dom, type, teamId) {
            if (type === '2') {
                pageObj.editFlag = $(dom).data('editFlag');
            }
            $(dom).addClass('active').siblings().removeClass('active');
            pageObj.loadOKRObjects(type, teamId);
        },

        addOrUpdateObject: function (id) {
            require(["artDialog"], function () {
                var dialogObj = dialog({
                    url: App["contextPath"] + "/manage/okrObject/okrObjectForm.htm?objectId=" + id + "&type=" + pageObj.currentType,
                    title: '新增/编辑Object',
                    quickClose: false,
                    cancelValue: "关闭",
                    cancel: function () {
                        //关闭对话框
                        dialogObj.close();
                        return false;
                    },
                    button: [{
                        value: '保存',
                        callback: function () {
                            return false;
                        }
                    }]
                });
                dialogObj.showModal();
            });
        },

        addOrUpdateResult: function (id, objectId) {
            require(["artDialog"], function () {
                var dialogObj = dialog({
                    url: App["contextPath"] + "/manage/okrResult/okrResultForm.htm?resultId=" + id + "&objectId=" + objectId,
                    title: '新增/编辑Result',
                    quickClose: false,
                    cancelValue: "关闭",
                    cancel: function () {
                        //关闭对话框
                        dialogObj.close();
                        return false;
                    },
                    button: [{
                        value: '保存',
                        callback: function () {
                            return false;
                        }
                    }]
                });
                dialogObj.showModal();
            });
        },

        deleteFunc: function (id) {
            require(["artDialog"], function () {
                artDialogUtil.confirm("确认删除该Object吗？", function () {
                    $.ajax({
                        url: App["contextPath"] + "/manage/okrObject/deleteObject.json?objectId=" + id,
                        dataType: "json",
                        success: function (data) {
                            require(["Tips"], function () {
                                if (data.success) {
                                    TipsUtil.info(data.message);
                                    pageObj.loadOKRObjects(pageObj.currentType, pageObj.currentTeamId);
                                } else {
                                    TipsUtil.warn(data.message);
                                }
                            });
                        },
                        error: function (res) {
                            alert(JSON.stringify(res));
                        }
                    });
                });
            });
        },

        deleteResultFunc: function (id) {

        },

        addCheckin: function (id) {

        }
    });

    $(window).ready(function () {
        window.pageObj = pageObj;
        pageObj.loadOKRObjects('1', null);
        pageObj.editFlag = '1';
    });
});