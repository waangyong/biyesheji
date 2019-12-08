1.将plugin.xml中的“1TYGQWIA6q4Zn7cHh1qCo9as” 替换为 百度定位申请到的key

2.在项目路径下cmd中安装：
  cordova plugin add https://github.com/THS-FE/cn-com-ths-baidulocation --variable BD_AK=keyvalue

3.使用：
开启定位：navigator.baidulocation.get(function(message){alert(JSON.stringify(message))});
关闭定位：navigator.baidulocation.stop();
