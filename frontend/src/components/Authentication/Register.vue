<template>
  <v-container>
    <h2>Register</h2>
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
          <v-text-field
              label="Repeat Password"
              v-model="repeatPassword"
              :error-messages="repeatPasswordErrors"
              @input="$v.repeatPassword.$touch()"
              @blur="$v.repeatPassword.$touch()"
              required
              type="password"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
              label="Full Name"
              v-model="fullName"
              type="text"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn @click="submit">register</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-flex>
        <v-flex xs12>
          <router-link to="/login">
            Back to login
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
    name: "Register",
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required },
      repeatPassword: { required }
    },
    data () {
      return {
        serverErrors: {},
        email: "",
        password: "",
        repeatPassword: "",
        fullName: ""
      };
    },
    computed: {
      emailErrors () {
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.email.email && errors.push("Must be valid e-mail");
        !this.$v.email.required && errors.push("E-mail is required");
        if (this.serverErrors.email) {
          return errors.concat(this.serverErrors.email);
        } else {
          return errors;
        }
      },
      passwordErrors () {
        const errors = [];
        if (!this.$v.password.$dirty) return errors;
        !this.$v.password.required && errors.push("Password is required");
        return errors;
      },
      repeatPasswordErrors () {
        const errors = [];
        if (!this.$v.repeatPassword.$dirty) return errors;
        !this.$v.repeatPassword.required && errors.push("Repeated password is required");
        (this.password !== this.repeatPassword) && errors.push("Repeated password must be the same as password");
        return errors;
      }
    },
    methods: {
      clear () {
        const self = this;
        self.$v.$reset();
        self.email = "";
        self.password = "";
        self.repeatPassword = "";
        self.fullName = "";
      },
      submit () {
        const self = this;
        self.$v.$touch();
        if (!self.$v.$error) {
          // start with registration
          self.$store.dispatch("register", {
            registerData: {
              email: self.email,
              password: self.password,
              repeatPassword: self.repeatPassword,
              fullName: self.fullName ? self.fullName : null
            }
          }).then(() => {
            self.$router.push({
              name: "Login",
              params: {
                registeredEmail: self.email
              }
            });
          }).catch(err => {
            self.serverErrors = err.errors;
          });
        }
      }
    }
  };
</script>

<style scoped >

</style>