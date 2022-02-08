import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import taskReducers from './reducers';

const rootReducer = combineReducers({ taskReducers });

export const Store = createStore(rootReducer, applyMiddleware(thunk));