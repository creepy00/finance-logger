<template>
  <div>
    <v-toolbar fixed class="topMenu" id="topMenu">
      <v-toolbar-title>
        <router-link to="/">
          Finance Logger
        </router-link>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Home</v-btn>
        <v-btn flat>About</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: "TopMenu"
  };
</script>

<style scoped>

</style>