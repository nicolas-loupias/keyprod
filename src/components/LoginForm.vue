<template>

  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">

          <v-toolbar color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form
              lazy-validation
            >
              <v-text-field
                v-model="name"
                prepend-icon="person"
                name="login"
                label="Login"
                type="text"
                :rules="nameRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                id="password"
                prepend-icon="lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                hint="At least 8 characters"
                name="password"
                label="Password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-form>

            <!-- Form error message to be displayed -->
            <v-snackbar color="primary accent-2" v-model="invalidLogin">
                Invalid login data
            </v-snackbar>
            
          </v-card-text>
          <v-card-actions>
           <v-spacer></v-spacer>
            <v-btn color="primary" @click="validate">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    invalidLogin: false,
    showPassword: false,
    name: '',
    nameRules: [
      v => !!v || 'Name is requiredcdd',
      v => (v && v.length <= 8) || 'Name must be less than 6 characters',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 8) || 'Password must be less than 6 characters',
    ],
  }),
  methods: {
    validate () {

      // Check valid form.
      // If not, show an error message.
      if ((this.name === 'keyprod') || (this.pasword === 'keyprod')) {

        // Flag user as logged in
        this.$store.commit('login')

        // Redirect to orders page.
        this.$router.push({ name: "orders"}) 
      } else {

        // Flag an error.
        this.invalidLogin = true
      } 
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
