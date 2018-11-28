import React from 'react';
import './recommentd.less';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Comment from './comments';
interface RecommendOrganizerProps {
  data: any;
}
class RecommendOrganizer extends React.Component<RecommendOrganizerProps> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: false,
      datas: this.props.data,
    };
  }

  render() {
    const { data } = this.props;
    return (
      <div className="recommendPack">
        <p className="recommendTitle">推荐发起人</p>
        <div className="Recommentd">
          {data.map((dataitem, k) => (
            <Comment datas={data} data={dataitem} index={k} key={k} />
          ))}
          <p className="lineNotMar" />
        </div>

        <h5 className="allcomments">
          <Link to="find/allRecommended/">查看全部</Link>
        </h5>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.findPageState,
});
export default connect(mapStateToProps)(RecommendOrganizer);
