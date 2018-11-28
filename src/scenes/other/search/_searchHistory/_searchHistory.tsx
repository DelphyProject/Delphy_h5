import React from 'react';
import './_searchHistory.less';
interface SearchPageProps {
  data: any;
  onClickHistory: any;
}
export default class SearchPage extends React.Component<SearchPageProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div
          className="searchHistoryData"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => this.props.onClickHistory(this.props.data)}>
          <p>{this.props.data}</p>
        </div>
      </div>
    );
  }
}
