import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

// default config
export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#FF0000',
      }
    }
  },
})
