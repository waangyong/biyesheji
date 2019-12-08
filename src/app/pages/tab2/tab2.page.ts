import { Component } from '@angular/core';
import { DeviceInfoService } from 'src/app/services/utils/device-info/device-info.service';
import { FileTransferService } from 'src/app/services/utils/file-transfer/file-transfer.service';
import { ThsLocationService } from 'src/app/services/utils/ths-location/ths-location.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: [ 'tab2.page.scss' ]
})
export class Tab2Page {

  public curLocation = {
    latitude: null, // 当前纬度
    longitude: null, // 当前经度
    city: '', // 当前城市
    district: '', //  当前区县
    address: '' // 当前位置
  }; // 当前位置信息
  constructor(
    public deviceInfoService: DeviceInfoService,
    public thsLocationService: ThsLocationService,
    public configService: ConfigService,
    public fileTransferService: FileTransferService) {
  }

  ionViewWillEnter() {
    this.deviceInfoService.accessModule('Tab Two');
  }

  /**
   * 上传图片示例
   */
  uploadImg() {
    const path = '/storage/emulated/0/123456.jpg'; // 图片的本地路径，测试用
    // tslint:disable-next-line:max-line-length
    const url = 'http://192.168.0.31:9090/bjradiation/app/attach/uploadSignature.app';
    const params = {
      fileKey: 'file',
      fileName: '123456.png',
      fileId: '128hbhal76623fg',
      businessId: 'fbfd04cdf9404490a8b4abe191b9b3a8',
      inputFileId: 'jszfzr',
      // tslint:disable-next-line:max-line-length
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBjb2RlIjoiYmpyYWRpYXRpb24iLCJpYXQiOjE1NjIxMjMzMDczNDYsImV4dCI6MTU2MjE5ODQwNTQ1OCwibG9naW5Vc2VyIjp7InVzZXJJZCI6IjdmMTI5YTYzLTEzNjYtNGNkZi1hNzNjLTkwZjExM2I4MWI3NiIsInVzZXJOYW1lIjoi6ZmI5Lic5YW1IiwibG9naW5OYW1lIjoiY2RiIiwic3RhcnREYXRlIjoiTW9uIE1hciAxOCAwMDowMDowMCBDU1QgMjAxOSIsImVuZERhdGUiOiJUaHUgSmFuIDAxIDAwOjAwOjAwIENTVCAyMDk5IiwibG9zZURhdGUiOiJUdWUgSnVsIDAyIDAwOjAwOjAwIENTVCAyMDE5Iiwic3RhdHVzIjoxMCwiZ2VuZGVyIjoxLCJiaXJ0aGRheSI6bnVsbCwicGhvbmUiOm51bGwsIm1vYmlsZSI6bnVsbCwiZW1haWwiOm51bGwsInNvcnQiOm51bGwsImNhX2NvZGUiOm51bGwsInNraW4iOiIxIiwiZXh0MSI6IjExMCIsImV4dDIiOm51bGwsImV4dDMiOm51bGwsImV4dDQiOm51bGwsImNyZWF0ZURhdGUiOiJNb24gTWFyIDE4IDAwOjAwOjAwIENTVCAyMDE5IiwiY3JlYXRlVXNlciI6ImFkbWluIiwibW9kaWZ5RGF0ZSI6IlR1ZSBKdWwgMDIgMDA6MDA6MDAgQ1NUIDIwMTkiLCJtb2RpZnlVc2VyIjoiYWRtaW4iLCJkZXB0SWQiOiIxY2U3ODM5My1kM2Q1LTRhYzgtODk3Yy01ZDRmMGU2Zjc5ODEiLCJvcmdJZCI6InJvb3QiLCJkZXB0TmFtZSI6IuaUvuW6n-S4reW_gyIsIkxvZ2luVGltZSI6IldlZCBKdWwgMDMgMTE6MDc6NTYgQ1NUIDIwMTkiLCJpcCI6IjE5Mi4xNjguMC4zMSIsInJvbGVJZCI6IjA4NDZlMDJjLTAxZDMtNDFjNi05ZjMyLThlYTY2YWQ2YmEzMyw0YjQzNTRjNi1kMGFlLTQ2NTgtOWViNy0yNzE1Nzk0MzczM2QsYzZhNjFlNzEtNWViYi00ZjljLThlNTEtMmRkMzQ0NGZmYTBlIiwicm9sZUNvZGUiOiJ6cmFkbWluLGpicmFkbWluLHhjamNhZG1pbiIsImxvZ2luU2lnbiI6MCwicmVnaW9uQ29kZSI6IjExMDAwMDAwMDAwMCIsInJlZ2lvbk5hbWUiOiLljJfkuqzluIIifX0.wL4ZkaiFH8Brl6fzU5BqOUUefaIcTuijgp9RGH_kYsI`
    };

    // 参数url,path,params均与具体业务有关，以上只是示例
    this.fileTransferService.fileUpload(url, path, params, res => {
      console.log(res);
    });
  }

  /**
   * 获取当前位置
   */
  getLocation() {
    this.thsLocationService.startLocation().then(res => {
      this.curLocation = this.configService.curLocation = res;
      console.log('当前位置', this.configService.curLocation);
    });
  }
}
