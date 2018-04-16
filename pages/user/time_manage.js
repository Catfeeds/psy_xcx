import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'

let app = getApp();


//预约时间初始化
var courseList = [];


Page({
    data: {
        toast: null,
        times: [],
        courseList: [],
    },
    onLoad() {
        this.setData({
            toast: this.selectComponent('#toast'),
            customInfo: app.globalData.customInfo,
            userInfo: app.globalData.userInfo,
        });
        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'times': {required: true},

        }, {
            'times': {required: '请选择时间'},
        });
        for (var i = 0; i < 7; i++) {
            courseList[i] = [{id: 0}, {id: 1}, {id: 2}, {id: 3}];
        }
    },
    onShow() {
        let self= this;
        app.getUserOpenId().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                is_zxs: res.is_zxs
            });
            if (!res.uid) {
                //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
                $dialog.alert({
                    title: '经纪圈新房通',
                    content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                    buttons: [{
                        text: '知道了',
                        type: 'weui-dialog__btn_primary',
                    }],
                    onConfirm(e) {
                    },
                });
            } else if (res.uid && res.is_user != '1') {
                app.goPage('/pages/login/login')
            }
        }).then(() => {
            api.getZxsTime({uid: app.globalData.customInfo.uid}).then(res => {
                courseList.forEach((V, I) => {
                    V.forEach((v, i) => {
                        let ind=self.checkIsMacth(res.data,I,v.id);
                        if(ind!=-1){
                            v.selected = true;
                        };
                    });
                });
                this.setData({courseList, times: res.data})
            })
        })
    },
    checkIsMacth(times, week, time) {
        return times.findIndex((v, i) => {
            return v.week == week && v.time_area == time;
        });
    },
    chooseDate(e) {
        let data = e.currentTarget.dataset;
        let times = this.data.times;
        let index = times.findIndex((v, i) => {
            return v.week == data.week && v.time_area == data.time;
        });
        if (index != -1) {
            times.splice(index, 1);
        } else {
            times.push({week: data.week, time_area: data.time});
        }
        this.setData({
            times: times
        });
        this.setTime();
    },

    setTime() {
        let courseList = this.data.courseList;
        let times = this.data.times;
        courseList.forEach((V, I) => {
            V.forEach((v, i) => {
                let ind=this.checkIsMacth(times,I,v.id);
                if(ind!=-1){
                    v.selected = true;
                }else{
                    v.selected = false;
                }
            });
        });
        
        this.setData({courseList})
    },

    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitForm(e) {
        let formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.data.toast.show(error.msg);
            return false;
        }
        let params = Object.assign({}, formParms, {uid: app.globalData.customInfo.uid, times: JSON.stringify(this.data.times)});
        api.setZxsTime(params).then(res => {
            let data = res;
            this.data.toast.show(data.msg);
            if (data.status == "success") {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 2e3)
            }
        });
    },
});


