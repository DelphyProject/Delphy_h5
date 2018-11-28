import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import TagHead from '@/scenes/findScene/popularTagPage/TagHead';
interface PopularTagProps {
  tagId: number;
}
class PopularTagPage extends React.Component<PopularTagProps> {
  render() {
    const sTag: any = sessionStorage.getItem('tags');
    const tags = JSON.parse(sTag);

    return (
      <div>
        <Helmet>
          <title>{tags.title}</title>
        </Helmet>

        <TagHead tagId={this.props.tagId} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  marketPageState: store.marketsInTagState,
});

export default connect(mapStateToProps)(PopularTagPage);
