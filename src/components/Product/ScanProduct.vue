<template>
  <div class="text-center">

    <v-dialog v-model="showDialog" width="600">

      <v-card v-if="activeProduct">

        <v-toolbar color="primary">
          <v-toolbar-title>Scan a product</v-toolbar-title>
        </v-toolbar>
  
        <v-card-text class="justify-center">
          <v-img :src="`/images/products/${activeProduct.name}.png`"></v-img>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">

          <!-- Valid the expected product -->
          <v-btn color="primary" @click="accept(activeProduct.code)">
            {{ activeProduct.code }}
          </v-btn>

          <v-spacer></v-spacer>

          <!-- Trigger an error with an incorrect code -->
          <v-btn @click="accept(generateRandomCode)">
            {{ generateRandomCode }}
          </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn @click="showDialog = false">Close</v-btn>
        </v-card-actions>

        <!-- Error message to be displayed -->
        <v-snackbar
          color="primary"
          v-model="invalidCode"
        >
          Invalid product scanned!
        </v-snackbar>

     </v-card>

    </v-dialog>
  </div>
</template>

<script>

import { getUniqueCode } from "../../helpers/stringHelper"

export default {
  name: 'ScanProduct',
  props: {
    acceptHandler: {
      type: Function,
      required: true
    },
    activeProduct: {
      type: Object,
      default: null
    },
  },
  data: () => ({
    showDialog: false,
    invalidCode: false
  }),
  computed: {

    /**
     * Generate a random prodcut code.
     */
    generateRandomCode() {
      return getUniqueCode(this.activeProduct.name)
    }
  },
  methods: {
    /**
     * Accept action.
     */
    accept(code) {

      // Make sure the correct product has been sacnned.
      if (code === this.activeProduct.code) {

        // Call parent accept function
        this.acceptHandler(this.activeProduct.id)

        // Close itself
        this.showDialog = false
      } else {

        // Show error message
        this.invalidCode = true
      }
    }
  },
}

</script>