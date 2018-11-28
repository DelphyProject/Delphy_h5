import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './_selectCard.less';
interface SelectCardProps {
  data: any;
  toNewMarketList: any;
  toSpecialMarket: any;
}
interface SelectCardState {
  isImtoken: boolean;
}
type Props = SelectCardProps & RouteComponentProps;
class SelectCard extends React.Component<Props, SelectCardState> {
  constructor(props) {
    super(props);
    this.state = {
      isImtoken: !!window.imToken,
    };

    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  render() {
    let carTopImg;
    let carBottomImg;
    if (this.state.isImtoken) {
      // Only shows original images
      carTopImg = this.props.data[0].image;
      carBottomImg = this.props.data[1].image;
    } else {
      // Shows partner images (if available)
      carTopImg = this.props.data[0].partnerImage
        ? this.props.data[0].partnerImage
        : this.props.data[0].image;
      carBottomImg = this.props.data[1].partnerImage
        ? this.props.data[1].partnerImage
        : this.props.data[1].image;
    }

    return (
      <div>
        {this.props.data != '' ? (
          <div>
            <div className="selectCard">
              <div className="cardLeft">
                <img
                  className="leftNew"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.props.toNewMarketList(
                      this.props.data[2].id,
                      this.props.data[2].openingInfo,
                    );
                  }}
                  src={this.props.data[2].image}
                />
              </div>
              <div className="cardRight">
                <img
                  className="newCardTop"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.props.toSpecialMarket(
                      this.props.data[0].id,
                      this.props.data[0].openingInfo,
                    );
                  }}
                  src={carTopImg}
                />
                <img
                  className="newCardBom"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.props.toSpecialMarket(
                      this.props.data[1].id,
                      this.props.data[1].openingInfo,
                    );
                  }}
                  src={carBottomImg}
                />
              </div>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}

export default withRouter(SelectCard);
