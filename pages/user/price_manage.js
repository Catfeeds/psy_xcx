import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'

let app = getApp();
import _ from '../../libs/lodash/we-lodash';

Page({
    data: {
        toast: null,
    },
    onLoad() {
        this.setData({
            toast: this.selectComponent('#toast')
        });
        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'price': {required: true},
        }, {
            'price': {required: '请输入你的线上咨询价格'},
        });
        this.WxValidate = app.WxValidate({
          'off_price': { required: true },
        }, {
          'off_price': { required: '请输入你的线上=下咨询价格' },
        });

    },
    onShow() {
        app.getUserOpenId()
            .then(res => {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    is_zxs: res.is_zxs
                });
                if (!res.uid) {
                    //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
                    $dialog.alert({
                        title: '明悦心空',
                        content: '明悦心空需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                        buttons: [{
                            text: '知道了',
                            type: 'weui-dialog__btn_primary',
                        }],
                        onConfirm(e) {
                        },
                    });
                } else if (res.uid && res.is_user != '1') {
                    app.goPage('/pages/login/login', {}, {type: 'redirect'})
                }
            })
            .then(r => {
                api.getZxsPrice({uid: app.globalData.customInfo.uid}).then(res => {
                    this.setData({
                        price:res.data.price,
                        off_price: res.data.off_price,
                    });
                });
            })
    },
    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitForm(e) {
        const formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.data.toast.show(error.msg)
            return false
        }
        let params = Object.assign({}, formParms,
            {uid: app.globalData.customInfo.uid});
        api.setZxsPrice(params).then(res => {
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


