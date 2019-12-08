import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConfigService } from '../../config/config.service';
import { HttpUtilsService } from '../http-utils/http-utils.service';
import { AppInfoService } from '../app-info/app-info.service';
import { FileTransferService } from '../file-transfer/file-transfer.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    public platform: Platform,
    public alertController: AlertController,
    private browser: InAppBrowser,
    public httpUtils: HttpUtilsService,
    public homeService: AppInfoService,
    public config: ConfigService,
    public fileTransferService: FileTransferService,
    private appVersion: AppVersion
    ) {
  }

  /**
   * 检测版本信息
   */
  checkVersion() {
    this.homeService.getVersion({}, false, res => {
      const data = res;
      if (data && data !== 'error') {
        if (this.platform.is('android')) {
          this.updateVerison(data.verAndroid, data.androidUrl, data.apkName);
        } else if (this.platform.is('ios')) {
          this.updateVerison(data.verIos, data.iosUrl);
        }
      } else {
        console.log('获取版本信息失败!');
      }
    });
  }

  /**
   * 下载新版本app
   * @param newVserion 服务器上最新app版本号
   * @param downloadUrl 下载路径
   * @param apkName android安装包的名字
   */
  updateVerison(newVserion, downloadUrl, apkName?) {
    let ifUpdate;
    this.appVersion.getVersionNumber().then(curver => {
      this.config.curVersion = curver;
      ifUpdate = this.handleVersion(this.config.curVersion) < this.handleVersion(newVserion);
      if (ifUpdate) {
        this.platform.ready().then(() => {
          if (this.platform.is('android')) {
            this.presentAlert(newVserion, downloadUrl, apkName);
          } else {
            this.presentAlert(newVserion, downloadUrl);
          }
        });
      }
    });
  }

  /**
   * 更新提示
   * @param newVserion 服务器上最新app版本号
   * @param downloadUrl 下载路径
   * @param apkName 安装包的名字
   */
  async presentAlert(newVserion, downloadUrl, apkName?) {
    const alert = await this.alertController.create({
      header: '发现新版本,是否更新?',
      cssClass: 'update-pop',
      message: '<div class="versions">当前版本号：' + this.config.curVersion + '</div><div class="versions">待更新版本号：' + newVserion + '</div>',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('取消app更新');
          }
        },
        {
          text: '立即更新',
          handler: () => {
            if (this.platform.is('android')) {
              this.fileTransferService.downloadFile(downloadUrl, apkName, false, true);
            } else {
              console.log(downloadUrl);
              this.browser.create(downloadUrl);
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * 处理版本号(1.0.0处理为10000)
   * @param num 版本号
   */
  handleVersion(num) {
    if (num) {
      console.log('处理后的版本号', num.split('.').join('0'));
      return Number(num.split('.').join('0'));
    }
  }
}


// 需要安装的插件

// ionic cordova plugin add cordova-plugin-inappbrowser
// npm install --save @ionic-native/in-app-browser


