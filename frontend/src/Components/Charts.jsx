import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import IndicatorsCore from 'highcharts/indicators/indicators';
// import volumeByPrice from 'highcharts/indicators/volume-by-price'
import HighchartsVBP from 'highcharts/indicators/volume-by-price';
// import volumeByPrice from 'highcharts/modules/volume-by-price';
IndicatorsCore(Highcharts);
HighchartsVBP(Highcharts);
// volumeByPrice(Highcharts);
import '../static/Tabs.css'


export default function Charts(props) {

    const data = props?.charts?.results;
    let candlestick = [];
    let stockVolumeData = [];
    let options = {};
    if (!data) {
        return <></>;
    }
    // 
    for (let i = 0; i < data.length; i++) {
        let temp = [];
        temp.push(data[i].t)
        temp.push(data[i].o)
        temp.push(data[i].h)
        temp.push(data[i].l)
        temp.push(data[i].c)
        stockVolumeData.push([data[i].t, data[i].v]);
        candlestick.push(temp)
    }
    const groupingUnits = [
        ['week', [1]], // unit name and allowed multiples
        ['month', [1, 2, 3, 4, 6]]
    ];


    // 
    if (candlestick.length > 0) {

        options = {
            chart: {
                height: 650, // Height of the chart in pixels
                backgroundColor: '#eee',
                alignTicks: false,
            },
            title: {
                text: `${props?.ticker_name}`.toUpperCase() + ` Historical`
            },
            subtitle: {
                text: `With SMA and Volume by Price technical indicators`
            },
            // plotOptions: {
            //     candlestick: {
            //         color: '#ADD8EF',
            //         lineColor: 'black',
            //         upColor: 'white',
            //         upLineColor: 'black',
            //         pointWidth: 5,
            //         groupPadding: 0.5,
            //         borderWidth: 1
            //     },
            //     column: {
            //         pointWidth: 5,
            //         color: '#0000BB',
            //         borderColor: 'white',
            //         borderWidth: 1.5,
            //         // pointPadding: 0.2,
            //         // maxPointWidth: 5
            //     },
            //     series: {
            //         dataGrouping: {
            //             units: groupingUnits
            //         }
            //     }

            // },
            plotOptions: {
                series: {
                    dataGrouping: {
                        units: groupingUnits
                    }
                }
            },

            rangeSelector: {
                selected: 2,
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },
            xAxis: {
                type: 'datetime',
                endOnTick: false,
                maxPadding: 0,
                offset: 78
            },
            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                labels: {
                    align: 'right',
                    x: -3
                },
                lineWidth: 2,
                height: '80%',
                resize: {
                    enabled: true
                },
                pointPlacement: 'on'
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                lineWidth: 2,
                title: {
                    text: 'Volume'
                },
                opposite: true,
                // min: 0,
                height: '40%',
                top: '82%',
                pointPlacement: 'on',
                offset: 0
            }],
            legend: {
                enabled: true
            },
            series: [{
                type: 'candlestick',
                showInLegend: false,
                name: `${props?.ticker_name}`.toUpperCase(),
                data: candlestick,
                yAxis: 0,
                pointPlacement: 'on',
                id: 'candles'
            },
            {
                name: 'Volume',
                type: 'column',
                showInLegend: false,
                data: stockVolumeData,
                yAxis: 1,
                tooltip: {
                    valueDecimals: 0
                },
                pointPlacement: 'on',
                id: 'volume'
            },
            {
                type: 'sma',
                linkedTo: 'candles',
                color: 'red',
                marker: {
                    enabled: false
                }
            },
            {
                type: 'vbp',
                linkedTo: 'candles',
                params: { volumeSeriesId: 'volume' },
                showInLegend: false,
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                },
                marker: {
                    enabled: false
                }
            }]
        }
    }



    return (
        <div className={props.toggle === 3 ? "show-content" : "content"} style={{ marginBottom: '70px' }}>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    )
}