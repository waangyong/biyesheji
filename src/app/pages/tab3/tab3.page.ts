import { Component } from '@angular/core';
import { DeviceInfoService } from 'src/app/services/utils/device-info/device-info.service';
import { ThsMapService } from 'src/app/services/utils/ths-map/ths-map.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: [ 'tab3.page.scss' ]
})
export class Tab3Page {

  mapView; // 地图视图
  constructor(public deviceInfoService: DeviceInfoService, public thsMapService: ThsMapService) {
  }

  ionViewWillEnter() {
    this.deviceInfoService.accessModule('地图');
  }

  /**
   * 地图加载完毕
   * @param map 事件对象
   */
  onMapLoaded(map) {
    this.mapView = map;
    this.thsMapService.centerAndZoom(map, 104.060002, 30.670121, 8);  // 设置当前中心点
  }

}
