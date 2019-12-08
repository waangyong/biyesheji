import { Component, Input, ViewChild, ElementRef, Output, OnInit, EventEmitter, Renderer2 } from '@angular/core';
import { loadModules } from 'esri-loader'; // 地图API装载器
import * as configData from './ths-map.data'; // 地图配置的数据
import { ThsMapService } from 'src/app/services/utils/ths-map/ths-map.service';

@Component({
  selector: 'ths-map',
  templateUrl: './ths-map.component.html',
  styleUrls: ['./ths-map.component.scss'],
})
export class ThsMapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapEl: ElementRef; // 地图控件
  @ViewChild('map_switcher', { static: true }) mapSwitcherEl: ElementRef; // 底图切换
  @ViewChild('map_home', { static: true }) mapHomeEl: ElementRef; // 回到初始位置
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onMapLoaded = new EventEmitter<any>();
  @Input() loaded: boolean;
  // 地图对象
  map: any;
  // tile信息设置
  groupLayers = [];

  constructor(private mapService: ThsMapService, private renderer: Renderer2) {
  }

  ngOnInit() {
    // 加载地图api
    const options = {
      url: 'assets/js/map/init.js'
    };
    loadModules([], options)
    .then(([]) => {
      // create map with the given options at a DOM node w/ id 'mapNode'
      this.initMap();
    })
    .catch(err => {
      // handle any script or module loading errors

    });
  }

  /**
   * 初始化地图
   */
  initMap() {
    loadModules(['esri/map', 'esri/geometry/Extent', 'esri/layers/WebTiledLayer', 'esri/layers/TileInfo'])
    .then(([Map, Extent, WebTiledLayer, TileInfo]) => {
      // 创建地图对象
      this.map = new Map(this.mapEl.nativeElement, {
        // showLabels : true,
        wrapAround180: configData.mapConfig.map.wrapAround180 === undefined ? false : configData.mapConfig.map.wrapAround180,
        logo: false,
        autoResize: true,
        fadeOnZoom: false,
        sliderPosition: (configData.mapConfig.map.sliderposition === undefined || configData.mapConfig.map.sliderposition === '') ?
          'top-left' : configData.mapConfig.map.sliderposition,
        sliderOrientation: (configData.mapConfig.map.sliderorientation === undefined || configData.mapConfig.map.sliderposition === '') ?
          'vertical' : configData.mapConfig.map.sliderorientation
      });
      if (configData.mapConfig.map.initialExtent !== undefined && configData.mapConfig.map.initialExtent !== null) {
        this.map.setExtent(new Extent(configData.mapConfig.map.initialExtent.xmin, configData.mapConfig.map.initialExtent.ymin,
          configData.mapConfig.map.initialExtent.xmax, configData.mapConfig.map.initialExtent.ymax));
      }
      const satelliteLayers = [];
      const streetsLayers = [];
      // 添加图层操作
      this.addLayersByConfig(satelliteLayers, streetsLayers).then(res => {
        if (res) {
          if (streetsLayers.length > 0) {
            this.groupLayers.push(streetsLayers);
          }
          if (satelliteLayers.length > 0) {
            this.groupLayers.push(satelliteLayers);
          }
          if (this.groupLayers.length > 0) {
            if (configData.mapConfig.map.layerSwitch) {
              this.renderer.setStyle(this.mapSwitcherEl.nativeElement, 'display', 'block');
            } else {
              this.renderer.setStyle(this.mapSwitcherEl.nativeElement, 'display', 'none');
            }
          } else {
            this.renderer.setStyle(this.mapSwitcherEl.nativeElement, 'display', 'none');
          }
          if (configData.mapConfig.map.showHome) {
            this.renderer.setStyle(this.mapHomeEl.nativeElement, 'display', 'block');
          } else {
            this.renderer.setStyle(this.mapHomeEl.nativeElement, 'display', 'block');
          }
          let mapSwitcherClass: string;
          let mapHomeClass: string;
          if (configData.mapConfig.map.sliderposition === 'top-left') {
            mapSwitcherClass = 'esriMaplayerTL';
            mapHomeClass = 'esriMapHomeTL';
          } else if (configData.mapConfig.map.sliderposition === 'top-right') {
            mapSwitcherClass = 'esriMaplayerTR';
            mapHomeClass = 'esriMapHomeTR';
          } else if (configData.mapConfig.map.sliderposition === 'bottom-left') {
            mapSwitcherClass = 'esriMaplayerBL';
            mapHomeClass = 'esriMapHomeBL';
          } else if (configData.mapConfig.map.sliderposition === 'bottom-right') {
            mapSwitcherClass = 'esriMaplayerBR';
            mapHomeClass = 'esriMapHomeBR';
          }
          this.renderer.addClass(this.mapSwitcherEl.nativeElement, mapSwitcherClass);
          this.renderer.addClass(this.mapHomeEl.nativeElement, mapHomeClass);
          this.onMapLoaded.emit(this.map);
        }
      });
    });
  }

  /**
   * 添加图层
   * @param layerOptions 图层参数
   * {
   *   label：图层ID，
   *   type：图层类型（dynamic、tiled、image、feature，baidumap、baidusatellitemap、baidulabelmap
   *   tiandimap、tiandisatellitemap、tiandilabelmap、googlemap、googlesatellitemap、googleterrainmap）
   *   visible：是否可见
   *   opacity：不透明度（0全透明，1不透明）
   * }
   */
  addLayer(layerOptions) {
    return new Promise((resolve, reject) => {
      loadModules(['esri/renderers/jsonUtils', 'esri/layers/WebTiledLayer', 'esri/layers/FeatureLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer', 'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/ArcGISImageServiceLayer', 'esri/layers/TileInfo', 'esri/symbols/TextSymbol',
        'esri/layers/LabelClass']).then(([jsonUtil, WebTiledLayer, FeatureLayer, ArcGISDynamicMapServiceLayer,
                                           ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer, TileInfo, TextSymbol, LabelClass]) => {
        let layer;
        const layerType = layerOptions.type.toLocaleLowerCase();
        // const layerType = 'google';
        const tiledInfoObj = this.getTiledInfo(layerType);
        let tileInfo = null;
        if (tiledInfoObj !== null) {
          tileInfo = new TileInfo(tiledInfoObj);
        }
        let urlTemplate = '';
        if (layerType.indexOf('baidu') >= 0) {
          // layer = new ths.layers.BaiDuLayer(layerType);//创建百度地图
          if (layerType === 'baidu') {
            urlTemplate =
              'http://online${subDomain}.map.bdimg.com/tile/?qt=tile&x=${col}&y=${row}&z=${level}&styles=pl&udt=20150421&scaler=1';
          } else if (layerType === 'baidusatellite') {
            urlTemplate =
              'http://shangetu${subDomain}.map.bdimg.com/it/u=x=${col};y=${row};z=${level};v=009;type=sate&fm=46&udt=20140929';
          } else if (layerType === 'baidusatellitelabel') {
            urlTemplate =
              'http://online${subDomain}.map.bdimg.com/tile/?qt=tile&x=${col}&y=${row}&z=${level}&styles=sl&v=068&udt=20150418';
          } else if (layerType === 'baidu3d') {
            urlTemplate = 'http://d${subDomain}.map.baidu.com/resource/mappic/bj/2/3/lv${level}/${col},${row}.jpg?v=001';
          }
          if (tileInfo !== null) {
            layer = new WebTiledLayer(urlTemplate, {
              id: layerType,
              tileInfo,
              subDomains: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            });
          } else {
            layer = new WebTiledLayer(urlTemplate, {
              id: layerType,
              subDomains: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            });
          }
        } else if (layerType.indexOf('autonavi') > -1) {
          if (layerType === 'autonavigaode') {
            // tslint:disable-next-line: max-line-length
            urlTemplate = 'http://webrd0${subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${col}&y=${row}&z=${level}';
            // "http://webrd0${subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${col}&y=${row}&z=${level}"
          } else if (layerType === 'autonaviroadlabely') {// 为影像路网（含路网，含注记）
            urlTemplate = 'http://webst0${subDomain}.is.autonavi.com/appmaptile?style=8&x=${col}&y=${row}&z=${level}';
          } else if (layerType === 'autonaviimage') {// 为影像路网（u不含路网，不含注记）
            urlTemplate = 'http://webst0${subDomain}.is.autonavi.com/appmaptile?style=6&x=${col}&y=${row}&z=${level}';
          }
          if (tileInfo != null) {
            layer = new WebTiledLayer(urlTemplate, {
              subDomains: ['1', '2', '3', '4'],
              id: layerType,
              tileInfo
            });
          } else {
            layer = new WebTiledLayer(urlTemplate, {
              subDomains: ['1', '2', '3', '4'],
              id: layerType
            });
          }
        } else if (layerType.indexOf('tianditu') >= 0) {
          if (layerType === 'tianditu2000') { // http://t3.tianditu.com/DataServer?T=cva_c&x=106&y=20&l=7
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=vec_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditusatellite2000') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=img_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tiandituterrain2000') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=ter_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditulabel2000') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=cva_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditusatellitelabel2000') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=cia_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tiandituterrainlabel2000') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=cta_c&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditumercator') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=vec_w&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditusatellitemercator') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=img_w&x=${col}&y=${row}&l=${level}';

          } else if (layerType === 'tianditulabelmercator') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=cva_w&x=${col}&y=${row}&l=${level}';
          } else if (layerType === 'tianditusatellitelabelmercator') {
            urlTemplate =
              'http://t${subDomain}.tianditu.com/DataServer?tk=d1247faa998e503d296f78c05327710a&T=cia_w&x=${col}&y=${row}&l=${level}';
          }

          if (tileInfo !== null) {
            layer = new WebTiledLayer(urlTemplate, {
              subDomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              id: layerType,
              tileInfo
            });
          } else {
            layer = new WebTiledLayer(urlTemplate, {
              subDomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              id: layerType
            });
          }

        } else if (layerType.indexOf('google') >= 0) {
          // layer = new ths.layers.GoogleMapLayer(layerType);
          if (layerType === 'google') {
            urlTemplate =
              'http://mt${subDomain}.google.cn/vt/lyrs=m@177000000' +
              '&hl=zh-CN&gl=cn&src=app&x=${col}&y=${row}&z=${level}&style=47,37%7Csmartmaps';
          } else if (layerType === 'googlesatellite') {
            urlTemplate = 'http://mt${subDomain}.google.cn/vt?lyrs=s@165&hl=zh-CN&gl=CN&src=app&x=${col}&y=${row}&z=${level}';
          } else if (layerType === 'googlesatellitelabel') {
            urlTemplate =
              'http://mt${subDomain}.google.cn/vt/imgtp=png32&lyrs=h@275000000' +
              '&hl=zh-CN&gl=CN&src=app&expIds=201527&rlbl=1&x=${col}&y=${row}&z=${level}&s=Gali';
          } else if (layerType === 'googleterrain') {
            urlTemplate =
              'http://mt${subDomain}.google.cn/vt?lyrs=t@132,r@258000000' +
              '&src=apiv3&hl=zh-CN&x=${col}&y=${row}&z=${level}&style=37%7Csmartmaps';
          }

          if (tileInfo !== null) {
            layer = new WebTiledLayer(urlTemplate, {
              id: layerType,
              tileInfo,
              subDomains: ['0', '1', '2', '3']
            });
          } else {
            layer = new WebTiledLayer(urlTemplate, {
              id: layerType,
              subDomains: ['0', '1', '2', '3']
            });
          }
        } else if (layerType === 'feature') {
          const featureLayerOptions = { outFields: '', displayOnPan: true, definitionExpression: '' };
          let renderer;
          if (layerOptions.extension !== undefined) {
            if (layerOptions.extension.outfields !== undefined && layerOptions.extension.outfields.length !== 0) {
              featureLayerOptions.outFields = layerOptions.extension.outfields;
            }
            if (layerOptions.extension.wherestring !== undefined && layerOptions.extension.wherestring !== '') {
              featureLayerOptions.definitionExpression = layerOptions.extension.wherestring;
              // layer.setDefinitionExpression(layerOptions.extension.wherestring);
            }
            if (layerOptions.extension.renderer) {
              renderer = jsonUtil.fromJson(layerOptions.extension.renderer);
            }
          }
          // featureLayerOptions.mode=esri.layers.FeatureLayer.MODE_ONDEMAND;
          featureLayerOptions.displayOnPan = false;
          //            featureLayerOptions.showLabels = true;
          //            let featureLayer=new FeatureLayer;
          layer = new FeatureLayer(layerOptions.url, featureLayerOptions);
          if (renderer) {
            layer.setRenderer(renderer);
          }
          layer.setScaleRange(0, 0);
          const statesLabel = new TextSymbol().setColor('#333');
          statesLabel.font.setSize('10pt');
          statesLabel.font.setFamily('arial');

          const json = {
            labelExpressionInfo: { value: '{NAME}' }
          };
          const labelClass = new LabelClass(json);
          labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json
          layer.setLabelingInfo([labelClass]);
          layer.on('update-end', (data) => {

          });
          layer.on('update-start', (data) => {

          });
        } else if (layerType === 'dynamic') {
          layer = new ArcGISDynamicMapServiceLayer(layerOptions.url);
          if (layerOptions.visiblelayers !== undefined && layerOptions.visiblelayers.length !== 0) {
            layer.setVisibleLayers(layerOptions.visiblelayers);
          }

        } else if (layerType === 'tiled') {
          layer = new ArcGISTiledMapServiceLayer(layerOptions.url);
        } else if (layerType === 'image') {
          layer = new ArcGISImageServiceLayer(layerOptions.url);
        }
        if (layer === null) {
          alert('图层加载错误，请检查相应参数');
        }
        layer.id = layerOptions.label;
        layer.visible = layerOptions.visible !== undefined ? layerOptions.visible : true;
        layer.opacity = layerOptions.opacity !== undefined ? layerOptions.opacity : 1.0;
        layer.minScale = layerOptions.minScale !== undefined ? layerOptions.minScale : 0;
        layer.maxScale = layerOptions.maxScale !== undefined ? layerOptions.maxScale : 0;
        if (this.map == null) {
          alert('地图控件尚未加载!');
        }
        this.map.addLayer(layer);
        resolve(layer);
      });
    });
  }

  /**
   * 根据配置添加所有图层
   * @param  streetsLayers 图层
   * @param  satelliteLayers 图层
   * @memberOf ThsMap
   */
  addLayersByConfig(streetsLayers, satelliteLayers) {
    return new Promise((resolve, reject) => {
      for (let baseLayer = 0; baseLayer < configData.mapConfig.map.baseMaps.length; baseLayer++) {
        this.addLayer(configData.mapConfig.map.baseMaps[baseLayer]).then(mlayler => {
          const layler = mlayler;
          const groupId = configData.mapConfig.map.baseMaps[baseLayer].groupId;
          if (groupId !== undefined && groupId !== null) {
            for (const index in groupId) {
              if (groupId[index] === 0) {
                streetsLayers.push(layler);
              } else if (groupId[index] === 1) {
                satelliteLayers.push(layler);
              }
              // let id = groupId[index];
              // if (id === 0) {
              //   streetsLayers.push(layler);
              // } else if (id === 1) {
              //   satelliteLayers.push(layler);
              // }
            }
          }
          if (baseLayer === configData.mapConfig.map.baseMaps.length - 1) {
            resolve(true);
          }
        });

      }
    });
  }

  /**
   * 改变底图图层显示状态
   * @memberOf ThsMap
   */
  changeBaseMapLayerVisibility() {
    const groupLayer0 = this.groupLayers[0];
    const groupLayer1 = this.groupLayers[1];
    if (groupLayer0[0].visible === true) {
      for (let index = 0; groupLayer0 !== undefined && index < groupLayer0.length; index++) {
        groupLayer0[index].hide();
      }
      for (let index = 0; groupLayer1 !== undefined && index < groupLayer1.length; index++) {
        groupLayer1[index].show();
      }
    } else {
      for (let index = 0; groupLayer1 !== undefined && index < groupLayer1.length; index++) {
        groupLayer1[index].hide();
      }
      for (let index = 0; groupLayer0 !== undefined && index < groupLayer0.length; index++) {
        groupLayer0[index].show();
      }
    }
  }

  /**
   * 定位到地图初始位置
   * @memberOf ThsMap
   */
  zoomToInitialExtent() {
    loadModules(['esri/geometry/Extent']).then(([Extent]) => {
      this.map.setExtent(new Extent(configData.mapConfig.map.initialExtent.xmin,
        configData.mapConfig.map.initialExtent.ymin, configData.mapConfig.map.initialExtent.xmax,
        configData.mapConfig.map.initialExtent.ymax));
    });
  }

  /**
   * 根据图层类型，获取不同的tiledInfo信息
   */
  getTiledInfo(layerType: string) {
    let tileInfoObj = null;
    // 天地图
    if (layerType.indexOf('tianditu') !== -1) {
      // 天地图2000
      if (layerType.indexOf('2000') !== -1) {
        tileInfoObj = configData.tdtTileInfo2000;
      } else {
        tileInfoObj = configData.tdtTileInfo;
      }
    } else if (layerType.indexOf('baidu') !== -1) {
      tileInfoObj = configData.baiduTileInfo;  // 百度地图
    } else if (layerType.indexOf('google') !== -1) {
      tileInfoObj = configData.googleTileInfo; // 谷歌地图
    }
    return tileInfoObj;
  }
}
