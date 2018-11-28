import React from 'react';
import './TagHead.less';

interface TagHeadProps {
  TagDescribe: any;
}
interface TagHeadState {
  pState: boolean;
  btnState: boolean;
  tagDescribeTxt: string;
}
type Props = TagHeadProps;
export default class TagHead extends React.Component<Props, TagHeadState> {
  pTxt: any;
  than1: any;
  than2: any;
  constructor(props) {
    super(props);
    this.state = {
      pState: true,
      btnState: true,
      tagDescribeTxt: '',
    };
  }

  componentDidMount() {
    const pTxt = this.pTxt;
    const than1 = this.than1;
    const than2 = this.than2;
    if (pTxt.offsetHeight <= than2.offsetHeight && pTxt.offsetHeight > than1.offsetHeight) {
      this.setState({
        btnState: false,
        tagDescribeTxt: 'txtPage2',
      });
    } else if (pTxt.offsetHeight > than2.offsetHeight) {
      this.setState({
        btnState: true,
        tagDescribeTxt: 'txtPage4',
      });
    } else if (pTxt.offsetHeight <= than1.offsetHeight) {
      this.setState({
        btnState: false,
        tagDescribeTxt: 'txtPage1',
      });
    }
  }

  render() {
    return (
      <div className="describePage">
        {this.state.pState ? (
          <div className={this.state.tagDescribeTxt}>
            <p
              ref={pTxt => {
                this.pTxt = pTxt;
              }}
              className="TagDescribe">
              {this.props.TagDescribe}
            </p>
          </div>
        ) : (
          <div className="txtPageAuto">
            <p
              ref={pTxt => {
                this.pTxt = pTxt;
              }}
              className="TagDescribe">
              {this.props.TagDescribe}
            </p>
          </div>
        )}
        {this.state.btnState ? (
          <p className="btnPage">
            <span
              className={
                this.state.pState ? 'icon-buysale_narrow_more' : 'icon-buysale_narrow_more spanUp'
              }
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  pState: !this.state.pState,
                });
              }}
            />
          </p>
        ) : (
          false
        )}
        <span
          className="than1"
          ref={than1 => {
            this.than1 = than1;
          }}
        />
        <span
          className="than2"
          ref={than2 => {
            this.than2 = than2;
          }}
        />
      </div>
    );
  }
}
