function BufferLoader() {}

BufferLoader.prototype.decode = function(blob) {

    var context = new webkitAudioContext,
        deferred = vow.defer();

    context.decodeAudioData(
        blob,
        function(buffer) {
            deferred.resolve(buffer);
        },
        function(reason) {
            deferred.reject(reason);
        }
    );

    return deferred.promise();

};

BufferLoader.prototype.loadFromFS = function(file) {

    var fileReader = new FileReader,
        deferred = vow.defer();

    fileReader.onload = function(e) {
        deferred.resolve(e.target.result);
    };

    fileReader.onerror = function(e) {
        deferred.reject(e);
    };

    fileReader.readAsArrayBuffer(file);

    return deferred.promise();

};

BufferLoader.prototype.loadBufferFromURL = function(url) {

    var request = new XMLHttpRequest,
        loader = this,
        deferred = vow.defer();

    request.open('GET', url);
    request.responseType = 'arraybuffer';

    request.onload = function() {

        loader
            .decode(request.response)
            .then(function(buffer) {

                if (!buffer) {
                    deferred.reject('Error decoding file data: ' + url);
                    return;
                }

                deferred.resolve(buffer);

            })
            .catch(function(reason) {
                deferred.reject(reason);
            });

    };

    request.onerror = function() {
        deferred.reject('BufferLoader: XHR error in file ' + url);
    }

    try {
        request.send();
    } catch(e) {
        deferred.reject(e);
    }

    return deferred.promise();

};

BufferLoader.prototype.loadFromURLs = function(urlList) {

    var deferred = vow.defer(),
        bufferList = [],
        loadCount = 0;

    this.urlList = Array.isArray(urlList)
        ? urlList
        : [urlList];

    this.urlList.forEach(function(url, index, urlList) {

        this
            .loadBufferFromURL(url)
            .then(function(buffer) {

                bufferList[index] = buffer;

                if (++loadCount == urlList.length)
                    deferred.resolve(bufferList);

            })
            .catch(function(reason) {
                deferred.reject(reason);
            })

    }, this);

    return deferred.promise();

};
