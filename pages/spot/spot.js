// pages/spot/spot.js
var { APIS } = require('../../const');
var { request } = require('../../libs/request');
var { substitute } = require('../../utils/util');

var app = getApp();
var theme = app.getTheme();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icSpotToNav: theme.icSpotToNav,
    icSpotStar: theme.icSpotStar,
    icSpotBus: theme.icSpotBus,
    icSpotSubway: theme.icSpotSubway,
    spot: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var spotId = options.id;
    this.getSpotDetail(spotId);
  },

  getSpotDetail: function(spotId) {
    var that = this;
    request({
      url: substitute(APIS.GET_NAV_SPOT_DETAIL, {
        id: spotId
      }, this),
      method: 'GET',
      realSuccess: function (data) {
        that.setData({
          spot: data
        });
      },
      realFail: function (msg, code) {
        wx.showToast({
          title: msg
        });
      }
    }, false);
  },

  gotoNav: function() {
    var spot = this.data.spot;
    wx.openLocation({
      longitude: spot.longitude,
      latitude: spot.latitude,
      name: spot.name,
      address: spot.address
    });
  }
})