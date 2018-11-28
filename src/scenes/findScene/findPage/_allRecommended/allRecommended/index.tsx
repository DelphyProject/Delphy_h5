import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import './recommended.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import NotNetWork from '@/components/notNetwork';
import { formatTime } from '@/utils/time';
interface RecommenderProps {
  serverData: any;
}
type Props = RecommenderProps & RouteComponentProps & DispatchProp;
class Recommender extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRecommendedOrganizers(null, { page: 1, per_page: 10 }),
    );
  }

  render() {
    const { commenders } = this.props.serverData;
    return (
      <div className="allRecommendedPage">
        {commenders && commenders != 0 ? (
          commenders.map((item, key) => (
            <div key={key}>
              <dl
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.push(`/market/${item.id}`);
                }}>
                <dd>
                  <img src={item.avatar} alt="" />
                </dd>
                <dt>
                  <h4>
                    {item.name}
                    <span>{item.description}</span>
                  </h4>
                  <p>{item.content}</p>
                  <pre>
                    剩余时间:
                    {formatTime(item.endTime, 'YYYY年MM月DD日')}
                  </pre>
                  <div className="lineNotMar" />
                </dt>
              </dl>
            </div>
          ))
        ) : (
          <NotNetWork />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.allCommenderState,
});
const recommended = withRouter(Recommender);
export default connect(mapStateToProps)(recommended);
