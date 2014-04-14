var Equalizer = function(canvas) {

    this._canvas = canvas && canvas.getContext ? canvas : document.querySelector('#canvas');

    if (!this._canvas)
        throw 'No canvas';

    this._ctx = this._canvas.getContext('2d');

    this._canvas.width = screen.width;

    this._dataScale = 6;

}


Equalizer.prototype._prepareData = function(rawData) {

    var result = [];

    for (var i = 0, l = rawData.length; i < l; i++) {
        result[i] = rawData[i] / this._dataScale;
    }

    return result;

};

Equalizer.prototype.drawBands = function(bands) {
    this._visualize(this._prepareData(bands));
};

Equalizer.prototype._visualize = function(data) {

    var ctx = this._ctx,
        canvas = this._canvas,
        l = data.length,
        scale = canvas.width / l,
        margin = 5,
        columnWidth = scale - margin,
        height;

    columnWidth > 0 || (columnWidth = 1);

    ctx.fillStyle = "rgb(200,0,0)";

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    for (var i = 0; i < l; i++) {
        height = data[i] > canvas.height ? canvas.height : data[i];
        ctx.fillRect(scale*i, canvas.height, columnWidth, -height);
    }

};
