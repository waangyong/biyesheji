import { Component, ViewChild, OnInit } from '@angular/core';
import { DeviceInfoService } from 'src/app/services/utils/device-info/device-info.service';
import { SupervisionService } from 'src/app/services/business/supervision/supervision.service';
import { HttpUtilsService } from 'src/app/services/utils/http-utils/http-utils.service';
import { ThsListComponent } from 'src/app/components/ths-list/ths-list.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page implements OnInit {
  @ViewChild(ThsListComponent, { static: true }) thsList: ThsListComponent;

  public supervisionList = []; // 监督检查列表数据
  public page = 1; // 当前页码
  public pageSize = 20; // 每页数据量
  public loadEvent;
  aliasFields = {
    time: '时间'
  };

  // 下拉或上拉事件

  constructor(
    public deviceInfoService: DeviceInfoService,
    public supervisionService: SupervisionService,
    public httpUtilsService: HttpUtilsService) {
  }

  ngOnInit() {
    this.getSupervisionList(true);
  }

  ionViewWillEnter() {
    this.deviceInfoService.accessModule('列表');
  }

  /**
   * 获取监督检查列表数据
   * @param showLoading 是否显示弹出loading
   */
  getSupervisionList(showLoading: boolean) {
    const param = {
      page: this.page,
      pageSize: this.pageSize
    };
    this.supervisionService.getSupervisionList(param, showLoading, data => {
      if (data !== 'error' && data.status === '1') {
        if (this.loadEvent && this.loadEvent.type === 'ionInfinite') {
          this.supervisionList.push(...data.data);
          // 列表数据全部加载完成后，禁止上拉加载更多事件
          if (Number(data.total) <= this.supervisionList.length) {
            // this.loadEvent.target.disabled = true;
            this.thsList.infiniteScroll.disabled = true;
          }
        } else {
          this.supervisionList = data.data || [];
        }
      } else {
        this.supervisionList = [];
        this.httpUtilsService.thsToast('数据请求异常，请稍后重试！');
      }
      // 让上拉或者下拉事件中的loading状态完成
      if (this.loadEvent) {
        this.loadEvent.target.complete();
        this.loadEvent = null;
      }
    });
  }

  /**
   * 下拉刷新列表数据
   * @param event 下拉事件
   */
  refreshList(event) {
    this.loadEvent = event;
    this.page = 1;
    this.thsList.infiniteScroll.disabled = false;
    this.getSupervisionList(false);
  }

  /**
   * 上拉加载更多
   * @param event 上拉事件
   */
  loadMoreData(event) {
    this.loadEvent = event;
    this.page++;
    this.getSupervisionList(false);
  }

  openDetail(item: {}) {
    console.log(item);
  }
}
