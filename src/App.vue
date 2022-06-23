<template>
  <div id="app">

    <v-app>
      <v-app-bar app dense fixed>
        <v-toolbar-title>
          <img class="logo" src="../public/images/logos/KeyProd-Logo-White--Transparent-SMALL.png">
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text to="/">
            <span v-if="loggedIn">Orders</span>
            <span v-else>Login</span>
          </v-btn>
          <v-btn text to="/parcels" v-if="loggedIn">Parcels</v-btn>
          <v-btn text to="/about">About</v-btn>
        </v-toolbar-items> 
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="loggedIn">
          Welcome Mr KeyProd
        </v-toolbar-title>
      </v-app-bar>
      <v-content>
        <v-container fluid > 
          <div class="home pa-5">
            <router-view/>
          </div>
        </v-container>
      </v-content>
    </v-app>

  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'MainApp',
   data() {
    return {}
  },
  computed: {

    // Import variables from store.
    ...mapState(['loggedIn']),
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.home {
  background: #63666A
}

.logo {
  padding-top: 45px;
  height: 100px;
}
</style>
