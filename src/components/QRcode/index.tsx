import React, { Component } from 'react';
import './qrCode.less';
import QRCode from 'qrcode.react';

interface Props {
  url: string;
}

class QrCode extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="QeCodePage">
        <div className="QrImg">
          <QRCode value={this.props.url} />
        </div>
        <p>
          扫描二维码注册天算
          <br />
          百万大奖等你来拿
        </p>
      </div>
    );
  }
}

export default QrCode;
