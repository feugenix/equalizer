var AudioEqualizer = function(equalizer, sound) {

    if (!equalizer)
        throw 'No equalizer';

    this._equalizer = equalizer;
    this._sound = sound;

}


AudioEqualizer.prototype.loadNStart = function() {

    new BufferLoader(this._sound)
        .load()
        .then(this.finishedLoading.bind(this))
        .catch(this.loadingError.bind(this));

};

AudioEqualizer.prototype.finishedLoading = function(bufferList) {

    var context = new webkitAudioContext,
        bufferSource = context.createBufferSource(),
        node = context.createScriptProcessor(2048, 1, 1),
        analyser = context.createAnalyser(),
        bands;

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 512;

    bands = new Uint8Array(analyser.frequencyBinCount); // frequencyBinCount = fftSize / 2

    bufferSource.buffer = bufferList[0][0];

    bufferSource.connect(analyser);

    analyser.connect(node);

    node.connect(context.destination);
    bufferSource.connect(context.destination);

    node.onaudioprocess = function() {

        analyser.getByteFrequencyData(bands);
        this.update(bands.subarray(0, 50));

    }.bind(this);

    //bufferSource.start(0);

}

AudioEqualizer.prototype.update = function(bands) {
    this._equalizer.drawBands(bands);
};

AudioEqualizer.prototype.loadingError = function(reason) {
    console.error(reason);
}
