import config from '../../config'

let app = getApp();
import api from '../../libs/api';
import util from '../../libs/util';
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime';
import _ from '../../libs/lodash/we-lodash';

Page({
    data: {
        static_path: config.static_path,
        listOpts: {},//列表项组件参数
        searchOpts: {},//搜索组件参数
        filterOpts: {},//筛选组件参数
        condition: {},
        showSearchPanel: false,
        cidIndex: 0,
        menus: [],
        focused: false,
    },
    onLoad(options) {
        api.orderList({uid: app.globalData.customInfo.uid}).then(res => {
            this.setData({
                listData: res.data
            })
        })
    },
    goDetail(e) {
        let dataset = e.currentTarget.dataset, url = '', params = {};
        url = "/pages/user/yuyue-detail";
        params = {id: dataset.id}
        app.goPage(url, params);
    },
});

