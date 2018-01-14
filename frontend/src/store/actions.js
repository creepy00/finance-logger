import feathers from "../gateways/FinanceLoggerSocket";
import * as mutationTypes from "./mutationTypes";

export default {
  register ({ commit }, { registerData }) {
    return feathers.service("api/users").create(registerData);
  },

  login ({ commit }, { loginData }) {
    return feathers.service("api/authentication").create(loginData).then(response => {
      commit(mutationTypes.SET_JWT_TOKEN, response.accessToken);
      return true;
    });
  },

  cacheUserData ({ commit, getters }) {
    if (getters.jwtToken) {
      return feathers.authenticate({
        strategy: "jwt",
        accessToken: getters.jwtToken
      }).then(() => {
        return feathers.service("api/users").find();
      }).then(users => {
        commit(mutationTypes.SET_USER_DATA, users.data[0]);
      });
    } else {
      return false;
    }
  },

  logout ({ commit }) {
    return feathers.logout().then(() => {
      commit(mutationTypes.AUTH_LOGOUT);
    });
  }
};
