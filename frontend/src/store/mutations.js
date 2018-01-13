import * as mutationTypes from "./mutationTypes";

export default {
  [mutationTypes.SET_JWT_TOKEN]: ({ state }, jwtToken) => {
    state.authentication.jwtToken = jwtToken;
  }
};
