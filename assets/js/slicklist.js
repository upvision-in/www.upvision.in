var slicklist = (function () {
    var onPageLoad = function () {
        $('.slick-list').slick({
            infinite: true,
            slidesToShow: 7,
            slidesToScroll: 1,
            centerPadding: "0",
            autoplay: true,
            //variableWidth: true,
            autoplaySpeed: 2000,
            arrows: false,
            centerMode: true,
            responsive: [
           {
               breakpoint: 1025,
               settings: {
                   arrows: false,
                   slidesToShow: 5,
                   draggable: false
               }
           },
           {
               breakpoint: 769,
               settings: {
                   arrows: false,
                   slidesToShow: 3,
                   draggable: false
               }
           },
           {
               breakpoint: 350,
               settings: {
                   slidesToShow: 1,
                   swipe: true,
                   arrows: false,
                   draggable: true,
                   //dots: true,
                   //centerPadding: "0"
               }
           }]
        });
    };

    var initialize = function () {
        onPageLoad();
    };

    return {
        initialize: initialize
    };
})();
