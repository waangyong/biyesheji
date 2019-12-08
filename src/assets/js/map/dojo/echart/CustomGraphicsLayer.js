define([
    "dojo/_base/declare",
    "dojo/on",
    "dojo/dom-construct",
    "esri/layers/GraphicsLayer",
    "./CustomGraphic",
    "esri/geometry/screenUtils"
], function (declare,
             on,
             domConstruct,
             GraphicsLayer,
             DivGraphic, screenUtils) {
    return declare([GraphicsLayer], {
        constructor: function (options) {
            this.id = options.id || "";
            this.tipEvent = options.tipEvent || "click";
            this.zindex = options.zindex || 100;
            if (!dojo.byId(this.id)) {
                if (options.type == "chart") {
                    //domConstruct.create('div', {id: this.id}, dojo.byId("map_root"));
                    domConstruct.create('div', {id: this.id},map.childNodes[0].childNodes[0]);//根据页面布局来查找【ps:带root的标识】
                }
                else {
                    var div = domConstruct.create('div', {id: this.id});
                    var svg = dojo.byId("map_layers");
                    svg.parentNode.insertBefore(div, svg);
                }
            }
        },

        panFlag: false,
        // 重构esri/layers/GraphicsLayer方法
        _setMap: function (map, surface) {
            // GraphicsLayer will add its own listener here
            var div = this.inherited(arguments);
            return div;
        },
        _unsetMap: function (a) {
            this.inherited(arguments);
        },
        hide: function () {
            var _thisGraphic = this.graphics;
            var length = _thisGraphic.length;
            for (var i = 0; i < length; i++) {
                if (_thisGraphic[i].parentDiv) {
                    dojo.style(_thisGraphic[i].parentDiv, {
                        "display": "none"
                    });
                }
            }
        },
        show: function () {
            var length = this.graphics.length;
            var _thisGraphic = this.graphics;
            for (var i = 0; i < length; i++) {
                if (_thisGraphic[i].parentDiv) {
                    dojo.style(_thisGraphic[i].parentDiv, {
                        "display": ""
                    });
                }
            }
        },
        _onPanHandler: function (a, c) {
            this.panFlag = true;
            this.inherited(arguments);
            this._refresh(true, false, a);
        },
        //缩放
        _onZoomStartHandler: function () {
            this.hide();
        }
        ,
        clear: function () {//clearChartDiv
            this.inherited(arguments);
            //清空html div
            dojo.byId(this.id+"_layer").innerHTML = "";
            dojo.byId(this.id).innerText = "";
            if (dojo.byId("popupDiv")) {
                dojo.byId("popupDiv").innerHTML = "";
            }

        }
        ,
        _onPanEndUpdateHandler: function () {
        },
        redraw: function () {
        },
        refresh: function () {

        }, _onPanEndHandler: function () {
        },
        _onExtentChangeHandler: function (delta, extent, levelChange, lod) {
            this.panFlag = false;
            this._refresh(true, levelChange);
        }
        ,
        _refresh: function (redrawFlag, zoomFlag, a) {
            var that = this;
            var gs = this.graphics,
                _draw = this._draw;
            for (var i = 0; i < gs.length; i++) {
                _draw(gs[i], redrawFlag, zoomFlag, a);
            }
            //this.show();
        }
        ,
        _draw: function (graphic, redrawFlag, zoomFlag, a) {
            if (!this._map) {
                return;
            }
            // if (graphic instanceof DivGraphic) {
            this._drawChart(graphic, redrawFlag, zoomFlag, a);
            // }
        }
        ,
        _drawChart: function (graphic, redrawFlag, zoomFlag, a) {
            if (!graphic) {
                return;
            }
            if (zoomFlag && graphic.parentDiv) {
                dojo.byId(this.id).removeChild(graphic.parentDiv);
            }
            if (graphic.visible && graphic.geometry) {
                var _gExtent = graphic.geometry.getExtent();
                var _gScrCenter;
                if (_gExtent == null) {
                    if (this.panFlag) {
                        _gScrCenter = screenUtils.toScreenPoint(a, map.width, map.height, graphic.geometry) //map.toScreen(graphic.geometry);
                    } else
                        _gScrCenter = this._map.toScreen(graphic.geometry);//map修改为this._map
                }
                else {
                    _gScrCenter = this._map.toScreen(_gExtent.getCenter());//map修改为this._map
                }
                var _htmlDiv;
                if (!graphic.parentDiv || zoomFlag) {
                    _htmlDiv = dojo.doc.createElement("div");
                } else {
                    _htmlDiv = graphic.parentDiv;
                }
                dojo.style(_htmlDiv, {
                    "left": (_gScrCenter.x + graphic.xoffset) + "px",
                    "top": (_gScrCenter.y + graphic.yoffset) + "px",
                    "position": "absolute",
                    "z-index": this.zindex
                });
                dojo.byId(this.id).appendChild(_htmlDiv);
                graphic._draw(_htmlDiv);
                graphic.parentDiv = _htmlDiv;
                if (graphic.infowindow != null) {
                    dojo.style(_htmlDiv, "cursor", "pointer");
                    if (graphic._customClickHander) {
                        graphic._customClickHander.remove();
                    }
                    graphic._customClickHander = on(_htmlDiv, this.tipEvent, function () {
                        /*修改之后点击和弹框可以同时进行，比如弹出之后修改框的样式
                         if (graphic.infowindow.click != null) {
                         eval(graphic.infowindow.click);
                         }
                         else {
                         showPopupWindow(graphic.infowindow.title, graphic.infowindow.content, graphic.geometry.x, graphic.geometry.y, null, graphic.infowindow.width, graphic.infowindow.height, graphic.infowindow.xoffset, graphic.infowindow.yoffset,graphic.infowindow.windowStyle);
                         }*/
                        if (graphic.infowindow.content) {
                            showPopupWindow(graphic.infowindow.title, graphic.infowindow.content, graphic.geometry.x, graphic.geometry.y, null, graphic.infowindow.width, graphic.infowindow.height, graphic.infowindow.xoffset, graphic.infowindow.yoffset, graphic.infowindow.windowStyle);
                        }
                        if (graphic.infowindow.click != null) {
                            eval(graphic.infowindow.click);
                        }
                    })
                }
            }
        }
    })
        ;
});