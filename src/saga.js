import { call, put, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {initEvent} from '../actions';

function createLoadedChannel() {
    return eventChannel(emit => {
      const change = () => {
        //emit(document.hidden);
        console.log("init saga");
        emit(initEvent());
      };
      //document.addEventListener('visibilitychange', change);
      window.addEventListener('DOMContentLoaded', change);
      return () => {
        document.removeEventListener('DOMContentLoaded', change);
      };
    });
  }
  
export  function* initFlowSaga() {
    const channel = createLoadedChannel();
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  }