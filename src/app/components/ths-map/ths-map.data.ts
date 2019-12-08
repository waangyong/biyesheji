export const mapConfig = {
  map: {
    wrapAround180: false,
    sliderposition: 'bottom-right',
    layerSwitch: true,
    showHome: true,
    sliderorientation: 'vertical',
    initialExtent: {
      xmin: 101.61245693513751,
      ymin: 29.740572463946305,
      xmax: 106.46668283006407,
      ymax: 32.01948953684814
    },
    baseMaps: [
      {
        label: '普通',
        type: 'tianditumercator',
        visible: true,
        groupId: [1]
      },

      {
        label: '影像',
        type: 'tianditusatellitemercator',
        visible: false,
        groupId: [0]
      },

      {
        label: '普通标注',
        type: 'tianditulabelmercator',
        visible: true,
        groupId: [1]
      },
      {
        label: '影像标注',
        type: 'tianditusatellitelabelmercator',
        visible: false,
        groupId: [0]
      }

      // {
      //   'label': '沱江流域',
      //   'type': 'dynamic',
      //   'visible': false,
      //   'url': 'http://182.148.109.15:6080/arcgis/rest/services/沱江流域1/MapServer',
      //   'groupId': [1]
      // }
      // {
      //   'label': '沱江支流',
      //   'type': 'dynamic',
      //   'visible': true,
      //   'url': 'http://119.253.32.7:8887/arcgis/rest/services/沱江支流/MapServer',
      //   'groupId': [1]
      // }

      // {
      //   "label": "高德矢量图",
      //   "type": "autonavigaode",
      //   "visible": true,
      //   "groupId": [1]
      // },
      // {
      //   "label": "影像",
      //   "type": "autonaviimage",
      //   "visible": false,
      //   "groupId": [0]
      // },

      // {
      //   "label": "影像标注",
      //   "type": "autonaviRoadLabely",
      //   "visible": false,
      //   "groupId": [0]
      // }

    ]
  },
  geometryService: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'
};
/**
 * 天地图TileInfo
 */
export const tdtTileInfo = {
  dpi: 96,
  rows: 256,
  cols: 256,
  origin: { x: -2.0037508342787E7, y: 2.0037508342787E7 },
  spatialReference: { wkid: 102100 },
  lods: [{ level: 0, resolution: 156543.033928, scale: 5.91657527591555E8 }, {
    level: 1,
    resolution: 78271.5169639999,
    scale: 2.95828763795777E8
  }, { level: 2, resolution: 39135.7584820001, scale: 1.47914381897889E8 },
    { level: 3, resolution: 19567.8792409999, scale: 7.3957190948944E7 }, {
      level: 4,
      resolution: 9783.93962049996,
      scale: 3.6978595474472E7
    }, { level: 5, resolution: 4891.96981024998, scale: 1.8489297737236E7 }, {
      level: 6,
      resolution: 2445.98490512499,
      scale: 9244648.868618
    },
    { level: 7, resolution: 1222.99245256249, scale: 4622324.434309 }, {
      level: 8,
      resolution: 611.49622628138,
      scale: 2311162.217155
    }, { level: 9, resolution: 305.748113140558, scale: 1155581.108577 }, {
      level: 10,
      resolution: 152.874056570411,
      scale: 577790.554289
    }, {
      level: 11, resolution: 76.4370282850732,
      scale: 288895.277144
    }, { level: 12, resolution: 38.2185141425366, scale: 144447.638572 }, {
      level: 13,
      resolution: 19.1092570712683,
      scale: 72223.819286
    }, { level: 14, resolution: 9.55462853563415, scale: 36111.909643 }, {
      level: 15,
      resolution: 4.77731426794937,
      scale: 18055.954822
    }, { level: 16, resolution: 2.38865713397468, scale: 9027.977411 }, {
      level: 17,
      resolution: 1.19432856685505,
      scale: 4513.988705
    }, { level: 18, resolution: 0.597164283559817, scale: 2256.994353 }
  ]
};
/**
 * 天地图2000TileInfo
 */
export const tdtTileInfo2000 = {
  dpi: '90.71428571427429',
  format: 'image/png',
  compressionQuality: 0,
  spatialReference: { wkid: 4326 },
  rows: 256,
  cols: 256,
  origin: { x: -180, y: 90 },
  lods: [
    { level: 1, scale: 2.958293554545656E8, resolution: 0.703125 },
    { level: 2, scale: 1.479146777272828E8, resolution: 0.351563 },
    { level: 3, scale: 7.39573388636414E7, resolution: 0.175781 },
    { level: 4, scale: 3.69786694318207E7, resolution: 0.0878906 },
    { level: 5, scale: 1.848933471591035E7, resolution: 0.0439453 },
    { level: 6, scale: 9244667.357955175, resolution: 0.0219727 },
    { level: 7, scale: 4622333.678977588, resolution: 0.0109863 },
    { level: 8, scale: 2311166.839488794, resolution: 0.00549316 },
    { level: 9, scale: 1155583.419744397, resolution: 0.00274658 },
    { level: 10, scale: 577791.7098721985, resolution: 0.00137329 },
    { level: 11, scale: 288895.85493609926, resolution: 0.000686646 },
    { level: 12, scale: 144447.92746804963, resolution: 0.000343323 },
    { level: 13, scale: 72223.96373402482, resolution: 0.000171661 },
    { level: 14, scale: 36111.98186701241, resolution: 8.58307e-05 },
    { level: 15, scale: 18055.990933506204, resolution: 4.29153e-05 },
    { level: 16, scale: 9027.995466753102, resolution: 2.14577e-05 },
    { level: 17, scale: 4513.997733376551, resolution: 1.07289e-05 },
    { level: 18, scale: 2256.998866688275, resolution: 5.36445e-06 }
  ]
};
/**
 * google地图TileInfo信息
 */
export const googleTileInfo = {
  dpi: '90.71428571427429',
  format: 'image/png',
  compressionQuality: 0,
  spatialReference: { wkid: '102113' },
  rows: 256,
  cols: 256,
  origin: { x: -20037508.342787, y: 20037508.342787 },
  lods: [
    { level: 0, scale: 591657527.591555, resolution: 156543.033928 },
    { level: 1, scale: 295828763.795777, resolution: 78271.5169639999 },
    { level: 2, scale: 147914381.897889, resolution: 39135.7584820001 },
    { level: 3, scale: 73957190.948944, resolution: 19567.8792409999 },
    { level: 4, scale: 36978595.474472, resolution: 9783.93962049996 },
    { level: 5, scale: 18489297.737236, resolution: 4891.96981024998 },
    { level: 6, scale: 9244648.868618, resolution: 2445.98490512499 },
    { level: 7, scale: 4622324.434309, resolution: 1222.99245256249 },
    { level: 8, scale: 2311162.217155, resolution: 611.49622628138 },
    { level: 9, scale: 1155581.108577, resolution: 305.748113140558 },
    { level: 10, scale: 577790.554289, resolution: 152.874056570411 },
    { level: 11, scale: 288895.277144, resolution: 76.4370282850732 },
    { level: 12, scale: 144447.638572, resolution: 38.2185141425366 },
    { level: 13, scale: 72223.819286, resolution: 19.1092570712683 },
    { level: 14, scale: 36111.909643, resolution: 9.55462853563415 },
    { level: 15, scale: 18055.954822, resolution: 4.77731426794937 },
    { level: 16, scale: 9027.977411, resolution: 2.38865713397468 },
    { level: 17, scale: 4513.988705, resolution: 1.19432856685505 },
    { level: 18, scale: 2256.994353, resolution: 0.597164283559817 },
    { level: 19, scale: 1128.497176, resolution: 0.298582141647617 }
  ]
};
/**
 * 百度地图tileInfo信息
 */
export const baiduTileInfo = {
  rows: 256,
  cols: 256,
  compressionQuality: 0,
  origin: { x: -20037508.3427892, y: 20037508.3427892 },
  spatialReference: { wkid: 102100 },
  lods: [
    { level: 0, resolution: 156543.033928, scale: 5.91657527591555E8 },
    { level: 1, resolution: 78271.5169639999, scale: 2.95828763795777E8 },
    { level: 2, resolution: 39135.7584820001, scale: 1.47914381897889E8 },
    { level: 3, resolution: 19567.8792409999, scale: 7.3957190948944E7 },
    { level: 4, resolution: 9783.93962049996, scale: 3.6978595474472E7 },
    { level: 5, resolution: 4891.96981024998, scale: 1.8489297737236E7 },
    { level: 6, resolution: 2445.98490512499, scale: 9244648.868618 },
    { level: 7, resolution: 1222.99245256249, scale: 4622324.434309 },
    { level: 8, resolution: 611.49622628138, scale: 2311162.217155 },
    { level: 9, resolution: 305.748113140558, scale: 1155581.108577 },
    { level: 10, resolution: 152.874056570411, scale: 577790.554289 },
    { level: 11, resolution: 76.4370282850732, scale: 288895.277144 },
    { level: 12, resolution: 38.2185141425366, scale: 144447.638572 },
    { level: 13, resolution: 19.1092570712683, scale: 72223.819286 },
    { level: 14, resolution: 9.55462853563415, scale: 36111.909643 },
    { level: 15, resolution: 4.77731426794937, scale: 18055.954822 },
    { level: 16, resolution: 2.38865713397468, scale: 9027.977411 },
    { level: 17, resolution: 1.19432856685505, scale: 4513.988705 },
    { level: 18, resolution: 0.597164283559817, scale: 2256.994353 },
    { level: 19, resolution: 0.298582141647617, scale: 1128.497176 }
  ]
};
