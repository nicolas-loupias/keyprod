<template>
  <div>

    <v-data-table
      :headers="headers"
      :items="parcelList"
      :items-per-page="10"
      class="elevation-1"
      sortBy="status"
      :sortDesc="true"
    >

       <!-- Product count -->
      <template v-slot:item.products="{ item }">
        {{ getProductsCount(item) }}
      </template>

      <!-- Weight used -->
      <template v-slot:item.usedWeight="{ item }">
        {{ getUsedWeight(item) }}
      </template>

      <!-- Available weight -->
      <template v-slot:item.user="{ item }">
        {{ item.user.name }}
      </template>

      <!-- Status -->
      <template v-slot:item.status="{ item }">
        <div v-html="getStatus(item.status)"></div>
      </template>

      <template v-slot:item.sentDate="{ item }">
        {{ getDate(item.sentDate) }}
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn
          v-if="item.status !== 'sent'"
          color="deep-purple lighten-2"
          text
          @click="showSendParcelDialog(item)"
        >
          Send parcel
        </v-btn>
      </template>
      
    </v-data-table>

    <SendParcelDialog
      ref="sendParcelDialog"
      :activeParcel="activeParcel"
    />
  </div>
</template>

<script>

import SendParcelDialog from './SendParcelDialog.vue'
import { getWeightTotal } from '@/helpers/parcelHelper'

export default {
  name: 'ParcelList',
  props: {
    parcelList: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    activeParcel: null,
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'Tacking code',  value: 'tracking'},
      {text: 'Products', value: 'products'},
      {text: 'Weight used (kg)',  value: 'usedWeight'},
      {text: 'Max weight (kg)', value: 'weight'},
      {text: 'User', value: 'user'},
      {text: 'Status', value: 'status'},
      {text: 'Sent date', value: 'sentDate'},
      {text: 'Action', value: 'action'},
    ],
  }),
  methods: {

    /**
     * Show send dialog.
     */
    showSendParcelDialog(parcel) {
      this.activeParcel = parcel
      this.$refs.sendParcelDialog.showDialog = true
    },

    /**
     * Format a date to local format.
     */
    getDate(itemDate) {
      return itemDate ? (new Date(itemDate)).toLocaleDateString() : null
    },

    /**
     * Get parcel string status.
     */
    getStatus(status) {

      let statusString = null

      switch (status) {
        case 'pending':
          statusString = '<span class="red pa-2">Pending</span>'
        break;
        case 'sent': 
          statusString = '<span class="green pa-2">Sent</span>'
        break; 
      }

      return statusString
    },

    /**
     * Returns the number of products associated to a parcel. 
     */
    getProductsCount(parcel) {
      return parcel.products.length
    },

    /**
     * Return used parcel weight
     */
    getUsedWeight(item) {
      getWeightTotal(item.products)
    },
  },
  components: {
    SendParcelDialog,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>