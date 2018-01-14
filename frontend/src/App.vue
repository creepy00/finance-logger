<template>
  <v-app>
    <top-menu></top-menu>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import TopMenu from "./components/TopMenu";

  export default {
    name: "app",
    components: {
      TopMenu
    }
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>