import { createStore, applyMiddleware, compose } from "redux";
import ReduxThunk from "redux-thunk";

import reducers from "./reducer";

const composeEnhancers = compose;
const store = createStore(
  reducers,
  /* preloadedState, */ composeEnhancers(applyMiddleware(ReduxThunk))
);

export default store!;
