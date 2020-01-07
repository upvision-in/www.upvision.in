var shuffleBanner = (function () {
    var options = null;
    var isRunning = false;
    var objShuffle = null;
    var index = 0;

    var shuffleText = function() {
        // fetch the correct text to shuffle...
        if (index >= options.textArray.length) {
            index = 0;
        }
        
        var textToShuffle = options.textArray[index++].trim();

        // Shuffle the container with custom text
        $(options.container).shuffleLetters({
            "text": textToShuffle
        });
    }

    var start = function() {
        if (!isRunning) {
            shuffleText();

            objShuffle = setInterval(function () {
                shuffleText();
            }, options.interval);

            isRunning = true;
        }
    }

    var pause = function() {
        if (isRunning) {
            clearInterval(objShuffle);
            isRunning = false;
        }
    }

    var resume = function() {
        start();
    }

    var initialize = function (prop) {
        options = $.extend({
            "container" : "#shuffleTextId",                             // container where the text needs to be shuffled
            "interval"  : 4000,                                         // interval between two shuffles
            "textArray" : ["Text 1 to shuffle!", "Text 2 to shuffle!"]  // Use this text instead of the contents
        },prop);
    
        start();
    };

    return {
        initialize: initialize,
        pause: pause,
        resume: resume
    };
})();
