import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchType from '../../../../redux/actions/fetchTypes';
import SearchHistory from '../_searchHistory/_searchHistory';
import SearchResult from '../_searchResult/_searchResult';
import Notsearch from '../../../../components/notForecast';
import Loading from '../../../../components/loading';
import NotNetWork from '../../../../components/notNetwork';
import './_searchPage.less';

let searchScroll;
let isFirstPull = 1;
let page = 1;
const perPage = 10;
let isLoading = false;
interface SearchPageProps {
  serverData: any;
}
interface SearchPageState {
  searchState: boolean;
  searchValue: any;
  searchHistory: any;
  tip: string;
  loading: boolean;
}
type Props = SearchPageProps & DispatchProp & RouteComponentProps;
class SearchPage extends React.Component<Props, SearchPageState> {
  constructor(props) {
    super(props);
    const sSearchHistory: any = localStorage.getItem('searchHistory');
    this.state = {
      searchState: true,
      searchValue: '',
      searchHistory: JSON.parse(sSearchHistory),
      tip: '上滑加载更多',
      loading: false,
    };
  }

  componentDidMount() {
    const oInput: any = document.getElementById('search');
    oInput.focus();
  }

  // tslint:disable-next-line:variable-name
  _search = value => {
    this.props.dispatch({
      type: fetchType.CLEAR_SEARCH_DATA,
    });
    this.setState({
      searchState: false,
    });
    // 数据存储
    // return false;
    page = 1;

    const params = {
      q: value ? value.trim() : this.state.searchValue,
      page,
      rows: perPage,
    };
    isLoading = true;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchSearchResult(params, ret => {
        isLoading = false;
        if (ret.code == 200) {
          const sSearchHistory: any = localStorage.getItem('searchHistory');
          const searchHistory = JSON.parse(sSearchHistory);
          if (searchHistory) {
            searchHistory.forEach((val, index) => {
              if (val == this.state.searchValue.trim()) {
                searchHistory.splice(index, 1);
              }
            });
            searchHistory.splice(0, 0, this.state.searchValue.trim());
            searchHistory.splice(5, searchHistory.length - 4);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
          } else {
            const arr = [];
            //@ts-ignore
            arr.splice(0, 0, this.state.searchValue.trim());
            localStorage.setItem('searchHistory', JSON.stringify(arr));
          }

          if (ret.data && ret.data != 0) {
            if (ret.data.length == perPage) {
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
            } else {
              this.setState({
                tip: '',
                loading: false,
              });
            }
            page++;
          } else {
            this.setState({
              tip: '',
              loading: false,
            });
          }
        }
      }),
    );
    return false;
  };

  // tslint:disable-next-line:variable-name
  _scroll = () => {
    // 获取元素的隐藏区域
    searchScroll = document.getElementById('search');
    const { scrollTop } = searchScroll;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(searchScroll.clientHeight, searchScroll.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(searchScroll.scrollHeight, searchScroll.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 100 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        q: this.state.searchValue,
        page,
        rows: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchSearchResult(params, ret => {
          if (ret.code == 200) {
            const sSearchHistory: any = localStorage.getItem('searchHistory');
            const searchHistory = JSON.parse(sSearchHistory);
            if (searchHistory) {
              searchHistory.forEach((val, index) => {
                if (val == this.state.searchValue) {
                  searchHistory.splice(index, 1);
                }
              });

              searchHistory.splice(0, 0, this.state.searchValue);
              searchHistory.splice(5, searchHistory.length - 4);
              localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            } else {
              const arr: any = [];
              arr.splice(0, 0, this.state.searchValue);
              localStorage.setItem('searchHistory', JSON.stringify(arr));
            }

            setTimeout(() => {
              isFirstPull = 1;
            }, 500);
            if (ret.data && ret.data.length != 0) {
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
              page++;
            } else {
              this.setState({
                tip: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            this.setState({
              tip: '上滑加载更多',
              loading: false,
            });
          }
        }),
      );
      this.setState({
        loading: true,
        tip: '一大波搜索结果在袭来...',
      });

      this.setState({
        searchState: false,
      });
      // 数据存储
      // return false;
    }
  };

  changeValue = e => {
    this.setState({
      searchValue: e.target.value,
    });
    if (e.target.value.length == 0) {
      const sSearchHistory: any = localStorage.getItem('searchHistory');

      this.setState({
        searchState: true,
        searchHistory: JSON.parse(sSearchHistory),
      });
    }
  };

  onKeyup = e => {
    if (this.state.searchValue.length != 0) {
      e.keyCode == 13 && this._search('');
    }
  };

  render() {
    const { searchResult, serverError } = this.props.serverData;

    let contentView;
    if (this.state.searchState) {
      contentView = (
        <div>
          <div className="searchHistoryPage">
            <div className="searchHistory">
              <h4>搜索历史</h4>
              <p
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  const sSearchHistory: any = localStorage.removeItem('searchHistory');
                  this.setState({
                    searchHistory: JSON.parse(sSearchHistory),
                  });
                }}>
                <span className="icon-search_icon_delete" /> 清空
              </p>
            </div>
          </div>
          <div className="searchHistoryDataPack">
            {this.state.searchHistory
              ? this.state.searchHistory.map((dataItem, key) => (
                  <SearchHistory
                    data={dataItem}
                    key={key}
                    // tslint:disable-next-line:jsx-no-lambda
                    onClickHistory={val => {
                      this.setState({
                        searchValue: val,
                      });
                      this._search(val);
                    }}
                  />
                ))
              : false}
          </div>
        </div>
      );
    } else if (!serverError) {
      if (!isLoading) {
        if (!searchResult || searchResult != 0) {
          contentView = (
            <div>
              <div className="searchResultDataPack">
                <p className="searchResultDataPackP" />
                <div className="searchResultDataPackDiv" id="search" onScroll={this._scroll}>
                  {searchResult.map((dataItem, key) => (
                    <SearchResult data={dataItem} key={key} />
                  ))}
                  <div
                    style={{
                      textAlign: 'center',
                      lineHeight: 2,
                      color: 'rgb(136, 147, 164)',
                      position: 'relative',
                      top: -20,
                    }}>
                    {this.state.loading ? (
                      <img
                        width="20"
                        style={{ marginRight: 10, position: 'relative', top: 4 }}
                        src={require('../../../../img/tail-spin.svg')}
                        alt=""
                      />
                    ) : (
                      false
                    )}
                    {this.state.tip}
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          contentView = (
            <div className="searchOutBox">
              {' '}
              <Notsearch title="没有搜索结果，换个关键字试试" titleTwo="" />
            </div>
          );
        }
      } else {
        contentView = <Loading />;
      }
    } else {
      contentView = <NotNetWork />;
    }

    return (
      <div className="searchPage">
        <Helmet>
          <title>搜索</title>
        </Helmet>

        <div className="searchInput">
          <input
            type="search"
            placeholder="查找预测话题"
            id="search"
            onChange={this.changeValue}
            // tslint:disable-next-line:jsx-no-bind
            onKeyUp={this.onKeyup.bind(this)}
            value={this.state.searchValue}
          />
          <input
            type="text"
            style={{ position: 'absolute', top: -1000, left: 0 }}
            placeholder="输入搜索内容"
            onChange={this.changeValue}
            // onBlur={this.handler}
            // tslint:disable-next-line:jsx-no-bind
            onKeyUp={this.onKeyup.bind(this)}
          />
          <span
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.history.goBack();
            }}>
            取消
          </span>
        </div>
        {contentView}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.searchState,
});

export default connect(mapStateToProps)(SearchPage);
