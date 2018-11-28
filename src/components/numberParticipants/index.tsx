import React from 'react';

interface SearchPageProps {
  paticipantsVolume: number;
  totalNum: number;
  id: string;
}

class SearchPage extends React.Component<SearchPageProps> {
  componentDidMount() {
    let Percentage;
    if (this.props.paticipantsVolume == 0 || this.props.paticipantsVolume == 0) {
      //
    } else {
      Percentage = this.props.paticipantsVolume / this.props.totalNum;
    }
    const pczren = document.querySelector<HTMLCanvasElement>(`#${this.props.id}`);
    if (!pczren) return;
    const mprocess = pczren.getAttribute('data-process');
    const mctx = pczren.getContext('2d');
    const Wc = pczren.width;
    const Hc = pczren.height;
    function draw(ctx, process, colors, fco) {
      // 画灰色的圆
      ctx.beginPath();
      ctx.arc(Wc / 2, Hc / 2, 70, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = fco;
      ctx.fill();
      // 画进度环
      ctx.beginPath();
      ctx.moveTo(Wc / 2, Hc / 2);
      ctx.arc(Wc / 2, Hc / 2, 70, -Math.PI / 2, -Math.PI / 2 + Percentage * Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = colors;
      ctx.fill();
      // 画内填充圆
      ctx.beginPath();
      ctx.arc(Wc / 2, Hc / 2, 67, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
    draw(mctx, mprocess, '#434cfe', '#d9dbff');
  }

  render() {
    return (
      <div className="Percentage">
        <canvas
          className="canvas"
          id={this.props.id}
          data-process="35"
          width="140"
          height="140"
          style={{ width: 70, height: 70 }}
        />
        <div>
          <p>{this.props.paticipantsVolume}</p>
          <h4>参与人数</h4>
        </div>
      </div>
    );
  }
}

export default SearchPage;
