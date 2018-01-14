<template>
  <v-container>
    <v-alert color="success" icon="check_circle" dismissible v-model="successAlert">
      Successfully registered {{ registeredEmail }} email
    </v-alert>
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
    props: [ "registeredEmail" ],
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required }
    },
    data () {
      const self = this;
      return {
        email: self.registeredEmail ? self.registeredEmail : "",
        password: "",
        successAlert: !!self.registeredEmail
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
        const self = this;
        self.$v.$touch();
        if (!self.$v.$error) {
          self.$store.dispatch("login", {
            loginData: {
              "email": self.email,
              "password": self.password,
              "strategy": "local"
            }
          }).then(() => {
            self.$router.push({
              name: "Dashboard"
            });
          });
        }
      }
    }
  };
</script>

<style scoped >

</style>