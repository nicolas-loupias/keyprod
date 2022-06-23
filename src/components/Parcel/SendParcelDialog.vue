<template>
  <div class="text-center">

    <v-dialog v-model="showDialog" width="600">

      <v-card>

        <v-toolbar color="primary">
          <v-toolbar-title>Send parcel</v-toolbar-title>
        </v-toolbar>

        <!-- Loader while data are loading -->
        <Loader
          :showLoader="showLoader"
        />

        <div v-if="!showLoader">
          <v-card-text class="justify-center mt-4">
            <p>Please add a tracking code</p>

            <v-text-field
              v-model="trackingCode"
              name="tracking-code"
              label="tracking-code"
              type="text"
              required
            ></v-text-field>

          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>

            <!-- Close action on left -->
            <v-btn @click="showDialog = false">Close</v-btn>

            <v-spacer></v-spacer>

            <!-- Main action on right -->
            <v-btn color="primary" @click="accept()">Send</v-btn>

          </v-card-actions>
        </div>

        <v-snackbar color="primary" v-model="invalidForm">
          The tracking code is incorrect. it need to be at least 5 characters.
        </v-snackbar>


     </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { sendParcel } from '@/services/parcelFetchers'
import Loader from '@/components/Loader.vue'

export default {
  name: 'SenDParcelDialog',
  props: {
    activeParcel: {
      type: Object|null,
      required: true
    },
  },
  data: () => ({
    showDialog: false,
    trackingCode: null,
    invalidForm: false,
    showLoader: false
  }),
  methods: {
    /**
     * Show send dialog.
     */
    accept() {

      // Check traking validity.
      if ((this.trackingCode) && (this.trackingCode.length > 5)) {

        this.showLoader = true
        this.showDialog = false

        // Flag parcel as sent.
        sendParcel(this.activeParcel).then((res) => {

          // Force the order list to be rebuild later if needed.
          // No need to do it now as we don't use this data.
          this.$store.commit('setOrderList', null)

          // Update store.
          this.$store.commit('updateParcel', res)

          this.showLoader = false
        }) 
      } else {
        this.invalidForm = true
      }
    },
  },
  components: {
    Loader
  }
}

</script>