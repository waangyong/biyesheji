import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { HttpUtilsService } from '../http-utils/http-utils.service';

/*
  请求拦截器，设置了默认超时时间以及提示信息，也可以在这里进行接口公共参数或者数据的处理.
*/
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  public constructor(
    public toastController: ToastController,
    public httpUtilsService: HttpUtilsService
  ) {
  }

  defaultTimeout = 8000; // 默认设置超时时间
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 从接口参数中获取请求的超时时间，如果不存在，则使用默认的超时时间
    const timevalue = Number(req.headers.get('timeout')) || this.defaultTimeout;
    const authReq = req.clone({
      headers: req.headers.set('Content-type', 'application/x-www-form-urlencoded;charset=utf-8').delete('timeout'),
      // params: req.params.set('token', this.configProvider.token) // 如果需要配置token或者其他公共参数 在此进行配置
    }); // 新增行
    // throw new Error('Method not implemented.');
    return next.handle(authReq).pipe(
      timeout(timevalue),
      catchError(e => {
        if (e.name === 'TimeoutError') {// 可根据业务需求，修改提示文字
          this.httpUtilsService.thsToast('请求超时!');
        }
        return throwError(e);
      }));
  }
}

export const HttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  multi: true
};
