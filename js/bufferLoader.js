function BufferLoader(urlList, callback) {

    this.context = new webkitAudioContext;
    this.bufferList = [];
    this.loadCount = 0;

    this.urlList = Array.isArray(urlList)
        ? urlList
        : [urlList];

}

BufferLoader.prototype.loadBuffer = function(url, index) {

    // Load buffer asynchronously
    var request = new XMLHttpRequest(),
        loader = this,
        deferred = vow.defer();

    request.open('GET', url);
    request.responseType = 'arraybuffer';

    request.onload = function() {

        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {

                if (!buffer) {
                    deferred.reject('error decoding file data: ' + url);
                    return;
                }

                loader.bufferList[index] = buffer;

                if (++loader.loadCount == loader.urlList.length)
                    deferred.resolve(loader.bufferList);

            },
            function(error) {
                deferred.reject(error);
            }
        );

    };

    request.onerror = function() {
        deferred.reject('BufferLoader: XHR error');
    }

    try {
        request.send();
    } catch(e) {
        deferred.reject(e);
    }

    return deferred.promise();

};

BufferLoader.prototype.load = function() {

    var loadingOps = [];

    this.urlList.forEach(function(url, index) {
        loadingOps.push(this.loadBuffer(url, index));
    }, this);

    return vow.all(loadingOps);

};
