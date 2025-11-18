import SmallChart from "./SmallChart"
// import { useState } from 'react-router-dom';
// import Search, { callBackend } from '../Components/Search';
// import Search from '../Components/Search.jsx';
import Search from './Search.jsx';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import Search from '../Components/Search.jsx';



export default function Summary(props) {
  // put level by level check
  if (!props.info.peers) {
    return (
      <></>
    )
  }

  // COMPANY PEERS
  // const navigate = useNavigate();
  // const baseURL = `http://localhost:5173/search/`;
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();
  const handleClick = (company) => {
    
    
    // Update the state to the clicked company
    navigate(`/search/${company}`);
    setSelectedCompany(company);
  };

  // const handleClick = (company) => {
  //     
  //     
  //     return (<Search ticker_name={company}/>)
  // };



  // SUMMARY-CHARTS
  let xaxis = []
  const data = props?.summary_chart?.results;
  
  const pdtOffsetInSeconds = 7 * 60 * 60 * 1000
  if (data) {
    for (let i = 0; i < data.length; i++) {
      // const date = new Date(data[i].t * 1000);
      // const pdt = date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
      // 
      // const dateUTC = new Date(data[i].t * 1000);
      // const offsetPDT = 7 * 60 * 60 * 1000;
      // const unixTimestampPDT = (dateUTC.getTime() - offsetPDT) / 1000;
      xaxis.push([data[i].t - pdtOffsetInSeconds, data[i].c])
    }
  }

  const options = {
    title: {
      text: `${props?.info?.profile?.ticker} Hourly Price Variation`
    },
    chart: {
      backgroundColor: '#f0f0f0' // Light gray background
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '%H:%M' // Formats the date in an hour:minute format
      },
      labels: {
        showLastLabel: true
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      opposite: true, // Puts the yAxis on the right side
      labels: {
        align: 'left', // Aligns labels to the left side of the axis
        x: -20, // Positions the labels on the inside of the chart area
        y: -5
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false, // Enables the data point markers
          radius: 3 // Adjusts the size of the markers
        },
        lineWidth: 2 // Sets the width of the line
      }
    },
    legend: {
      enabled: false // Hides the legend
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{series.name}: <b>{point.y}</b>',
      valueDecimals: 2
    },
    series: [{
      name: props?.info?.profile?.ticker,
      data: xaxis,
      pointInterval: 3 * 3600 * 1000,
      color: props?.info?.latest_price?.d > 0 ? 'green' : 'red'
    }]
  };
  

  return (
    <div className={props.toggle === 1 ? "show-content" : "content"}>
      <div className="row  flex-row ">
        <div className="col-12 col-md-6">
          <div className="pt-2 flex-fill">
            <div style={{ textAlign: 'center' }} >
              <b>High Price: </b> {props?.info?.latest_price?.h}<br />
              <b>Low Price: </b> {props?.info?.latest_price?.l} <br />
              <b>Open Price: </b>{props?.info?.latest_price?.o} <br />
              <b>Prev Price: </b>{props?.info?.latest_price?.pc} <br /> <br /> 
            </div>
            <div style={{ textAlign: 'center' }} >
              <h3><b><u>About the company</u></b></h3> <br />
              <b>IPO Start Date: </b> {props?.info?.profile?.ipo} <br />
              <b>Industry: </b> {props?.info?.profile?.finnhubIndustry} <br />
              <b>Webpage: </b> <a href={props?.info?.profile?.weburl} target="_blank">{props?.info?.profile?.weburl}</a><br /><br/>
              <b>Company peers</b>
              <div>
                {props?.info?.peers.map((company, index) => (
                  <span key={index}>
                    {!company.charAt(0).match(/^\d/) ?
                      <span><button onClick={() => handleClick(company)} style={{ textDecoration: 'underline', color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {company}
                      </button>,</span> : <></>
                    }
                  </span>
                ))}
              </div>
              {/* {selectedCompany && <Search ticker_name={selectedCompany} />} */}
            </div>
          </div>

        </div>
        <div className="col-11 col-md-5" style={{marginBottom:'50px', marginTop:'10px', marginLeft:'15px'}}>
          <SmallChart data={options} />
        </div>
      </div>

    </div>

  )
}