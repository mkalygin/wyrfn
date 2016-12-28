function renderRatingPlot(data) {
  var len        = data.length;
  var dataPoints = data
    .sort(function (u1, u2) {
      return u1.score - u2.score;
    })
    .map(function (u, i) {
      return {
        y:     u.score,
        label: (len - i) + '. ' + u.name
      };
    });

  var winHeight  = $(window).height() * 0.9,
      barsHeight = 40 * dataPoints.length;

  var chart = new CanvasJS.Chart('chart', {
    theme:  'theme1',
    height: barsHeight > winHeight ? barsHeight : winHeight,

    title: {
      text: "What's your rating fucking noob?"
    },

    axisX: {
      interval:      1,
      gridThickness: 0,
      labelFontSize: 18
    },

    axisY2: {
      labelFontSize:   18,
      interlacedColor: '#f7f7f7'
    },

    data: [
      {
        type:      'bar',
        axisYType: 'secondary',
        color:     '#7fbf7b',
        dataPoints: dataPoints
      }
    ]
  });

  chart.render();
}

$(function () {
  $.get('/data')
    .done(function (data) {
      renderRatingPlot(data);
    })
    .fail(function (error) {
      alert(error.responseText);
    });
});
