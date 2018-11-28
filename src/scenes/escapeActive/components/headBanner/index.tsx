import React from 'react';
import './headBanner.less';

export const HeadBanner = props => {
  const { isShare } = props;
  // let url = {
  //     backgroundImage:'url('+props.url+')'
  // }
  return (
    <div className="share-mask">
      {/* <div className="main-box" style={url}> */}
      <div className="main-box">
        {isShare ? <div className="share-icon" onClick={props.getUrl} /> : null}
      </div>
    </div>
  );
};
