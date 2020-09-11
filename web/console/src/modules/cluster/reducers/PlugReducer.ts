import { combineReducers } from 'redux';

import { RecordSet, reduceToPayload } from '@tencent/ff-redux';

import { initValidator } from '../../common/models';
import * as ActionType from '../constants/ActionType';
import { GPUTYPE, k8sVersionList, CreateICVipType } from '../constants/Config';

const TempReducer = combineReducers({
  PrometheusStatus: reduceToPayload(ActionType.ModifyPrometheusStatus, false)
});

export const CreateICReducer = (state, action) => {
  let newState = state;
  // 销毁创建namespace 页面
  if (action.type === ActionType.Plug_Clear) {
    newState = undefined;
  }
  return TempReducer(newState, action);
};
