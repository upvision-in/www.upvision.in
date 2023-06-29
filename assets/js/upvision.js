(function () {
    var $document, $window;
    var $header, $navbar, $footer, $main, $scrollToTop, $navbarTogglerButton;

    function initVariables() {
        $document = $(document);
        $window = $(window);
        $header = $('header');
        $navbar = $('header > nav.navbar');
        $footer = $('footer');
        $main = $('main');
        $scrollToTop = $('#ScrollToTop');
        $navbarTogglerButton = $('.hamburger-button');
    }


    // Enable tooltip application wide...
    function EnableTooltipsApplicationWide() {
        // Enable tooltip globally...
        $('[data-toggle="tooltip"]').tooltip();

        // Debugging - Enable ONLY for DEBUGGING...
        //$('[data-toggle="tooltip"]').on('show.bs.tooltip', function () {
        //    console.log('Showing Tooltip : ' + $(this).attr('data-original-title'));
        //})
    }


    // Functionality to add "Scroll to Top" button when a page is scrolled.
    function ScrollToTop() {
        $window.scroll(function () {
            if ($(this).scrollTop() != 0) {
                $scrollToTop.fadeIn();
                //$header.fadeTo(1, 0.85);
            }
            else {
                $scrollToTop.fadeOut().tooltip('hide');
                //$header.fadeTo(1, 1);
            }
        });

        $scrollToTop.click(function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        });
    }



    function StickyMenu() {
        $window.scroll(function () {
            var heightToUseForEffect = 30;

            if ($("#shuffleTextId").length > 0) {  // for homepage
                heightToUseForEffect = $('section.video-wrapper').height() - 50;

                if ($(this).scrollTop() >= heightToUseForEffect) {
                    $navbar.css({ 'position': 'fixed', 'top': 0, 'bottom': 'auto' });
                }
                else {
                    $navbar.css({ 'position': 'absolute', 'bottom': 0, 'top': 'auto' });
                }
            }
            else {
                if ($(this).scrollTop() >= heightToUseForEffect) {
                    $navbar.addClass("fixed-top", 1000, "easeIn").addClass("shrinked", 1000, "easeIn");
                }
                else {
                    $navbar.removeClass("fixed-top", 1000, "easeIn").removeClass("shrinked", 1000, "easeIn");
                }
            }
        });
    }


    // Align ".navbar .navbar-toggler" vertically middle based on the main navbar size.
    function VerticalAlignNavbarTogglerButton() {
        if ($navbarTogglerButton && !$navbarTogglerButton.hasClass('expanded')) {
            $navbarTogglerButton.css('top', (($navbarTogglerButton.parent().parent().height() - $navbarTogglerButton.outerHeight()) / 2) + 'px');
        }
    }


    // Register 'Hamburger-Button' click functionality
    function RegisterNavbarTogglerButtonClick() {
        $(".hamburger-button").click(function () {
            $(this).toggleClass("expanded");
        });
    }

    function RegisterWowJs() {
        new WOW().init();
    }
    // Display Window Size (to identify Media Query dimensions)
    /*
        function ShowWindowSizeForMediaQueryToFindTriggerWidth() {
            var MEASUREMENTS_ID = 'measurements';
            $("body").append('<div id="'+MEASUREMENTS_ID+'"></div>');
            var measurementObj = $("#"+MEASUREMENTS_ID);
            measurementObj.css({
                'position': 'fixed',
                'bottom': '0',
                'right': '0',
                'background-color': 'black',
                'color': 'white',
                'padding': '8px',
                'font-size': '12px',
                'opacity': '0.66'
            });
            var getDimensions = function(){
                return $(window).width() + ' (' + $(document).width() + ') x ' + $(window).height() + ' (' + $(document).height() + ')';
            };
            measurementObj.text(getDimensions());
            $(window).on("resize", function(){
                measurementObj.text(getDimensions());
            });
        }
    */
    /*Footer navbar click event //////////////////////////////

    function FooterNavCollapsToggler() {
        $(".click-head").click(function(event){
            console.log("After click");
            var nextUL = $(event.target).next();
            if($(event.target).hasClass("open-internal-link")){
                $(nextUL).children().css("display" , "block");
                $(event.target).removeClass("open-internal-link");
            }
            else{
                console.log("no class");
                $(nextUL).children().css({display:"none"});
                $(event.target).addClass("open-internal-link");
            }
        });
    }
    */

    function ShuffleLettersInBanner() {
        var isShufflBannerPresent = $("#shuffleTextId").length > 0;

        if (isShufflBannerPresent) {
            shuffleBanner.initialize({
                "container": "#shuffleTextId",
                "interval": 5000,
                "textArray": $("#shuffleTextId").attr("data-text").split(',')
            });
        }

        $('.banner-info').appear();

        $(document.body).on('appear', function (e, $affected) {
            $affected.each(function () {
                if (isShufflBannerPresent)
                    shuffleBanner.resume();
            })
        });

        $(document.body).on('disappear', function (e, $affected) {
            $affected.each(function () {
                if (isShufflBannerPresent)
                    shuffleBanner.pause();
            })
        });
    }

    function initApplicationScripts() {
        StickyMenu();
        EnableTooltipsApplicationWide();
        ScrollToTop();
        VerticalAlignNavbarTogglerButton();
        RegisterNavbarTogglerButtonClick();
        RegisterWowJs();
        ShuffleLettersInBanner();
        //ShowWindowSizeForMediaQueryToFindTriggerWidth();
        //FooterNavCollapsToggler();
        slicklist.initialize();

        initMap();
    }

    $(function () {
        //initVariables();  // Todo: Need to test as it is observed that on MS Edge this is called after on 'load' which gives inappropriate behavior...
    });

    $(window)
        .on('load', function () {
            initVariables();
            initApplicationScripts();
        })
        .on('resize', function () {
            VerticalAlignNavbarTogglerButton();
        });



    //Script for google.map custome view

    function initMap() {
        try {
            var centerPosition = { lat: 23.1761691, lng: 72.6263517 };
            var myPosition = { lat: 23.1761691, lng: 72.6263517 };
            var directionUrl = "https://www.google.com/maps/dir//UpVision+Software+Services+Private+Limited/@23.1761691,72.6263517,17z/data=!3m1!4b1!4m6!3m5!1s0x395c2b27a3201327:0x8f84528af4746fa5!8m2!3d23.1761642!4d72.6289266!16s%2Fg%2F11h764tzgt";
            var largerMapUrl = "https://www.google.com/maps/place/UpVision+Software+Services+Private+Limited/@23.1761691,72.6263517,17z/data=!3m1!4b1!4m6!3m5!1s0x395c2b27a3201327:0x8f84528af4746fa5!8m2!3d23.1761642!4d72.6289266!16s%2Fg%2F11h764tzgt"

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: centerPosition,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var marker = new google.maps.Marker({
                position: myPosition,
                map: map,
                icon: 'assets/images/pages/upvision.marker.png',
                animation: google.maps.Animation.DROP,
                title: 'UpVision Software Services Private Limited'
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<div id="mapInfoWindowContent">' +
                    '<div class="title">UpVision Software Services Private Limited</div>' +
                    '<div class="content">' +
                    '<div class="description">A-403, The Landmark, Kudasan, Gandhinagar, Gujarat, PIN - 382421, INDIA</div>' +
                    '<div class="navigate-separator"></div>' +
                    '<div class="navigate"><a target="_blank" href="' + directionUrl + '" class="navigate-link"><div class="icon navigate-icon"></div><div class="navigate-text">Directions</div></a></div>' +
                    '<div class="bottom-actions"><div class="google-maps-link"><a target="_blank" href="' + largerMapUrl + '">View larger map</a></div></div>' +
                    '</div>' +
                    '</div>',
                maxWidth: 400
            });

            marker.addListener('click', function () {
                infowindow.open(map, this);
            });

            google.maps.event.addListener(map, 'click', function () {
                infowindow.close();
            });

            google.maps.event.addDomListener(window, 'load', function () {
                infowindow.open(map, marker);
            });

            // *
            // START INFOWINDOW CUSTOMIZE.
            // The google.maps.event.addListener() event expects
            // the creation of the infowindow HTML structure 'domready'
            // and before the opening of the infowindow, defined styles are applied.
            // *
            google.maps.event.addListener(infowindow, 'domready', function () {

                // Reference to the DIV that wraps the bottom of infowindow
                var iwOuter = $('#mapInfoWindowContent').parent().parent().parent();

                // Remove the padding
                iwOuter.css({ padding: 0 });

                /* Since this div is in a position prior to .gm-div style-iw.
                * We use jQuery and create a iwBackground variable,
                * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                * */
                //var iwBackground = iwOuter.prev();

                // Resize and reposition the background shadow DIV
                //iwBackground.children(':nth-child(2)').css({ top: 20, left: 25, width: '321px', height: '119px' })
                //    .addClass('box-shadow'); // extra step to set width and height
                // as sometimes Google Map ignores css

                // Removes white background DIV
                //iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

                // Removes the overflow: scroll for the popup to work in Firefox
                var iwContainer = $('#mapInfoWindowContent').parent().parent();
                iwContainer.css({ overflow: 'auto' });

                // Reference to the div that groups the close button elements.
                var iwCloseBtn = $('#mapInfoWindowContent').parent().parent().next();

                // Resize and reposition the close button container
                iwCloseBtn.css({ opacity: '1', right: '10px', top: '7px', width: '14px', height: '14px', overflow: 'hidden' });

                // Change the close button image
                iwCloseBtn.children('img').css({ left: -48, top: -91, height: 210, width: 70, margin: 0 })
                    .attr('src', 'assets/images/pages/map.controls.png');
                iwCloseBtn.hover(function () { $(this).children('img').css({ left: -26, top: -91 }); },
                    function () { $(this).children('img').css({ left: -48, top: -91 }); });

                // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                //iwCloseBtn.mouseout(function () {
                //    $(this).css({ opacity: '1' });
                //});

                showHideInfoWindow();
            });
        }
        catch (err) {
            console.log('Error in initializing Google Map');
        }
    }

    $(window).on("resize", function () {
        showHideInfoWindow();
    });

    function showHideInfoWindow() {
        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('#mapInfoWindowContent').parent().parent().parent();
        var iwBackground = iwOuter.prev();
        var iwCloseBtn = iwOuter.next();

        var displayStyle = $(window).width() >= 470 ? "block" : "none";

        //console.log($(window).width() + ' - ' + displayStyle);

        iwOuter.css({ display: displayStyle });
        iwBackground.css({ display: displayStyle });
        iwCloseBtn.css({ display: displayStyle });
    }

    // portfolio filter script
    $(function () {
        var selectedClass = "";
        $(".fil-cat").click(function () {
            selectedClass = $(this).attr("data-rel");
            $(".portfolio").fadeTo(100, 0.1);
            $(".portfolio div").not(selectedClass).fadeOut();
            setTimeout(function () {
                $(".portfolio " + selectedClass).fadeIn();
                $(".portfolio").fadeTo(300, 1);
            }, 300);
        });
    });

}());
