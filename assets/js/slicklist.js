var slicklist = (function () {
    var onPageLoad_Home_Quotes = function () {
        $('.slick-list-quotes').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerPadding: "0",
            variableWidth: false,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: true,
            centerMode: true,
            fade: true,
            speed: 500,
            cssEase: 'ease',
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
                        draggable: true
                    }
                }]
        });
    }

    var onPageLoad_Services_Skills = function () {
        $('.slick-list-skills').slick({
            infinite: true,
            slidesToShow: 9,
            slidesToScroll: 1,
            centerPadding: "0",
            autoplay: true,
            //variableWidth: true,
            autoplaySpeed: 2000,
            arrows: true,
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
                        draggable: true
                        //dots: true,
                        //centerPadding: "0"
                    }
                }]
        });
    };

    var initialize = function () {
        onPageLoad_Home_Quotes();
        onPageLoad_Services_Skills();
    };

    return {
        initialize: initialize
    };
})();
