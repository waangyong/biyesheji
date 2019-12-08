import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HttpUtilsService } from '../http-utils/http-utils.service';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {

  public alertPop;

  constructor(
    public fileTransfer: FileTransfer,
    public file: File,
    public fileOpener: FileOpener,
    public alertController: AlertController,
    public httpUtilsService: HttpUtilsService,
    public platform: Platform,
  ) {

  }

  /**
   * 获取存放附件的基础路径
   */
  getFileBasePath() {
    if (this.platform.is('android')) {
      return this.file.externalDataDirectory;
    } else if (this.platform.is('ios')) {
      return this.file.dataDirectory;
    }
  }

  /**
   * 检查文件是否存在
   * @param fileName 文件名称
   * @param filePath 文件本地路径
   * @param callback 回调函数
   */
  checkFileExitStatus(fileName, filePath, callback) {
    this.file.checkFile(filePath, fileName)
    .then(() => {
      callback(true);
    }).catch(err => {
      callback(false);
    });
  }


  /**
   * 是否打开文件提示框
   * @param filePath 文件本地路径
   * @param fileMimeType 文件媒体类型
   */
  async openFilePop(filePath, fileMimeType, msg = '打开文件？') {
    const alert = await this.alertController.create({
      message: msg,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消打开文件');
          }
        }, {
          text: '打开',
          handler: () => {
            this.openFile(filePath, fileMimeType);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * 打开文件
   * @param filePath 文件本地路径
   * @param fileMimeType 文件媒体类型
   */
  openFile(filePath, fileMimeType) {
    this.fileOpener.open(filePath, fileMimeType).then(
      () => {
        console.log('文件打开成功！');
      }).catch(e => {
        this.httpUtilsService.thsToast('文件打开失败，请重试!');
      }
    );
  }


  /**
   * 文件上传
   * @param url 文件上传的服务器地址
   * @param fllePath 文件在本地存放的路径
   * @param fileParams 文件上传时带的参数
   * @param callback 回调函数
   */
  fileUpload(url, fllePath, fileParams, callback) {
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const options: FileUploadOptions = {
      fileKey: fileParams.fileKey,
      fileName: fileParams.fileName,
      httpMethod: 'post',
      headers: {},
      params: fileParams
    };
    fileTransfer.upload(fllePath, url, options)
    .then((res) => {
      callback(res);
    }, (err) => {
      console.log(err);
      callback('error');
    });
  }

  /**
   * 下载文件
   * @param fileTransfer 当前文件传输对象
   * @param url 下载地址
   * @param filePath 文件下载后的本地存放路径
   * @param callback 回调函数
   */
  fileDownload(fileTransfer, url, filePath, callback) {
    fileTransfer.download(url, filePath, false).then((res) => {
      callback('成功');
    }).catch(e => {
      console.log('e', e);
      callback('错误');
    });
    this.calProgress(fileTransfer);
  }


  /**
   * 检查文件是否存在并下载
   * @param url 下载地址
   * @param fileName 文件名称
   * @param ifCheckExist 是否需要检查本地存在与否(true/false)
   * @param ifOpenNow 下载后的文件是否需要直接打开(true/false)
   */
  async downloadFile(url, fileName, ifCheckExist, ifOpenNow) {

    const filePath = this.getFileBasePath() + fileName;
    const mimeType = this.getFileMimeType(fileName);
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    this.createProgressPop();

    // 判断是否需要检查文件是否存在(app安装包不检查文件是否存在)
    if (ifCheckExist) {
      this.checkFileExitStatus(fileName, filePath, res => {
        if (res) {
          this.openFilePop(filePath, mimeType, '文件已存在,是否现在打开？');
        } else {
          this.fileDownload(fileTransfer, url, filePath, data => {
            console.log('文件下载', data);
            this.closeProgressPop();
            if (data === '成功') {
              if (ifOpenNow) {
                this.openFile(filePath, mimeType);
              } else {
                this.openFilePop(filePath, mimeType, '文件下载完成，是否现在打开？');
              }
            } else {
              this.httpUtilsService.thsToast('下载失败，请稍后重试！');
            }
          });
        }
      });
    } else {
      this.fileDownload(fileTransfer, url, filePath, data => {
        console.log('文件下载', data);
        this.closeProgressPop();
        if (data === '成功') {
          if (ifOpenNow) {
            this.openFile(filePath, mimeType);
          } else {
            this.openFilePop(filePath, mimeType, '文件下载完成，是否现在打开？');
          }
        } else {
          this.httpUtilsService.thsToast('下载失败，请稍后重试！');
        }
      });
    }

  }

  /**
   * 初始化下载进度框
   */
  async createProgressPop() {
    this.alertPop = await this.alertController.create({
      message: '<p class="title">正在下载，请稍等...</p><div class="progress"><span class="blue"></span></div><p class="downed">已经下载：0%</p>',
      backdropDismiss: false
    });
    await this.alertPop.present();
  }


  /**
   * 关闭下载进度框
   */
  closeProgressPop() {
    if (this.alertPop) {
      this.alertPop.dismiss();
      this.alertPop = null;
    }
  }

  /**
   * 计算文件下载进度
   */
  calProgress(fileTransfer) {
    fileTransfer.onProgress((event: ProgressEvent) => {
      let num: any;
      num = Math.floor(event.loaded / event.total * 100);
      if (num >= 100) {
        this.closeProgressPop();
      } else if (event.loaded > 0 && event.total) {
        const progress = document.getElementsByClassName('blue')[0];
        if (progress) {
          // tslint:disable-next-line:no-string-literal
          progress['style'].display = 'block';
          // tslint:disable-next-line:no-string-literal
          progress['style'].width = num + '%';
        }
        const downed = document.getElementsByClassName('downed')[0];
        if (downed) {
          downed.innerHTML = '已完成：' + num + '%';
        }
      }
    });
  }


  /**
   * 根据文件名称截取文件后缀名
   * @param fileName 文件名
   */
  getFileSuffix(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
  }

  /**
   * 根据文件名称获取文件媒体类型
   * @param fileName 文件名称
   */
  getFileMimeType(fileName: string) {
    const fileSuffix = this.getFileSuffix(fileName);
    let mimeType = '';
    switch (fileSuffix) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'apk':
        mimeType = 'application/vnd.android.package-archive';
        break;
      default:
        mimeType = 'application/' + fileSuffix;
        break;
    }
    return mimeType;
  }

}

// 需安装的插件
// ionic cordova plugin add cordova-plugin-file
// npm install --save @ionic-native/file

// ionic cordova plugin add cordova-plugin-file-transfer
// npm install --save @ionic-native/file-transfer

// ionic cordova plugin add https://github.com/lyx383982759/cordova-plugin-file-opener2
// npm install --save @ionic-native/file-opener
