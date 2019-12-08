var exec = require('cordova/exec');
module.exports = {
    /**
     *
     exec方法一共5个参数:
     第一个 :成功回调
     第二个 :失败回调
     第三个 :将要调用的对象名(在config.xml中配置,对应于feature的name属性，value就是本地实现的java类)
     第四个 :调用的方法名(java类中通过action识别方法名)
     第五个 :传递的参数（json格式）
     */
    //startNavigating ： 插件的导航方法，方法名自己取。
    //longtOrig,latOrig,longtDes,latDes：分别表示起点和终点的经纬度。
    //通过调用cordova.exec（）方法链接本地的java实现。
    get: function (successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            "BaiduLocation", "get", []);
    },
    stop: function () {
        cordova.exec(
            null,
            null,
            "BaiduLocation", "stop", []);
    }
};

