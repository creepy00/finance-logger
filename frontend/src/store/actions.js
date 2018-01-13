import feathers from "../gateways/FinanceLoggerSocket";

export default {
  register ({ commit }, { registerData }) {
    return feathers.service("api/users").create(registerData);
  }
};
