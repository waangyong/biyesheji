import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DeviceInfoService } from './services/utils/device-info/device-info.service';
import { ConfigService } from './services/config/config.service';
// import { JPush } from '@jiguang-ionic/jpush/ngx';
import { AppUpdateService } from './services/utils/app-update/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public configService: ConfigService,
    public deviceInfoService: DeviceInfoService,
    public appUpdateService: AppUpdateService,
    // public jpush: JPush
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.splashScreen.hide();

      // 极光推送
      // this.jpush.init();
      // this.jpush.setDebugMode(true);

      // 检测app版本是否有更新
      this.appUpdateService.checkVersion();

      // 调用信息集成方法
      this.deviceInfoService.sendDeviceInfo();
    });
  }
}
