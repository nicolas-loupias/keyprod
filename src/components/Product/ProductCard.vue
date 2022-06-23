<template>

  <div>

    <v-data-table
      :headers="headers"
      :items="products"
      :items-per-page="10"
      class="elevation-1"
      sortBy="status"
      :sortDesc="true"
    >
      <!-- Name -->
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>

      <!-- Product code -->
      <template v-slot:item.code="{ item }">
        {{ item.code }}
      </template>

      <!-- Weight -->
      <template v-slot:item.weight="{ item }">
        {{ item.weight }}
      </template>

      <!-- Status -->
      <template v-slot:item.status="{ item }">
        <div v-html="getStatus(item.status)"></div>
      </template>

      <!-- Parcel name -->
      <template v-slot:item.parcel="{ item }">
        <div v-html="getParcel(item.id)"></div>
      </template>

      <template v-slot:item.action="{ item }">

        <!-- Scan product option. -->
        <v-btn
          v-if="item.status === 'pending'"
          color="deep-purple lighten-2"
          text
          @click="showProductDialog(item)"
        >
          Scan product
        </v-btn>

          
        <v-btn
          v-if="(item.status === 'prepared') && (! getParcel(item.id))"
          color="deep-purple lighten-2"
          text
          @click="showParcelDialog(item)"
        >
          Add to parcel
        </v-btn>
         
      </template>
    
    </v-data-table>

    <ScanProduct
      ref="scanProduct"
      :acceptHandler="scanProductHandler"
      :activeProduct="dialogActiveProduct"
    />

    <AttachParcel
      ref="attachParcel"
      :user="user"
      :activeProduct="dialogActiveProduct"
    />

  </div>

</template>

<script>

import { mapState } from 'vuex'
import ScanProduct from '../Product/ScanProduct.vue'
import AttachParcel from '../Parcel/AttachParcel.vue'

export default {
  name: 'ProductCard',
  props: {
    products: {
      type: Array,
      required: true
    },
    scanHandler: {
      type: Function,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialogActiveProduct: null,
    headers: [
      { text: 'Name', value: 'name'},
      { text: 'Code', value: 'code'},
      { text: 'weight (kg)', value: 'weight'},
      { text: 'Status', value: 'status'},
      { text: 'Parcel', value: 'parcel'},
      { text: 'Action', value: 'action'},
    ],
  }),
  computed: {
    ...mapState(['parcels']),
  },
  methods: {
    showProductDialog(product) {
      this.dialogActiveProduct = product
      this.$refs.scanProduct.showDialog = true
    },

    /**
     * Emulate a scan action for a product.  
     */
    scanProductHandler(id) {
      this.scanHandler(id)
    },

    /**
     * Format product status.
     */
    getStatus(status) {
      let statusString = null

      switch (status) {
        case 'pending':
          statusString = '<span class="red pa-2">Pending</span>'
        break;
        case 'prepared':
          statusString = '<span class="orange pa-2">Prepared</span>'
        break;
        case 'sent': 
          statusString = '<span class="green pa-2">Sent</span>'
        break; 
      }

      return statusString
    },

    /**
     * Return associated parcel name if it exists.
     */
    getParcel(productId) {

      // Check if the product belong to a parcel. 
      const parcel = this.parcels.find((parcel) => {

        if (parcel.products) {
          const product = parcel.products.find(product => product.id === productId)
          return (product) ? true:  false
        } 

        return false
      })

      return parcel ? parcel.name : null
    },

    /**
     * Display the parcel option dialog
     */
    showParcelDialog(product) {
      this.dialogActiveProduct = product
      this.$refs.attachParcel.showDialog = true
    }
  }, 
  components: {
    ScanProduct,
    AttachParcel
  }, 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
