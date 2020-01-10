// init Isotope
var $grid = $('.grid').isotope({
    'itemSelector': '.grid-item',
    'masonry': {
        'columnWidth': 128,
        'isFitWidth': true
    }
});

// so we can support javacript fallback to basic html...
$grid.removeClass('no-javasript');

// bind filter button click
$('#filters').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
});

// change is-checked class on buttons
$('.button-group').each(function (i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', 'button', function () {
        $buttonGroup.find('.active').removeClass('active');
        $(this).addClass('active');
    });
});
