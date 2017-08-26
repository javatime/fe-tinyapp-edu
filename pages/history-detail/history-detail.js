// pages/demo/demo-detial/demo-detial.js

// 将数据文件引入到当前文件中
var obj=require('../../data/history.js');

// var myapp=getApp();
// console.log(myapp.name);
// myapp.say();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前图书的id号
    var id=options.id;

    // 当前小说对应的数据记录
    var book=obj.list[id];

    // 绑定数据
    this.setData({
      list:book,
  
    })

    // 判断缓存中本文章是否被收藏
  
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})