import { Chart, Tooltip, Axis, SmoothLine } from 'viser-react';
import * as React from 'react';
import './index.less';
import { connect, DispatchProp } from 'react-redux';
import { formatTime } from '@/utils/time';
// import * as fetchType from '@/redux/actions/fetchTypes';
interface HistoryChartProps {
  data: any;
  onClick: any;
  sourceData: any;
}
interface HistoryChartState {
  realVale: string | null;
  predictValue: string | null;
  data: any;
  scale: any;
}
type Props = HistoryChartProps & DispatchProp;
class HistoryChart extends React.Component<Props, HistoryChartState> {
  constructor(props) {
    super(props);
    this.state = {
      realVale: '0',
      predictValue: '0',
      data: null,
      scale: null,
    };
  }
  componentWillMount() {
    const DataSet = require('@antv/data-set');
    const dv = new DataSet.View().source(this.props.sourceData);
    dv.transform({
      type: 'rename',
      map: {
        realPrice: '真实', // row.xxx 会被替换成 row.yyy
        preditPrice: '预测', // row.xxx 会被替换成 row.yyy
      },
    });
    dv.transform({
      type: 'fold',
      fields: ['真实', '预测'],
      key: 'city',
      value: 'temperature',
    });
    const mData = dv.rows;
    const mScale = [
      {
        dataKey: 'timeStamp',
        // min: this.props.sourceData[0].timeStamp - 60 * 60 * 24 * 3,
        // max: this.props.sourceData[this.props.sourceData.length - 1].timeStamp,
        tickCount: 10,
        formatter: function formatter(val) {
          return formatTime(val, 'MM-DD');
        },
      },
    ];
    this.setState({
      data: mData,
      scale: mScale,
    });
  }
  onChartClick1 = (event, chart) => {
    this.setState({});
  };
  onChartClick = (event, chart) => {
    const items = event.items;
    this.props.onClick(items);
  };
  render() {
    const thisGrid = {
      type: 'line',
      lineStyle: {
        stroke: '#d9d9d9',
        lineWidth: 1,
      },
      align: 'center', // 网格顶点从两个刻度中间开始
    };
    return (
      <Chart
        forceFit={true}
        height={400}
        padding={[20, 20, 40, 50]}
        data={this.state.data}
        scale={this.state.scale}>
        <Tooltip onChange={this.onChartClick} />
        <Axis grid={thisGrid} />
        <SmoothLine position="timeStamp*temperature" color={['city', ['#34A9FF', '#E849B9']]} />
      </Chart>
    );
  }
}
const mapStateToProps = store => ({
  data: store.futureHistoryMarket,
});

export default connect(mapStateToProps)(HistoryChart);
