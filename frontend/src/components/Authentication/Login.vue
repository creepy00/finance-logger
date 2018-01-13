<template>
  <v-container>
    <form>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
              label="E-mail"
              v-model="email"
              :error-messages="emailErrors"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              required
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
              label="Password"
              v-model="password"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              required
              type="password"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn @click="submit">login</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-flex>
        <v-flex xs12>
          <router-link to="/register">
            Register
          </router-link>
        </v-flex>
      </v-layout>
    </form>
  </v-container>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, email } from "vuelidate/lib/validators";
  
  export default {
    name: "Login",
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required }
    },
    data () {
      return {
        email: "",
        password: ""
      };
    },
    computed: {
      emailErrors () {
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.email.email && errors.push("Must be valid e-mail");
        !this.$v.email.required && errors.push("E-mail is required");
        return errors;
      },
      passwordErrors () {
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.password.required && errors.push("Password is required");
        return errors;
      }
    },
    methods: {
      clear () {
        const self = this;
        self.$v.$reset();
        self.email = "";
        self.password = "";
      },
      submit () {
        this.$v.$touch();
      }
    }
  };
</script>

<style scoped >

</style>