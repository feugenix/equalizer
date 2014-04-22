!function() {

    function get(selector) {
        return document.querySelector(selector);
    };

    var MainLogic = function() {

        if (!(this instanceof MainLogic))
            return new MainLogic;

        this
            .findControls()
            .listenControls();

    };

    MainLogic.prototype = {

        findControls: function() {

            this._way = get('#way');
            this._canvas = get('#equalizer');
            this._url = get('#url');
            this._fs = get('#fs');
            this._play = get('#play');

            return this;

        },

        listenControls: function() {

            this._way.addEventListener('change', this.onWayChanged.bind(this), false);
            this._play.addEventListener('click', this.onPlayClicked.bind(this), false);

            return this;
        },

        createEqualizer: function(url) {
            new AudioEqualizer(new Equalizer(this._canvas), url).loadNStart();
        },

        onWayChanged: function() {

            switch(this._way.value) {

                case 'sample':
                    this._url.classList.add('hidden');
                    this._fs.classList.add('hidden');
                break;

                case 'url':
                    this._url.classList.remove('hidden');
                    this._fs.classList.add('hidden');
                break;

                case 'fs':
                    this._url.classList.add('hidden');
                    this._fs.classList.remove('hidden');
                break;

            }

        },

        onPlayClicked: function() {

            switch (this._way.value) {

                case 'url':
                    this.playSoundByURl(get('#url input').value);
                break;

                case 'fs':
                    this.playSoundByFile(get('#fs input').files[0]);
                break;

                case 'sample':
                    this.playSoundByURl('sounds/sound.wav');
                break;

                default:
                    throw 'Not implemented';
            }

        },

        playSoundByURl: function(url) {
            this.createEqualizer(url);
        },

        playSoundByFile: function(file) {
            if (!file) return;


        }

    };

    window.addEventListener('load', MainLogic);

}();
