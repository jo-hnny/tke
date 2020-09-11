import { ReduxAction } from '@tencent/ff-redux';

import * as ActionType from '../constants/ActionType';
import { RootState } from '../models';
import { CommonAPI, CreateResource } from '../../common';

type GetState = () => RootState;

export const plugActions = {
  createPrometheus: (createResources: CreateResource[], regionId: number) => async (
    dispatch: Redux.Dispatch,
    getState: GetState
  ) => {
    await CommonAPI.modifyResourceIns(createResources, regionId);

    dispatch({
      type: ActionType.ModifyPrometheusStatus,
      payload: true
    });
  },

  deletePrometheus: (createResources: CreateResource[], regionId: number) => async (
    dispatch: Redux.Dispatch,
    getState: GetState
  ) => {
    await CommonAPI.deleteResourceIns(createResources, regionId);

    dispatch({
      type: ActionType.ModifyPrometheusStatus,
      payload: false
    });
  }
};
