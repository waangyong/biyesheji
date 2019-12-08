import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular'; // 引入loading
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; //  引入请求方式

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {

  public toast: any = null;

  constructor(
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    private httpClient: HttpClient) {
  }

  /**
   * 配置GET请求方式
   * @param  url 请求地址(必传)
   * @param  params 参数(必传)
   * @param  showloading 是否显示Loading框(必传)boolean值
   * @param  callback 回调函数(必传)
   */
  async get(url, params, showloading, callback) {
    let loader = null;
    if (showloading) {
      loader = await this.presentLoading('');
    }

    this.httpClient.get(url, { responseType: 'json', params: this.httpParams(params) })
    .subscribe(
      res => {
        if (showloading) {
          this.hideLoading(loader);
        }
        if (res) {
          callback(res);
        } else {
          callback('error');
        }
      },
      err => {
        if (showloading) {
          this.hideLoading(loader);
        }
        callback('error');
      }
    );
  }

  /**
   * 发送HTTP请求post方法
   * @param url 发送请求的地址
   * @param params 发送到服务器的数据，键值对形式
   * @param showloading 是否显示数据加载
   * @param callback 回调函数
   */
  async post(url, params, showloading, callback) {
    let loader = null;
    if (showloading) {
      loader = await this.presentLoading('');
    }
    this.httpClient.post(
      url,
      params
      // this.httpParams(params),
      // this.httpOptions() // 拦截中用了header
    ).subscribe(
      res => {
        if (showloading) {
          this.hideLoading(loader);
        }
        if (res) {
          callback(res);
        } else {
          callback('error');
        }
      },
      err => {
        if (showloading) {
          this.hideLoading(loader);
        }
        callback('error');
      }
    );
  }

  /**
   * 响应头参数
   */
  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
  }

  /**
   * 参数处理
   * @param param 调用函数传过来的参数，键值对形式
   */
  httpParams(param: Map<any, any>) {
    let ret = new HttpParams();
    if (param) {
      for (const key in param) {
        if (param[key]) {
          ret = ret.set(key, param[key]);
        } else {
          ret = ret.set(key, param[key]);
        }
      }
    }
    return ret;
  }

  /**
   * toast提示框
   * @param txt 提示文字
   * @param position 位置
   */
  async thsToast(txt: string, position?) {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
    this.toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000,
      position: position ? position : 'bottom',
    });
    this.toast.present();
  }

  /**
   * showloading服务
   * @param template 展示内容(选传)
   */
  async presentLoading(template?) {
    const loader = await this.loadingController.create({
      spinner: 'circles'
    });
    await loader.present();
    return loader;
  }

  /**
   * 关闭loading
   * @param  loader 创建的loading对象
   */
  hideLoading(loader) {
    loader.dismiss();
  }


}

