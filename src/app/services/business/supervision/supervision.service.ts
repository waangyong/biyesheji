import { Injectable } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { HttpUtilsService } from '../../utils/http-utils/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {

  constructor(public configService: ConfigService, public httpUtilsService: HttpUtilsService) {
  }

  /**
   * 获取监督检查列表
   * @param params 请求参数
   * @param showloading 是否显示加载框
   * @param callback 请求后的回调函数
   */
  getSupervisionList(params, showloading, callback) {
    this.httpUtilsService.get(this.configService.URL.GETSUPVERVISIONLIST, params, showloading, callback);
  }
}
