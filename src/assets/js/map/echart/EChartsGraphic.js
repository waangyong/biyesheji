define([
    "dojo/_base/declare",
    "esri/graphic",
    "../dest/echarts"
], function (declare,
             Graphic, echarts) {
    return declare([Graphic], {
        _show: function () {
            if (this.parentDiv) {
                dojo.style(this.parentDiv, "display", "");
            }
        },
        _hide: function () {
            if (this.parentDiv) {
                dojo.style(this.parentDiv, "display", "none");
            }
        },
        _draw: function (divContainer) {
            dojo.style(divContainer, {
                "width": this.width + "px",
                "height": this.height + "px"
            });
            if (this.eChart)
                this.eChart.dispose();
            this.eChart = echarts.init(divContainer);
            this.eChart.setOption(this.option);
            this.eChart.resize();
        }
    });
});