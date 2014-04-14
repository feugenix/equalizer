!function() {

    function get(selector) {
        return document.querySelector(selector);
    };

    function createEqualizer(url) {
        var canvas = get('#equalizer');
        new AudioEqualizer(new Equalizer(canvas), url).loadNStart();
    }

    function onWayChanged() {

        var url = get('#url'),
        fs = get('#fs');

        switch(this.value) {
        case 'sample':
            url.classList.add('hidden');
            fs.classList.add('hidden');
            break;
        case 'url':
            url.classList.remove('hidden');
            fs.classList.add('hidden');
            break;
        case 'fs':
            url.classList.add('hidden');
            fs.classList.remove('hidden');
            break;
        }

    }

    function onFSChanged(e) {

    }

    function onURLChanged() {
        url = this.value;
    }

    function onPlayClicked() {
        var way = get('#way').value;

        switch (way) {
        case 'url':
            playSoundByURl(get('#url input').value);
            break;

        case 'sample':
            playSoundByURl('sounds/sound.wav');
            break;

        default:
            throw 'Not implemented';
        }
    }

    function playSoundByURl(url) {
        createEqualizer(url);
    }

    function listenWay() {
        get('#way').addEventListener('change', onWayChanged, false);
    }

    function listenInputs() {
        get('#fs input').addEventListener('change', onFSChanged, false);
        get('#play').addEventListener('click', onPlayClicked, false);
    }

    window.addEventListener('load', function() {
        listenWay();
        listenInputs();
    });

}();
