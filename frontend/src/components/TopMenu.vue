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
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="userData">
        Welcome {{ userData.fullName && userData.fullName.trim().length ? userData.fullName : userData.email }}
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="logout">logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "TopMenu",
    computed: {
      ...mapGetters(["userData"])
    },
    methods: {
      logout () {
        const self = this;
        self.$store.dispatch("logout").then(() => {
          self.$router.push({
            name: "Login"
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>