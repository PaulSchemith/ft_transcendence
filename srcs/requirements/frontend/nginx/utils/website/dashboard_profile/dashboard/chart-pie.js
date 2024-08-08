// Set new default font family and font color to mimic Bootstrap's default styling
// Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#858796';


// Pie Chart Example
function setPieChart(param1, param2) {
  if (param1 === 0 && param2 === 0 ) {
    document.getElementById('chartPieTextInfo').classList.remove('hidden-element');
  }
  else {
    document.getElementById('chartPieTextInfo').classList.add('hidden-element');
    var ctxChartPie = document.getElementById("myPieChart");
    myPieChart = new Chart(ctxChartPie, {
      type: 'doughnut',
      data: {
        labels: ["Victories", "Defeats"],
        datasets: [{
          data: [param1, param2],
          backgroundColor: ['#35CF00', '#EA2900'],
          hoverBackgroundColor: ['#2CA701', '#BE1201'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
  }
}