import React from 'react';
import './_searchResult.less';
import { DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CountDown from '../../../findScene/detailScene/components/_countDown';
import { getNowTimestamp } from '@/utils/time';
interface SearchPageProps {
  data: any;
}
type Props = SearchPageProps & DispatchProp & RouteComponentProps;
class SearchPage extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const searchTit: any = document.getElementById(`${`search${this.props.data.id}`}`);
    searchTit.innerHTML = this.props.data.title;
  }

  // tslint:disable-next-line:no-empty
  getData = () => {};

  render() {
    return (
      <div
        className="searchResult"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => {
          // this.props.history.push(`/market/${this.props.data.id}`)
          this.props.history.push(`/find/topicDetail/${this.props.data.id}`);
        }}>
        <i id={`search${this.props.data.id}`} />
        <p>{this.props.data.description}</p>
        <div>
          <p>
            <span className="iconfontMarket icon-Adeltails_amoun" />
            {this.props.data.num_investor}
          </p>
          <p>
            <CountDown date={this.props.data.end_time - getNowTimestamp()} getData={this.getData} />
          </p>
        </div>
      </div>
    );
  }
}
export default withRouter(SearchPage);
