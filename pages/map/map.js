var theme = require('../../themes/default.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clrMain: theme.clrMain,
    icMapDownArrow: theme.icMapDownArrow,

    centerLongitude: '114.362800',
    centerLatitude: '30.537800',
    selects: [true, false, false, false, false, false, false, false],
    markers: [],
    polyline: [],
    controls: [],
    isShowPath: false,
    currentType: 'entry',
    d: null,
    scrollLeft: 0,
    animationData: {},

    campusFilterOpenCls: '',
    campusPanelAnim: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.map = wx.createMapContext('map');

    var wHeight = wx.getSystemInfoSync().windowHeight;
    this.mapHeight = wHeight - 70;

    this.renderControls();
    this.createAnim();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  renderControls: function() {
    this.setData({
      controls: [{
        id: 0,
        iconPath: theme.icMapSearch,
        position: {
          left: 312,
          top: this.mapHeight - 197,
          width: 53,
          height: 48
        },
        clickable: true
      }, {
        id: 1,
        iconPath: theme.icMapMyLocation,
        position: {
          left: 312,
          top: this.mapHeight - 149,
          width: 53,
          height: 49
        },
        clickable: true
      }, {
        id: 2,
        iconPath: theme.icMapRecUnselected,
        position: {
          left: 312,
          top: this.mapHeight - 100,
          width: 53,
          height: 52
        },
        clickable: true
      }]
    });
  },

  onToggleCampusPanel: function() {
    // 关闭
    if (this.data.campusFilterOpenCls) {
      this.campusPanelAnim.height('0').step();
      this.setData({
        icMapDownArrow: theme.icMapDownArrow,
        campusFilterOpenCls: '',
        campusPanelAnim: this.campusPanelAnim.export()
      });
      this.mapHeight += 150;
      this.renderControls();
    // 打开
    } else {
      this.campusPanelAnim.height('300rpx').step();
      this.setData({
        icMapDownArrow: theme.icMapUpArrow,
        campusFilterOpenCls: 'campus-filter-open',
        campusPanelAnim: this.campusPanelAnim.export()
      });
      this.mapHeight -= 150;
      this.renderControls();
    }
  },

  createAnim: function() {
    var that = this;
    this.campusPanelAnim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    });
  }
})