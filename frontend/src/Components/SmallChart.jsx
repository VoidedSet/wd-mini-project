import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default function SmallChart(props) {
    
    return (
        <div >
            <HighchartsReact
                highcharts={Highcharts}
                options={props.data}
            />
        </div>
    )
}