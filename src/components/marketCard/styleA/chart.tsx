import React, { Component } from 'react';

import Highcharts from 'highcharts';
import addHeatmap from 'highcharts/modules/heatmap';
import annotations from 'highcharts/modules/annotations';
import { formatTime } from '../../../utils/time';

interface ChartProps {
  id: string;
  chartData: any;
  holdAvgPrice: number;
}

interface ChartState {
  chartData: any;
}

addHeatmap(Highcharts);
annotations(Highcharts);
export default class Chart extends Component<ChartProps, ChartState> {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.props.chartData,
    };
  }

  componentDidMount() {
    // Highcharts.chart('thisl'+this.props.id, configs(this.props.chartData));

    //    var prices=[0.01241,0.02231,0.0231,0.01234]
    const prices: Array<any> = [];
    //    var xs=[12313,21234,42456,24321]
    const xs: Array<any> = [];
    if (this.state.chartData) {
      this.state.chartData.forEach((val, index) => {
        const element: Array<any> = [];
        element.push(`${index}`);
        element.push(val.price - 0);
        prices.push(element);
        xs.push(formatTime(val.time, 'HH:mm'));
      });
      Highcharts.chart(`thisl${this.props.id}`, configs(prices, xs, this.props.holdAvgPrice));
    }
  }

  render() {
    return <div style={{ height: 120 }} className="curve" id={`thisl${this.props.id}`} />;
  }
}

const configs = (prices, xs, holdAvgPrice) => {
  // const configs = (data) => {
  // prices = [['0', 0.34], ['1', 0.30], ['2', 0.14], ['3', 0.54], ['4', 0.70], ['5', 0.14], ['6', 0.24], ['7', 0.40], ['8', 0.500]];
  const pricesLen = prices.length;
  const pointFlag = (pricesLen - 1).toString();
  // holdAvgPrice = 0.5216
  return {
    chart: {
      marginRight: 60,
      animation: false,
      marginTop: 40,
      marginBottom: 25,
    },
    credits: {
      enabled: false, // 禁用版权信息
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      lineWidth: 0,
      tickWidth: 0,
      tickmarkPlacement: 'on',
      endOnTick: true,
      maxPadding: 0,
      labels: {
        formatter() {
          const categories = xs;
          // @ts-ignore
          return categories[this.value];
        },
        // rotation: 0,
        style: {
          fontSize: '7px',
        },
      },
      tickInterval: 2,
      offset: -20,
    },
    yAxis: {
      title: {
        text: '',
      },
      min: 0,
      max: 1,
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
      plotLines: [
        {
          color: 'grey', // 线的颜色，定义为红色
          dashStyle: 'dot', // 默认值，这里定义为实线
          value: holdAvgPrice, // 定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
          width: 1, // 标示线的宽度，2px
          label: {
            useHTML: true,
            align: 'right',
            text: `${'<span style=" width: 0;' +
              'height: 0;' +
              'border-top: 4px solid transparent;' +
              'border-right: 8px solid #333;' +
              'border-bottom: 4px solid transparent;' +
              'padding-right: 20px;' +
              'margin-right: 4px;"></span>持有均价<br><span style="text-align:center;margin-left: 28px;display: block;">'}${parseFloat(
              holdAvgPrice,
            ).toFixed(2)}</span>`,
            x: 60,
            y: 3,
          },
        },
      ],
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: { animation: false },
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [
              0,
              Highcharts.Color('#434dff')
                .setOpacity(0.3)
                .get('rgba'),
            ],
            [
              1,
              Highcharts.Color('#434dff')
                .setOpacity(0)
                .get('rgba'),
            ],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    annotations: [
      {
        labels: [
          {
            verticalAlign: 'bottom',
            point: pointFlag,
            // distance: 10 + 20 * (1 - prices[8][1]),
            x: -15,
            y: -30 - 20 * (1 - prices[prices.length - 1][1]),
            overflow: 'justify',
            text: '当前选项价格 {point.y:.2f}',
          },
        ],
        labelOptions: {
          // formatter: function () {
          //     return (this.series.dataMax - this.y).toFixed(2);
          // },
          borderRadius: 8,
          backgroundColor: '#434dff',
          borderWidth: 0,
          style: {
            opacity: 0.8,
            fontSize: '8px',
          },
          allowOverlap: true,
        },
        zIndex: 100,
      },
    ],

    series: [
      {
        type: 'area',
        name: 'price',
        keys: ['id', 'y'],
        data: prices,
        // data: [0.34, 0.21, 0.35, 0.37, 0.39, 0.36, 0.22, 0.21, 0.08],
        color: '#434dff',
      },
    ],
  };
};
