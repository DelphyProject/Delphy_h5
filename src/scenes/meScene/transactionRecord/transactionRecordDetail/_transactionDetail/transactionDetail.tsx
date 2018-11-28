import React from 'react';
import './transactionDetail.less';
interface TransactionDetailProps {
  totalNum: any;
  txNum: any;
  isShow: any;
}
interface TransactionDetailState {
  width: number;
  height: number;
  // lineY: number;
  stepXs: Array<number>;
  stepY: number;
  r: number;
  color: string;
  highColor: string;
  pointColor: string;
}
type Props = TransactionDetailProps;

let testArr;
class TransactionDetail extends React.Component<Props, TransactionDetailState> {
  canvas: any;
  lineY: number;
  lineX: number;
  constructor(props) {
    super(props);
    this.state = {
      width: 256,
      height: 300,
      // lineY: 10,
      stepXs: [0, 64, 32, 16, 8, 4, 2, 1],
      stepY: 40,
      r: 1.5,
      color: '#c3c9d1',
      highColor: '#f94b4b',
      pointColor: '#c3c9d1',
    };
    this.lineY = 10;
  }

  componentDidMount() {
    const points: any = [];
    const canvas: any = this.canvas;
    const ctx: any = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.state.width, this.state.height);
    ctx.lineWidth = 2;
    canvas.width = this.state.width;
    canvas.height = this.state.height;
    let lineX = this.state.width / 2;

    const draw = (totalNum, txNum, isShow) => {
      // if(totalNum<txNum){
      //     return false
      // }
      if (txNum == undefined || txNum < 0 || txNum > 127) {
        isShow = false;
      }
      ctx.fillStyle = this.state.color;
      ctx.beginPath();
      let pointCount;
      const ss = {
        x: this.state.width / 2,
        y: this.lineY,
      };
      for (let i = 0; i < 8; i++) {
        pointCount = 1 << i;
        const newPoit: any = [];
        for (let j = 0; j < pointCount; j++) {
          if (i == 0 && j == 0) {
            ctx.moveTo(lineX, this.lineY);
            if (isShow) {
              ctx.fillStyle = this.state.highColor;
            } else {
              ctx.fillStyle = this.state.color;
            }
            ctx.beginPath();
            ctx.arc(lineX, this.lineY, this.state.r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
          } else {
            const p = points[i - 1][Math.floor(j / 2)];
            if (j % 2 == 1) {
              if (p) ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              lineX = p.x + this.state.stepXs[i];
              ctx.lineTo(lineX, this.lineY);
              ctx.moveTo(lineX, this.lineY);
              ctx.strokeStyle = this.state.color;
              ctx.stroke();
              ctx.fillStyle = this.state.pointColor;
              ctx.beginPath();
              ctx.arc(lineX, this.lineY, this.state.r, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
            } else {
              if (p) ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              lineX = p.x - this.state.stepXs[i];
              ctx.lineTo(lineX, this.lineY);
              ctx.moveTo(lineX, this.lineY);
              ctx.strokeStyle = this.state.color;
              ctx.stroke();
              ctx.fillStyle = this.state.pointColor;
              ctx.beginPath();
              ctx.arc(lineX, this.lineY, this.state.r, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
            }
          }
          newPoit.push({ x: lineX, y: this.lineY });
        }
        this.lineY += this.state.stepY;
        points.push(newPoit);
        if (points[7] != undefined) {
          points[7].forEach((ele, index) => {
            if (127 - totalNum <= index) {
              ctx.fillStyle = this.state.highColor;
              this.lineX = ele.x;
              this.lineY = ele.y;
              ctx.beginPath();
              ctx.arc(this.lineX, this.lineY, this.state.r, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
            }
          });
        }
      }
      if (isShow) {
        this.highLine(127 - txNum);
        for (let b = 1; b < testArr.length; b++) {
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          if (testArr[b] == 0) {
            ss.x -= this.state.stepXs[b];
          } else {
            ss.x += this.state.stepXs[b];
          }
          ss.y += this.state.stepY;
          ctx.lineTo(ss.x, ss.y);
          ctx.strokeStyle = this.state.highColor;
          ctx.stroke();
          ctx.fillStyle = this.state.highColor;
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, this.state.r, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
        }
      }
    };
    draw(this.props.totalNum, this.props.txNum, this.props.isShow);
  }

  highLine = num => {
    const test = num.toString(2);
    testArr = test.split('');
    const len = testArr.length;
    for (let n = 0; n < 8 - len; n++) {
      if (len <= 7) {
        testArr.unshift('0');
      }
    }
  };

  render() {
    return (
      <div className="canvasBox">
        <canvas
          className="cvs"
          id="canvas"
          ref={canvas => {
            this.canvas = canvas;
          }}>
          <div>ssssssssssssssssssssss</div>
        </canvas>
      </div>
    );
  }
}

export default TransactionDetail;
