import React from 'react';
import { Route } from 'react-router-dom';
import Mine from './mine'; // 2.0.1
import Invite from './invite'; // 2.0.1
import UseBag from './redBag/useBag/index';
import ShareBag from './redBag/shareBag/index';
import ActivityBag from './redBag/activityBag/index';
import OtherProfilePage from './otherInfo/index';
import message from './message';
import MessageDetailPage from './message/messageDetail';
import recharge from './balance/recharge';
import Exchange from './exchange';
import Price from './exchange/Price';
import invitingTransfer from './balance/invitingTransfer/invitingTransfer';
import balance from './balance';
import withdraw from './balance/withDraw';
import imtokenRecharge from './balance/imTokenRecharge/index';
import verification from './verification';
import kyc1 from './verification/kyc1';
import kyc2 from './verification/kyc2';
import favorite from './collection';
import EditInfo from './editInfo/index';
import invite from './invitation';
import setting from './setting';
import newEmail from './setting/newEmail';
import newPw from './setting/newPassword';
import lockDesc from './lockDesc';
import lockRecord from './lockDesc/lockRecord';
import unlockProgress from './lockDesc/unlockProgress';
import transfer from './transfer';
import transferConfirm from './transfer/transferConfirm';
import InvitationRegister from './invitation/invitationRegister/invitationRegister';

import IntiteSuccess from './invitation/intiteSuccess/intiteSuccess';
import coinheroIntiteSuccess from './invitation/coinheroIntiteSuccess/coinheroIntiteSuccess';
import CoinHeroRegister from './invitation/coinheroRegister/coinheroRegister';
import Contact from './contact/contact';
import MyRecord from './record/index';
import TransactionDetailPage from './transactionRecord/transactionRecordDetail';

const FindRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={Mine} />
    <Route path={`${match.url}/myinvite`} component={Invite} />
    <Route path={`${match.url}/useBag`} component={UseBag} />
    <Route path={`${match.url}/shareBag`} component={ShareBag} />
    <Route path={`${match.url}/activityBag`} component={ActivityBag} />
    <Route path={`${match.url}/otherProfile/:profileId`} component={other} />
    <Route path={`${match.url}/transactionRecord`} component={MyRecord} />
    <Route exact={true} path={`${match.url}/message`} component={message} />
    <Route path={`${match.url}/message/:data`} component={MessageDetailPage} />
    <Route exact={true} path={`${match.url}/address`} component={recharge} />
    <Route path={`${match.url}/recharge/imtoken`} component={imtokenRecharge} />
    <Route path={`${match.url}/exchange`} component={Exchange} />
    <Route path={`${match.url}/price`} component={Price} />
    <Route path={`${match.url}/balance`} component={balance} />
    <Route path={`${match.url}/withdraw`} component={withdraw} />
    <Route path={`${match.url}/transactionDetailPage/:Id`} component={transactionDetailPage} />
    <Route exact={true} path={`${match.url}/verification`} component={verification} />
    <Route path={`${match.url}/verification/kyc1`} component={kyc1} />
    <Route path={`${match.url}/verification/kyc2`} component={kyc2} />
    <Route path={`${match.url}/EditInfo`} component={EditInfo} />
    <Route path={`${match.url}/favorite`} component={favorite} />
    <Route path={`${match.url}/inviting`} component={invitingTransfer} />
    <Route path={`${match.url}/invite`} component={invite} />
    <Route exact={true} path={`${match.url}/setting`} component={setting} />
    <Route path={`${match.url}/setting/newEmail`} component={newEmail} />
    <Route path={`${match.url}/setting/newPassword`} component={newPw} />
    <Route path={`${match.url}/lockdesc`} component={lockDesc} />
    <Route path={`${match.url}/unlockProgress`} component={unlockProgress} />
    <Route path={`${match.url}/lockRecord`} component={lockRecord} />
    <Route path={`${match.url}/transfer`} component={transfer} />
    <Route path={`${match.url}/transferConfirm`} component={transferConfirm} />
    <Route path={`${match.url}/invitationRegister`} component={InvitationRegister} />
    <Route path={`${match.url}/intiteSuccess`} component={IntiteSuccess} />
    <Route path={`${match.url}/contact`} component={Contact} />
    <Route path={`${match.url}/coinheroIntiteSuccess`} component={coinheroIntiteSuccess} />
    <Route path={`${match.url}/coinheroRegister/:channelName`} component={COINHERORegister} />
  </div>
);

export default FindRouter;

const other = ({ match }) => <OtherProfilePage profileid={match.params.profileId} />;
const transactionDetailPage = ({ match }) => <TransactionDetailPage Id={match.params.Id} />;
const COINHERORegister = ({ match }) => <CoinHeroRegister channelName={match.params.channelName} />;
