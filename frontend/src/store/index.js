import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: [
    createPersistedState({
      paths: [
        "authentication"
      ]
    })
  ],
  strict: true
});

export default store;
