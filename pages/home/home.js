var api = require('../../api/api.js')
var util = require('../../utils/util.js')
var app = getApp()

var inputName = ['初次见你的时候，没想到会这样爱你', '从爱上你那天起，甜蜜变得很轻易','这个世界一点都不温柔，还好有你','你是年少的欢喜，这句话反过来也是你','我的故事，都是关于你啊']

var imgUrlsDefault = [
  { "title": "初次见你的时候，没想到会这样爱你", "imgUrl": "../../image/01.jpg" },
  { "title": "从爱上你那天起，甜蜜变得很轻易", "imgUrl": "../../image/02.jpg"},
  { "title": "这个世界一点都不温柔，还好有你", "imgUrl": "../../image/03.jpg"},
  { "title": "你是年少的欢喜，这句话反过来也是你", "imgUrl": "../../image/04.jpg"},
  { "title": "我的故事，都是关于你啊", "imgUrl": "../../image/05.jpg"},
]

var musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'


//数据可用接口返回 - 在此展示只是为了方便查看数据体
Page({
  data: {
    imgUrls: imgUrlsDefault,
    indicatorDots: true,
    autoplay: true,
    interval: 2600,
    duration: 1200,
    isPlayingMusic: true,
    music_url: musicUrl,
    isOfficial: app.globalData.isOfficial,
    icAdd: api.image + "ic_add_round.png",
    title_hint:'添加图片标题',
    editImg: api.image + "ic_edit.png",
    sharelist: [{
      url: '/image/01.jpg',
      name: '初次见你的时候，没想到会这样爱你',
    }, {
        url: '/image/02.jpg',
        name: '从爱上你那天起，甜蜜变得很轻易',
    }, {
        url: '/image/03.jpg',
        name: '这个世界一点都不温柔，还好有你',
    }, {
        url: '/image/04.jpg',
        name: '你是年少的欢喜，这句话反过来也是你',
    }, {
        url: '/image/05.jpg',
        name: '我的故事，都是关于你啊',
    }, {
        url: '/image/0813061.jpg',
      name: '想和你喝酒是假的，想醉你怀里是真的',
    }]
  },
  //生命周期函数--监听页面加载
  onLoad: function(data) {
    console.log("onLoad")
    var that = this
    wx.playBackgroundAudio({
      dataUrl: musicUrl,
        title: '',
        coverImgUrl: ''
      }),
      that.saveUser(),

      that.downLoadHomeImgs()

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isOfficial: app.globalData.isOfficial
    })
  },
  /**
   * 下载首页数据
   */
  downLoadHomeImgs: function() {
    var that = this
    wx.request({
      url: api.mobileIn,
      method: 'GET',
      header: {
        method: 'GET_HOME_IMAGES',
      },
      data: {
        openId: app.globalData.hostUserId

      },
      success: function(res) {
        if (200 == res.statusCode) {
          if (res.data.length >= 1) {
            console.log("dasdasds"+res.data.title)
            //更新数据
            that.setData({
               imgUrls: res.data,
              // imgUrls: imgUrlsDefault,
              swiperCurrentIndex: 0,
              showOrHidden: app.globalData.isShowAd == "1" ? false : true
            })
          }
        }

      },
      error: function() {

      }
    })
  },
  // 每条List点击事件
  jump: function(e) {
    // let id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: 'gridview/gridview?id=' + id,
    // })

  },
  // 图片点击放大 
  previewImg: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src  循环单个图片链接
    var imgList = e.currentTarget.dataset.effect_pic;//获取data-effect_pic   图片列表
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 删除单个模块
  // deleteItem: function (e) {
  //   let item = e.currentTarget.dataset.id
  //   this.deleteDetaiilImg(item)
  // },
  /**
  * 删除单个模块
  */
  // deleteDetaiilImg: function (item) {
  //   wx.showLoading({
  //     title: '正在删除...',
  //   })
  //   var that = this
  //   wx.request({
  //     url: api.mobileIn,
  //     method: 'GET',
  //     header: {
  //       method: 'DELETE_ITEM_IMAGES',
  //     },
  //     data: {
  //       itemJson: item,
  //       hostUserId: app.globalData.hostUserId
  //     },
  //     success: function (res) {
  //       wx.hideLoading()
  //       if (200 == res.statusCode) {
  //         if (res.data == "success") {
  //           that.downLoadHomeImgs()
  //         } else if (res.data == "notFile") {
  //           wx.showToast({
  //             title: '未找到需要删除的文件',
  //             image: '../../image/error.png'
  //           })
  //         } else if (res.data == "notYou") {
  //           wx.showToast({
  //             title: '不允许删除官方案例',
  //             image: '../../image/error.png'
  //           })
  //         }
  //       }
  //     },
  //     error: function () {
  //       wx.hideLoading()
  //     }
  //   })
  // },
  /**
   * 添加图片
   */
  addImg: function(e) {
    this.setData({
      showModal: true
    });

  },
  /**
   * 选择图片
   */
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;

        console.log(res)
        var itemId = (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5)
        imgUrlsDefault[imgUrlsDefault.length] = {
          imgUrl: `${tempFilePaths[0]}`,
          title: inputName,
          userId: app.globalData.hostUserId,
          id: itemId
        }
        console.log('imgUrlsDefault',imgUrlsDefault)
        /**
         * 上传图片
         */
        wx.uploadFile({
          url: api.mobileIn, //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ..', //若有token，此处换上你的token，没有的话省略
            'method': 'SAVE_IMAGE_HOME'
          },
          formData: {
            'id': itemId,
            'title': inputName,
            'userId': app.globalData.hostUserId,
            'host': api.host
          },
          success: function(res) {
            wx.hideLoading()
            that.downLoadHomeImgs()
            // that.setData({
            //   //将临时变量赋值给已经在data中定义好的变量
            //   imgUrls: imgUrlsDefault,
            //   swiperCurrentIndex:0
            // })
          },
          fail: function(res) {
            console.log('fail');
            wx.hideLoading()

          },
        })

      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {

  },
  /**
   * 对话框确认按钮点击事件
   */
  // onConfirm: function() {
  //   var that = this
  //   console.log('inputName', inputName)
  //   if (inputName == '') {
  //     that.setData({
  //       title_hint:'标题必填'
  //     })
  //   } else {
  //     that.hideModal();
  //     that.chooseImage();
  //   }
  // },
  /**
   * input输入框内容
   */
  inputChange: function(e) {
    // inputName = e.detail.value

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //保存用户信息
  saveUser: function() {
    wx.request({
      url: api.mobileIn,
      method: 'GET',
      header: {
        method: 'SAVE_USER',
      },
      data: {
        openId: app.globalData.openId,
        userInfo: app.globalData.userInfo

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;
    var random = Math.floor(Math.random() * 6);
    return {
      title: this.data.sharelist[random].name,
      imageUrl: this.data.sharelist[random].url,
      path: "pages/splash/splash?hostUserId=" + app.globalData.hostUserId,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },

  play: function(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      console.log('this.data.music_url', this.data.music_url)
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url,
        title: '',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})