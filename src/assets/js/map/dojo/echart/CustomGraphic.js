define([
    "dojo/_base/declare",
    "esri/graphic"
], function (declare,
             Graphic) {
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
            divContainer.innerHTML = this.htmlTemplate;
        },
        _customClickHander: null
    });
});