export function show_result_chart(success_counter, failure_counter) {
    const items = [
        {label: "Успехи", value: success_counter, color: "#2F9948"},
        {label: "Неудачи", value: failure_counter, color: "#992F30"}
    ].filter(item => item.value > 0);

    if (!items.length) return;

    const categories = items.map(item => item.label);
    const data_values = items.map(item => item.value);
    const chart_colors = items.map(item => item.color);

    const label_colors = items.map(() => "rgba(203,203,203,0.7)");

    const chart_options = {
        chart: {
            type: "bar",
            height: 300,
            toolbar: {show: false}
        },
        series: [{
            name: "Количество",
            data: data_values
        }],
        xaxis: {
            categories
        },
        colors: chart_colors,
        plotOptions: {
            bar: {
                distributed: true,
                columnWidth: "50px",
                borderRadius: 8
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: label_colors
            }
        },
        yaxis: {
            min: 0
        },
        tooltip: {
            y: {
                formatter: val => val
            }
        },
        grid: {
            show: false
        },
        legend: {
            show: false
        }
    };

    new ApexCharts(
        document.querySelector(".result_chart"),
        chart_options
    ).render();
}
