$(document).ready(function () {
    $('#page_name').text('Nhiệt độ & Độ ẩm (F17)')

    var options = {
        series: [
            {
                name: "Temperature",
                data: [22, 23, 24, 22, 25, 26, 23]
            },
            {
                name: "Humidity",
                data: [3.5, 4.1, 4.5, 3.5, 3.8, 4, 5]
            }
        ],              
        chart: {
            height: 350,
            type: "line",
            dropShadow: {
                enabled: true,
                color: "#000",
                top: 18,
                left: 0,
                blur: 5,
                opacity: 0.5
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false,
            },
        },
        colors: ["#FF0000", "#0073FF"],
        dataLabels: {
            enabled: false,
        },       
        stroke: {
            curve: "smooth"
        },      
        grid: {
            borderColor: "#e7e7e7",
            row: {
                colors: ["#fff"],
                opacity: 0.3
            }
        },
        title: {
            text: "Temperature and Humidity Monitoring Chart",
            align: "center",
            style: {
                fontSize: '25px',
                color: '#fff',               
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            labels: {
                style: {
                    colors: '#dee2e6',
                    fontSize: '14px',
                },
            },
            tooltip: {
                enabled: false
            },
        },
        yaxis: [
            {
                title: {
                    text: 'Temperature',
                    style: {
                        fontSize: '20px',
                        color: '#BCDAFF',
                        opacity: 0.1,
                    },
                },
                opposite: false,
                tickAmount: 4,
                max: 28,
                min: 15,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(1) + ' °C';
                    },
                    style: {
                        colors: '#dee2e6',
                        fontSize: '14px',
                    },
                }
            },
            {
                title: {
                    text: 'Humidity',
                    style: {
                        fontSize: '20px',
                        color: '#FFBCBC',
                        opacity: 0.1,
                    },
                },
                opposite: true,
                tickAmount: 2,
                min: 0,
                max: 10,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(1) + ' %RH';
                    },
                    style: {
                        colors: '#dee2e6',
                        fontSize: '14px',
                    },
                }
            }
        ],
        legend: {
            fontSize: '14px',
            labels: {
                colors: '#fff',
            },
        },
        tooltip: {
            style: {
                opacity: 0.1,
            },
        },
    };

    var chart = new ApexCharts(document.querySelector("#TemperatureHumidityChart"), options).render();
});