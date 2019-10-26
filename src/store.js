import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
//import {startStopApprovalChannel} from "./saga";
//import {watchApproval, handleSubmit} from "./sagas/eventSaga";
//import {visibilitySaga} from "./sagas/visibilitySaga";
import {current, search} from "./reducer";

const createRootReducer = () => combineReducers({ current, search });

export default function configureStore() {
  const store = createStore(createRootReducer());
  return store;
}