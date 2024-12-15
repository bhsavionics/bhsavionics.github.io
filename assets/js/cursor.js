$(document).ready(function () {
    const $customCursor = $('.custom-cursor');
    let cursorX = 0,
        cursorY = 0;

    // Track mouse position
    $(document).on('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Update cursor position
    function updateCursorPosition() {
        const scrollX = $(window).scrollLeft();
        const scrollY = $(window).scrollTop();
        $customCursor.css({
            left: cursorX + scrollX + 'px',
            top: cursorY + scrollY + 'px'
        });
        requestAnimationFrame(updateCursorPosition);
    }
    updateCursorPosition();

    // Handle mouse down and mouse up events for visual effects
    $(document).on('mousedown', function () {
        $customCursor.css('transform', 'translate(-50%, -50%) scale(0.8)');
    });
    $(document).on('mouseup', function () {
        $customCursor.css('transform', 'translate(-50%, -50%) scale(1)');
    });

    // Enlarge the custom cursor when hovering over clickable elements using event delegation
    $(document).on('mouseover', 'a, button', function () {
        $customCursor.css('transform', 'translate(-50%, -50%) scale(1.5)');
    });
    $(document).on('mouseout', 'a, button', function () {
        $customCursor.css('transform', 'translate(-50%, -50%) scale(1)');
    });

    // Update cursor position on scroll
    $(window).on('scroll', function () {
        const scrollX = $(window).scrollLeft();
        const scrollY = $(window).scrollTop();
        $customCursor.css({
            left: cursorX + scrollX + 'px',
            top: cursorY + scrollY + 'px'
        });
    });
});