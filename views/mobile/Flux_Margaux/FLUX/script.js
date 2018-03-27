$(function(){

  $('#nstSlider1').nstSlider({
      "left_grip_selector": "#leftGrip1",
      "value_bar_selector": "#bar1",
      "value_changed_callback": function(cause, leftValue, rightValue) {
          var $container = $(this).parent(),
              g = 155 - 127 + leftValue,
              r = 255 - g,
              b = 100 + leftValue - g;
          $container.find('#leftLabel1').text(leftValue);
          $(this).find('.bar').css('background', 'rgb(' + [r, g, b].join(',') + ')');

      }
  });

  $('#nstSlider2').nstSlider({
    "left_grip_selector": "#leftGrip2",
    "value_bar_selector": "#bar2",
      "value_changed_callback": function(cause, leftValue, rightValue) {
          var $container = $(this).parent(),
            g = 155 - 127 + leftValue,
            r = 255 - g,
            b = 100 + leftValue - g;
          $container.find('#leftLabel2').text(leftValue);
          $(this).find('.bar').css('background', 'rgb(' + [r, g, b].join(',') + ')');
          
      }
  });

});
