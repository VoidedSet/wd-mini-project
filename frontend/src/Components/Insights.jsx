import '../static/Tabs.css'
import SmallChart from './SmallChart'
export default function Insights(props) {
    const data = props?.insights?.mspr?.data;
    const eps = props?.insights?.eps;
    const recommendation = props?.insights?.recommendation;
    let mspr_total = 0;
    let mspr_positive = 0;
    let mspr_negative = 0;
    let change_total = 0;
    let change_positive = 0;
    let change_negative = 0;
    let actual_eps = [];
    let predicted_eps = [];
    let surprise_eps = [];
    let quater = [];
    let buy = [];
    let strongBuy = [];
    let hold = [];
    let sell = [];
    let strongSell = [];
    let recom_period = []
    if (!data) {
        return (
            <></>
        )
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i]?.mspr >= 0) {
            mspr_positive += data[i]?.mspr;
        } else if (data[i]?.mspr < 0) {
            mspr_negative += data[i]?.mspr;
        }
        if (data[i]?.change < 0) {
            change_negative += data[i]?.change;
        } else {
            change_positive += data[i]?.change;
        }
        change_total += data[i]?.change;
        mspr_total += data[i]?.mspr;
    }

    for (let i = 0; i < eps.length; i++) {
        actual_eps.push(eps[i]?.actual);
        predicted_eps.push(eps[i]?.estimate);
        surprise_eps.push(eps[i]?.surprise);
        quater.push(eps[i]?.period);
    }
    for (let i = 0; i < recommendation.length; i++) {
        buy.push(recommendation[i]?.buy);
        strongBuy.push(recommendation[i]?.strongBuy);
        hold.push(recommendation[i]?.hold);
        sell.push(recommendation[i]?.sell);
        strongSell.push(recommendation[i]?.strongSell);
        recom_period.push(recommendation[i]?.period.slice(0, -3));
    }
    const xAxisEps = eps.map((item) => ({
        period: item.period,
        surprise: item.surprise
    }));
    // 
    // 
    // 



    const recommendationOptions = {

        chart: {
            type: 'column',
            backgroundColor: '#eee'
        },
        title: {
            text: 'Recommendation Trends'
        },
        yAxis: {
            title: {
                text: '#Analysis'
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        xAxis: {
            categories: recom_period
        },
        series: [{
            name: 'Strong Buy',
            data: strongBuy
        },
        {
            name: 'Buy',
            data: buy
        },
        {
            name: 'Hold',
            data: hold
        },
        {
            name: 'Sell',
            data: sell
        },
        {
            name: 'Strong Sell',
            data: strongSell
        }
        ],
        colors: ['#195f32', '#23af50', '#af7d28', '#f05050', '#732828']
    }

    const epsOptions = {
        chart: {
            backgroundColor: '#eee',
        },
        title: {
            text: 'Historical EPS Surprises'
        },
        yAxis: {
            title: {
                text: 'Quarterly EPS'
            }
        },
        xAxis: {
            categories: xAxisEps.map(item => `${item.period}       Surprise: ${item.surprise}`)
        },
        series: [{
            data: actual_eps,
            type: 'spline',
            name: 'Actual'
        },
        {
            data: predicted_eps,
            type: 'spline',
            name: 'Estimate'
        }]
    }
    return (
        <div className={props.toggle === 4 ? "show-content" : "content"}>
            <div className='container justify-content-center' style={{ textAlign: "center" }} >
                <h2>Insider Sentiments</h2> <br />
                <table className="table table-responsive-sm " style={{ maxWidth: '60%', margin: 'auto' }}>
                    <thead>
                        <tr>
                            <th scope="col">{props?.info?.profile?.name}</th>
                            <th scope="col">MSPR</th>
                            <th scope="col">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Total</th>
                            <td>{mspr_total.toFixed(2)}</td>
                            <td>{change_total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Positvie</th>
                            <td>{mspr_positive.toFixed(2)}</td>
                            <td>{change_positive.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th> Negative</th>
                            <td >{mspr_negative.toFixed(2)}</td>
                            <td> {change_negative.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div><br /><br />
            <div className='container-fluid row justify-content-center'>
                <div className='col-12 col-md-5' style={{marginLeft:'20px'}}>
                    <SmallChart data={recommendationOptions} />
                </div>
                <div className='col-12 col-md-5' style={{marginBottom:'50px', marginLeft:'20px'}}>
                    <SmallChart data={epsOptions} />
                </div>
            </div>
        </div>
    )
}