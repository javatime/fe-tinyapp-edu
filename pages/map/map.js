var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');

var app = getApp();
var theme = app.getTheme();
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
    campusPanelAnim: {},

    // 坐标点类型列表
    types: [],
    // 校区列表
    campus: [],
    selectedTypeIndex: 0,
    selectedCampusIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 页面初始化 options为页面跳转所带来的参数
    this.map = wx.createMapContext('map');

    var wHeight = wx.getSystemInfoSync().windowHeight;
    this.mapHeight = wHeight - 70;

    this.campusData = [];

    this.renderControls();
    this.createAnim();

    Q.all([
      this.getNavType(),
      this.getNavCampus()
    ])
    .then(function(arr) {
      that.setData({
        types: arr[0],
        campus: arr[1]
      });
      
      that.locateToCurrentCampus();
      that.getCurrentCampusSpots();
    })
    .catch(function(e) {
      wx.showToast({
        title: e.message || '接口调用失败，请稍后重试！',
      })
    });
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
  },

  getNavType: function() {
    var defer = Q.defer();
    request({
      url: APIS.GET_NAV_TYPE,
      method: 'GET',
      realSuccess: function (data) {
        defer.resolve(data);
      },
      realFail: function (msg, code) {
        defer.reject({
          code: code,
          message: msg
        });
      }
    }, false);

    return defer.promise;
  },

  getNavCampus: function () {
    var defer = Q.defer();
    request({
      url: APIS.GET_NAV_CAMPUS,
      method: 'GET',
      realSuccess: function (data) {
        defer.resolve(data);
      },
      realFail: function (msg, code) {
        defer.reject({
          code: code,
          message: msg
        });
      }
    }, false);

    return defer.promise;
  },

  getCurrentCampusSpots: function() {
    var currentIndex = this.data.selectedCampusIndex;
    var campusId = this.data.campus[currentIndex].id;
    var that = this;

    if (this.campusData[campusId]) {
      this.getCurrentTypeSpotsInCampus();
    } else {
      request({
        url: APIS.GET_NAV_SPOT_LIST,
        method: 'GET',
        data: {
          campusId: campusId
        },
        realSuccess: function (data) {
          that.campusData[campusId] = data;
          that.getCurrentTypeSpotsInCampus();
        },
        realFail: function (msg, code) {
          wx.showToast({
            title: msg
          });
        }
      }, false);
    }
  },

  getCurrentTypeSpotsInCampus: function() {
    var campusIndex = this.data.selectedCampusIndex;
    var campusId = this.data.campus[campusIndex].id
    var typeIndex = this.data.selectedTypeIndex;
    var typeId = this.data.types[typeIndex].id;
    var campusData = this.campusData[campusId];
    var filteredSpots = [];
    for (var i = 0, j = campusData.length; i < j; i++) {
      if (campusData[i].typeId == typeId) {
        filteredSpots = campusData[i].spots;
        break;
      }
    }

    var retMarkers = filteredSpots.map(function (m, i) {
      m.longitude = +m.longitude;
      m.latitude = +m.latitude;
      m.width = 30;
      m.height = 30;
      m.iconPath = theme.icMapMyLocation;
      m.id = m.id;
      return m;
    });

    this.setData({
      markers: retMarkers
    });
  },

  locateToCurrentCampus: function() {
    var currentIndex = this.data.selectedCampusIndex;
    var campus = this.data.campus[currentIndex];

    this.setData({
      centerLongitude: campus.longitude,
      centerLatitude: campus.latitude,
    });
  },

  onSelectType: function(e) {
    var index = e.currentTarget.dataset.index;
    var typeId = e.currentTarget.dataset.id;

    this.setData({
      selectedTypeIndex: index
    });
    this.getCurrentTypeSpotsInCampus();
    this.locateToCurrentCampus();
  },

  onSelectCampus: function(e) {
    var index = e.currentTarget.dataset.index;
    var typeId = e.currentTarget.dataset.id;

    this.setData({
      selectedCampusIndex: index
    });
    this.getCurrentCampusSpots();
    this.locateToCurrentCampus();
  },

  onControlTap: function(e) {
    let controlId = e.controlId;
    // 搜索？？
    if (controlId == 0) {

      // toggle线路
    } else if (controlId == 1) {
      this.map.moveToLocation();

      // 定位当前位置  
    } else if (controlId == 2) {
      //this.togglePolyline();
    }
  },

  onMarkerTap: function(e) {
    wx.navigateTo({
      url: '../spot/spot?id=' + e.markerId
    });
  }
})