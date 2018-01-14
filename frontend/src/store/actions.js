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
  },

  // expenses
  getExpensesForMonth ({ commit }, { month, year, offset = 0, limit = 100, sortBy = "name", descending = false }) {
    return feathers.service("api/expenses").find({
      query: {
        month: month,
        year: year,
        "$limit": limit,
        "$skip": limit * offset,
        "$sort": {
          [sortBy]: descending ? -1 : 1
        }
      }
    });
  },

  // add new expense
  addExpenseForMonth ({ commit }, { month, year, name, type, amount }) {
    return feathers.service("api/expenses").create({
      name: name,
      type: type,
      amount: parseInt(amount),
      month: parseInt(month),
      year: parseInt(year)
    });
  },

  // delete expense
  deleteExpense ({ commit }, { id }) {
    return feathers.service("api/expenses").remove(id);
  }
};
