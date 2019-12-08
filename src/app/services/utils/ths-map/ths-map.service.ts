import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

/**
 * 地图服务类
 * @export
 */
@Injectable()
export class ThsMapService {
  map: any;
  editToolbar: any;

  constructor() {
  }

  /**
   * 获取地图中心点
   */
  getCenter(): { x: number, y: number } {
    return this.map.geographicExtent.getCenter();
  }

  /**
   * 获取地图1/4上部的中心点
   */
  getQuarterCenter(): { x: number, y: number } {
    return {
      x: this.map.geographicExtent.getCenter().x,
      y: this.map.geographicExtent.ymax - (this.map.geographicExtent.ymax - this.map.geographicExtent.ymin) / 4
    };
  }

  /**
   * 通过中心经纬度以及缩放级别设置地图范围
   * @param x x坐标
   * @param y y坐标
   * @param level 缩放级别,不填则采用当前地图级别
   * @param [wkid=4326] 地理坐标系中的GCS_WGS_1984  Web墨卡托投影坐标 102100
   */
  centerAndZoom(x: number, y: number, level?: number, wkid: number = 4326): void {
    loadModules(['esri/geometry/Point']).then(([Point]) => {
      if (!x || !y) {
        return;
      }
      this.map.centerAndZoom(new Point({ x, y, spatialReference: { wkid } }), level);
    });
  }

  /**
   * 根据图层包含的要素定位
   * @param layerName 图层名称
   */
  setExtent(layerName: string | { graphics: {}[] }): void;

  /**
   * 通过矩形设置地图范围
   * @param xMin (必填) x最小值
   * @param yMin (必填) y最小值
   * @param xMax (必填) x最大值
   * @param yMax (必填) y最大值
   * @param [wkid=4326] 地理坐标系中的GCS_WGS_1984  102100 Web墨卡托投影坐标
   */
  setExtent(xMin: number, yMin: number, xMax: number, yMax: number, wkid: number): void;

  setExtent(xMin: number | string | { graphics: {}[] }, yMin?: number, xMax?: number, yMax?: number, wkid: number = 4326): void {
    loadModules(['esri/geometry/Extent', 'esri/graphicsUtils']).then(([Extent, graphicsUtils]) => {
      let extent;
      if (typeof (xMin) === 'string') {
        const layer = this.map.getLayer(xMin);
        if (layer !== undefined) {
          extent = graphicsUtils.graphicsExtent(layer.graphics);
        }
      } else if (typeof (xMin) === 'object') {
        extent = graphicsUtils.graphicsExtent(xMin.graphics);
      } else {
        extent = new Extent({ xmin: xMin, ymin: yMin, xmax: xMax, ymax: yMax, spatialReference: { wkid } });
      }
      this.map.setExtent(extent, true);
    });
  }

  /**
   * 添加临时图层
   * @param layerName 图层名称
   * @param clickEvent 点击事件
   * then返回graphicsLayer对象
   */
  addGraphicsLayer(layerName: string, clickEvent?: (event: any) => void): Promise<any> {
    return loadModules(['esri/layers/GraphicsLayer', 'dojo/on']).then(([GraphicsLayer, on]) => {
      const layer = this.map.getLayer(layerName);
      if (layer !== undefined) {
        return layer;
      } else {
        // 创建图形图层
        const option = {
          id: layerName
        };
        const graphicsLayer = new GraphicsLayer(option);
        this.map.addLayer(graphicsLayer);
        if (clickEvent) {
          on(graphicsLayer, 'click', clickEvent);
        }
        return graphicsLayer;
      }
    });
  }

  /**
   * 添加图片点位
   * @param x x坐标
   * @param y y坐标
   * @param graphicsLayer 图层对象
   * @param picUrl 图片路径
   * @param [picWidth=29] 图片宽度
   * @param [picHeight=37] 图片高度
   * @param [offsetX=0] 图片X轴偏移量
   * @param [offsetY=18.5] 图片Y轴偏移量 默认为0时，点位在图片的中心点，设置成高度的一半，实际点位在图片的下边缘中心
   * @param [wkid=4326] 空间参考
   * @param attribute 点位属性
   * @param infoTemplate 信息框
   */
  addMarker(x: number, y: number, graphicsLayer: any, picUrl: string, picWidth: number, picHeight: number,
            offsetX: number, offsetY: number, wkid: number, attribute?: {}, infoTemplate?: {}): Promise<any>;

  /**
   * 添加单个点
   * @param point 点对象
   */
  addMarker(point: {}): Promise<any>;

  /**
   * 添加点的数组
   * @param points 点对象数组
   */
  // tslint:disable-next-line:unified-signatures
  addMarker(points: {}[]): Promise<any>;

  /**
   * 添加图片点位
   * @param x x坐标
   * @param y y坐标
   * @param graphicsLayer 图层对象
   * @param picUrl 图片路径
   */
  addMarker(x: number, y: number, graphicsLayer: any, picUrl: string): Promise<any>;

  addMarker(x: number | {} | {}[], y?: number, graphicsLayer?: any, picUrl?: string, picWidth: number = 29,
            picHeight: number = 37, offsetX: number = 0, offsetY: number = 18.5, wkid: number = 4326,
            attributes?: {}, infoTemplate?: {}): {} {
    // TODO:直接传入对象或对象的数组生成点位
    if (x instanceof Array) {
    } else if (x instanceof Object) {

    } else {
      return loadModules(['esri/geometry/Point', 'esri/SpatialReference', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic',
        'esri/InfoTemplate']).then(([Point, SpatialReference, PictureMarkerSymbol, Graphic, InfoTemplate]) => {
        if (!x || !y) {
          return;
        }
        // 创建点
        const point = new Point(parseFloat(x.toString()), parseFloat(y.toString()), new SpatialReference({ wkid }));
        // 创建Graphic
        const pictureMarkerSymbol = new PictureMarkerSymbol(picUrl, picWidth, picHeight);
        pictureMarkerSymbol.setOffset(offsetX, offsetY);
        const graphic = new Graphic(point, pictureMarkerSymbol, attributes, infoTemplate);
        graphicsLayer.add(graphic);
        return graphic;
      });
    }
  }

  /**
   * 添加标注
   * @param x x坐标
   * @param y y坐标
   * @param graphicsLayer 图层对象
   * @param label 文字内容
   * @param labelSize 文字大小
   * @param color 颜色
   * @param offsetX x偏移量
   * @param offsetY y偏移量
   * @param wkid 空间参考
   * @param attribute 属性
   * @return Promise
   */
  addLabel(x: number, y: number, graphicsLayer: any, label: string, labelSize: number = 12, color: string = 'black', offsetX: number = 0,
           offsetY: number = 0, wkid: number = 4326, attribute?: {}): Promise<any> {
    return loadModules(['esri/geometry/Point', 'esri/SpatialReference', 'esri/graphic', 'esri/symbols/Font', 'esri/symbols/TextSymbol'])
    .then(([Point, SpatialReference, Graphic, Font, TextSymbol]) => {
      if (!x || !y) {
        return;
      }
      const point = new Point(parseFloat(x.toString()), parseFloat(y.toString()), new SpatialReference({ wkid }));
      const font = new Font(labelSize, Font.STYLE_NORMAL,
        Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, 'Microsoft YaHei');
      const textSymbol = new TextSymbol(label || '--', font, color);
      // 创建文字描述点
      const graphic = new Graphic(point, textSymbol, attribute);
      textSymbol.setOffset(offsetX, offsetY);
      // 增加文字描述点
      graphicsLayer.add(graphic);
      return graphic;
    });
  }

  /**
   * 添加圆
   * @param x x坐标
   * @param y y坐标
   * @param distance 辐射圈半径 单位：千米
   * @param layer 要添加到的图层对象
   * @return yuan
   */
  addCircle(x, y, distance, layer): Promise<any> {
    return loadModules(['esri/geometry/Point', 'esri/geometry/Circle', 'esri/symbols/SimpleFillSymbol',
      'esri/symbols/SimpleLineSymbol', 'esri/Color', 'esri/graphic'])
    .then(([Point, Circle, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic]) => {
      if (!x || !y) {
        return;
      }
      const point = new Point(x, y);
      const circleGeometry = new Circle(point, {
        radius: distance * 1000,
        geodesic: true
      });
      const sms = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([142, 229, 238]), 1), new Color([174, 238, 238, 0.25]));
      const graphic = new Graphic(circleGeometry, sms);
      layer.add(graphic);
      return graphic;
    });
  }

  /**
   * 获取图层
   * @param layerName 图层名称
   */
  getLayer(layerName: string): { visible: boolean, redraw: () => void } {
    return this.map.getLayer(layerName);
  }

  /**
   * 移除图层中的所有图形
   * @param layer 图层名或者图层对象
   */
  clearLayer(layer: string | { clear(): void; }): {} {
    if (!layer) {
      return;
    }
    if (typeof (layer) === 'string') {
      const curLayer = this.map.getLayer(layer);
      if (curLayer) {
        curLayer.clear();
      }
    } else {
      layer.clear();
    }
    return layer;
  }

  /**
   * 设置图层可见性
   * @param layer 图层名或者图层对象
   * @param visible 是否可见
   */
  setLayerVisibility(layer: string | { setVisibility(isVisible: boolean): void; }, isVisible: boolean): {} {
    if (typeof (layer) === 'string') {
      const curLayer = this.map.getLayer(layer);
      if (curLayer) {
        curLayer.setVisibility(isVisible);
      }
    } else {
      layer.setVisibility(isVisible);
    }
    return layer;
  }

  /**
   * 开启编辑
   * @param graphic 要编辑的图形
   */
  startEditor(graphic: {}): void {
    loadModules(['esri/toolbars/edit']).then(([Edit]) => {
      if (!this.editToolbar) {
        this.editToolbar = new Edit(this.map);
      }
      this.editToolbar.activate(Edit.MOVE, graphic);
      this.map.disablePan();
    });
  }

  /**
   * 停止编辑
   */
  stopEditor(): void {
    loadModules(['esri/toolbars/edit']).then(([Edit]) => {
      if (this.editToolbar) {
        this.editToolbar.deactivate();
      }
      this.map.enablePan();
    });
  }

  /**
   * 设置图层的label是否显示
   * @param layerName 图层名称
   * @param isVisible 是否显示
   */
  setLabelVisibity(layerName: string, isVisible: boolean): void {
    loadModules(['esri/symbols/TextSymbol'])
    .then(([TextSymbol]) => {
        if (this.getLayer(layerName)) {
          // @ts-ignore
          this.getLayer(layerName).graphics.filter(item => item.symbol.type === 'textsymbol').map(gra => isVisible ? gra.show() : gra.hide());
        }
      }
    );
  }

  /**
   * 注册地图级别发生改变的事件
   * @callback cb
   * @param point 点位坐标
   * @param extent 地图范围
   * @param level 缩放级别
   * @param zoomFactor 放大系数
   */
  mapLevelChanged(cb) {
    this.map.on('zoom-end', cb);
  }

  /**
   * 获取地图当前级别
   */
  getMapLevel() {
    return this.map.getLevel();
  }

}


// npm install --save esri-loader

