import * as mutationTypes from "./mutationTypes";

export default {
  [mutationTypes.SET_JWT_TOKEN]: (state, jwtToken) => {
    state.authentication.jwtToken = jwtToken;
  },

  [mutationTypes.SET_USER_DATA]: (state, userData) => {
    state.authentication.userData = userData;
  },

  [mutationTypes.AUTH_LOGOUT]: (state) => {
    state.authentication.jwtToken = null;
    state.authentication.userData = null;
  }
};
