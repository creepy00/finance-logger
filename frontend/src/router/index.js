import Vue from "vue";
import Router from "vue-router";
import store from "../store";

import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";
import Dashboard from "../components/Dashboard";

Vue.use(Router);

const publicRoutes = ["Login", "Register"];

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard
    }
  ]
});

router.beforeEach((to, from, next) => {
  // check if needed to redirect to admin login
  const getNextRoute = () => {
    const isPublicRoute = publicRoutes.indexOf(to.name) > -1;

    if (!isPublicRoute && !store.getters.jwtToken) {
      return "/login";
    }

    return false;
  };

  const route = getNextRoute();
  if (route) {
    next(route);
  } else {
    next();
  }
});

export default router;
