import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../http-utils/http-utils.service';
import { ConfigService } from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  constructor(
    public httpUtilsService: HttpUtilsService,
    public configService: ConfigService) {

  }

  /**
   * 获取版本信息
   * @param params 请求参数
   * @param showloading 是否显示加载框
   * @param callback 请求后的回调函数
   */
  getVersion(params, showloading, callback) {
    this.httpUtilsService.get(this.configService.versionUrl, params, showloading, callback);
  }
}
