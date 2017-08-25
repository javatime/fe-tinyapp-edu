//app.js
var theme = require('./themes/default.js');

App({
  onLaunch: function() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: theme.clrMain,
    })
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },

  getTheme: function() {
    return theme;
  }
})
