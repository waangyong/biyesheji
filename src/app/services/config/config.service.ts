import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // 业务接口地址
  public URL = {
    GETSUPVERVISIONLIST: '../../../assets/data/supervisionList.json'
  };
  // 基本接口地址
  public versionUrl = 'https://thsapp.com/iOS/yxgccs/version.txt?time=' + new Date().getTime();  //  版本更新version.txt的服务器地址
  public curVersion = '1.0.0';  //  当前应用版本号
  public curLocation; // 当前位置信息
  public baiduAK = 'SbKIE831goZlA81NRpWq4ureN7Qwv9S0';  // 安装百度定位插件时的ak值，不同应用都需要修改
  public appKey = '9960d25eeec79bb4354a3aa7'; // 极光推送appKey，不同应用都需要修改

  constructor() {
  }

}
