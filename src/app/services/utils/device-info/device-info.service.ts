import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { Sim } from '@ionic-native/sim/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpUtilsService } from '../http-utils/http-utils.service';

declare let navigator: any;
declare let cordova: any;
declare var KeychainUUID;

/*
 使用说明：1需要安装的插件请见最下面.
          2需要在下面修改appid,appid从应用平台获取，此变量为必须变量，并且每个app都有自己的id。
          3过滤了虚拟机，如果需要在虚拟机上测试，在下面相应代码处修改。记得调试后还原。
          4没有登录在app.components.ts中调用，有登录在登录成功后调用，需要传入用户名。调用方法deviceInfoProvider.sendDeviceInfo(用户名);
          5如发现问题请及时反馈。
*/
@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  deviceInfoUrl = 'http://182.48.115.108:8887/thsapp/app/upAppInfo.vm'; // 上传设备信息的地址
  locationUrl = 'http://182.48.115.108:8887/thsapp/app/upLocInfo.vm'; // 上传地址信息的地址
  exitUrl = 'http://182.48.115.108:8887/thsapp/app/upOnlineApp.vm'; // 退出app的地址
  moduleAccess = 'http://182.48.115.108:8887/thsapp/app/upModuleAccess.vm'; // 上传模块访问接口的地址
  appVer: string; // 应用版本
  serial: string; // 设备串号
  bundleId: string; //  应用包名
  // loginId: string; // 本次登录系统结果ID
  // loginTime: string; // 用于记录登录时间与退出时间
  loginId; // 设备信息上传成功后返回，用于位置信息上传
  sysId; // 设备信息上传成功后返回，用于位置信息上传
  carrierName: string; // 服务提供者名称
  phoneNumber: string; // 电话号码
  deviceId2: string; // 设备号
  networkType: string; // 网络类型
  simSerialNumber: string; // SIM卡序列号
  manufacturer: string; // 设备制造商
  mnc: string; // SIM卡提供商的MNC（移动网络代码）
  mcc: string; // SIM卡提供商的MCC（移动国家代码）
  resolutionRatio = ''; // 分辨率
  size = ''; // 尺寸
  appId = 'l15619750721005'; // appid(应用平台获取，这变量为必须变量，并且为每个app自己的id);

  constructor(
    private httpUtilsService: HttpUtilsService,
    private device: Device,
    private appVersion: AppVersion,
    private platform: Platform,
    private sim: Sim,
    private network: Network,
    private geolocation: Geolocation
  ) {
  }

  /**
   * 开始信息集成(app需要登录的在登录成功后调用此方法，无需登录的在app成功启动后调用此方法开始信息收集)
   * @param user 登录名
   */
  public sendDeviceInfo(user: string = '') {
    if (this.device.isVirtual) { // 是虚拟机
      return;
    }
    if (!this.appId) { // 没有appId
      return;
    }
    this.getPhoneInfo(user); // 获取尺寸信息
  }

  /**
   * 获取收集尺寸信息
   * @param user 登录名
   */
  private getPhoneInfo(user) {
    // 获取尺寸
    // tslint:disable-next-line:no-string-literal
    if (window['plugins']) {
      // tslint:disable-next-line:no-string-literal
      window['plugins'].screensize.get((result) => {
        this.resolutionRatio = result.height + '*' + result.width; // 获取分辨率
        this.size = String(result.diameter || result.scale); // 获取尺寸（diameter为安卓返回的尺寸，scale为ios返回的尺寸）
        this.getSimInfo(user); // 获取sim卡信息
      }, (error) => {
        this.getSimInfo(user); // 获取sim卡信息
      });
    }
  }

  /**
   * 获取sim卡信息
   * @param user 登录名
   */
  private getSimInfo(user) {
    // tslint:disable-next-line:no-string-literal
    if (window['plugins']) {
      // tslint:disable-next-line:no-string-literal
      window['plugins'].sim.getSimInfo((info) => {
        this.carrierName = info.carrierName || ''; // 获取服务提供者名称
        this.mcc = String(info.mcc) || ''; // 获取mcc号
        this.mnc = String(info.mnc) || ''; // 获取mnc号
        this.phoneNumber = info.cards ? info.cards[0].phoneNumber : ''; // 获取电话号码
        this.simSerialNumber = info.cards ? info.cards[0].simSerialNumber : ''; // 获取SIM卡序列号
        this.deviceId2 = info.deviceId || ''; // 获取设备号
        this.getDeviceInfo(user); // 获取设备信息
      }, (error) => {
        this.getDeviceInfo(user); // 获取设备信息
      });
    }
  }

  /**
   * 获取设备信息
   * @param user 登录名
   */
  private getDeviceInfo(user) {
    if (this.platform.is('android')) {
      this.serial = this.device.serial || ''; // 安卓返回的设备串号
    } else if (this.platform.is('ios')) {
      const args = {
        key: 'solution' // key值统一
      };

      // ios平台需要注意插件是否安装
      KeychainUUID.getDeviceID((id) => { // 获取ios的值
        console.log('成功');
        this.serial = id; // ios返回的设备串号
      }, (err) => {
        console.log(err);
      }, args);
    }

    // 获取版本号，包名等信息
    this.appVersion.getVersionNumber().then(version => {
      this.appVer = version;
      this.appVersion.getPackageName().then(data => {
        this.bundleId = data;
        const paramMap = {
          appId: this.encryptParam(this.appId), // appId在后台注册的
          packageName: this.encryptParam(this.bundleId),
          deviceId: this.encryptParam(this.serial),
          deviceMode: this.encryptParam(this.device.model) || '',
          sysVer: this.encryptParam(this.device.version) || '',
          appVer: this.encryptParam(this.appVer) || '',
          user: this.encryptParam(user) || this.encryptParam(this.serial),
          run: this.encryptParam(this.device.platform) || '',
          manufacturer: this.encryptParam(this.device.manufacturer), // 设备制造商
          carrierName: this.encryptParam(this.carrierName) || '',  // 服务提供者名称
          phoneNumber: this.encryptParam(this.phoneNumber) || '', // 电话号码
          deviceId2: this.encryptParam(this.deviceId2) || '', // 设备号
          networkType: this.encryptParam(this.network.type) || '', // 网络类型
          simSerialNumber: this.encryptParam(this.simSerialNumber) || '', // SIM卡序列号
          mnc: this.encryptParam(this.mnc) || '',
          mcc: this.encryptParam(this.mcc) || '',
          resolutionRatio: this.encryptParam(this.resolutionRatio) || '',
          size: this.encryptParam(this.size) || ''
        };

        // 上传信息到服务器
        this.httpUtilsService.get(this.deviceInfoUrl, paramMap, false, (response) => {
          console.log('设备信息', response);
          if (response.ret === 1) {
            console.log('设备信息发送成功');
            this.loginId = response.loginId; // 设备信息上传成功后返回，用于位置信息上传
            this.sysId = response.Id; // 设备信息上传成功后返回，用于位置信息上传
            this.getLocation(); // 获取定位并上传位置信息
          } else {
            console.log('设备信息发送失败', response);
          }
        });
      });

    });
  }

  /**
   * 退出登录
   */
  public signOut() {
    if (!this.loginId) {
      console.log('还没登录不算');
    } else {
      const params = {
        loginId: this.encryptParam(this.loginId),
        Id: this.encryptParam(this.sysId)
      };
      this.httpUtilsService.get(this.exitUrl, params, false, (response) => {
        if (response.ret === 1) {
          console.log('退出登录');
        } else {
          console.log('退出失败');
        }
      });
    }
  }

  /**
   * 获取当前位置信息
   */
  getLocation() {
    if (this.platform.is('android')) {
      navigator.baidulocation.get((message) => {
        const lat = message.latitude;
        const lon = message.longitude;
        if (lat !== 5e-324 && lon !== 5e-324) {
          this.sendLocationInfo(lat, lon); // 上传定位信息
        } else {
          console.log('定位失败');
        }
      });
    } else if (this.platform.is('ios')) {
      const posOptions = { enableHighAccuracy: true };
      this.geolocation.getCurrentPosition(posOptions).then((resp) => {
        const lat = resp.coords.latitude;
        const lon = resp.coords.longitude;
        // const pos = {
        //   lat: latitude,
        //   lon: longitude,
        // };
        if (lat !== 5e-324 && lat !== 5e-324) {
          this.sendLocationInfo(lat, lon); // 上传定位信息
        } else {
          console.log('定位失败');
        }
      });
    }
  }

  /**
   * 上传位置信息
   * @param latitude 纬度
   * @param longitude 经度
   */
  public sendLocationInfo(latitude, longitude) {
    const paramsRes = {
      lat: latitude,
      lon: longitude,
      loginId: this.loginId,
      deviceId: this.serial,
      id: this.sysId
    };
    this.httpUtilsService.get(this.locationUrl, paramsRes, false, (response) => {
      console.log('位置信息', response);
      if (response.ret === 1) {
        console.log('位置信息上传成功');
      } else {
        console.log('位置信息上传失败');
      }
    });
  }

  /**
   * 上传模块点击信息
   * @param moduleName 模块名称
   */
  public accessModule(moduleName) {
    moduleName = encodeURIComponent(moduleName);

    if (this.loginId) {
      const params = {
        appId: this.appId,
        appVer: this.appVer,
        module: moduleName,
        loginId: this.loginId
      };
      this.httpUtilsService.get(this.moduleAccess, params, false, (response) => {
        console.log('模块点击信息', response);
      });
    } else {
      setTimeout(() => {
        const params = {
          appId: this.appId,
          appVer: this.appVer,
          module: moduleName,
          loginId: this.loginId
        };
        this.httpUtilsService.get(this.moduleAccess, params, false, (response) => {
          console.log('模块点击信息', response);
        });
      }, 500);
    }

  }

  /**
   * AES加密方法
   * @param word 需加密的内容
   */
  private encryptParam(word) {
    if (!word || word === '') {
      return undefined;
    }
    const encKey = CryptoJS.enc.Latin1.parse('solu20180228tion');
    const encIv = CryptoJS.enc.Latin1.parse('solu20180228tion');
    return CryptoJS.AES.encrypt(word, encKey, { iv: encIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString();
  }
}

// 需要安装以下包

// 定位插件：
// ionic cordova plugin add https://github.com/apache/cordova-plugin-geolocation
// ionic cordova plugin add https://github.com/lyx383982759/cn-com-ths-baidulocation

// ionic cordova plugin add https://github.com/apache/cordova-plugin-device
// npm install --save @ionic-native/device

// ionic cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version
// npm install --save @ionic-native/app-version

// npm install crypto-js
// npm install @types/crypto-js --save-dev

// ionic cordova plugin add https://github.com/pbakondy/cordova-plugin-sim
// npm install --save @ionic-native/sim

// ionic cordova plugin add https://github.com/apache/cordova-plugin-network-information
// npm install --save @ionic-native/network

// ionic cordova plugin add cordova-plugin-android-permissions
// npm install --save @ionic-native/android-permissions

// ionic cordova plugin add https://github.com/pbakondy/cordova-plugin-screensize

// ios需要单独安装
// ionic cordova plugin add cordova-plugin-keychain-uuid

