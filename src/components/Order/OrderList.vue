<template>
    <v-data-table
      :headers="headers"
      :items="orderList"
      :items-per-page="10"
      sortBy="status"
      :sortDesc="true"
      class="elevation-1"
      @click:row="handleClickRow"
    >
      <!-- format date -->
      <template v-slot:item.createdDate="{ item }">
        {{ getDate(item.createdDate) }}
      </template>

      <!-- User last action date -->
      <template v-slot:item.updatedDate="{ item }">
        {{ getUpdatedDate(item) }}
      </template>

      <!-- Get user -->
      <template v-slot:item.user="{ item }">
        {{ item.user.name }}
      </template>

      <!-- Product count -->
      <template v-slot:item.products="{ item }">
        {{ getProductsCount(item) }}
      </template>

      <!-- Total weight -->
      <template v-slot:item.weight="{ item }">
        {{ getUsedWeight(item) }}
      </template>

      <!-- Status -->
      <template v-slot:item.status="{ item }">
        <div v-html="getStatus(item.status)"></div>
      </template>
    
    </v-data-table>
</template>

<script>

import { getWeightTotal } from '@/helpers/parcelHelper'

export default {
  name: 'OrderList',
  props: {
    orderList: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'Created at',  value: 'createdDate'},
      {text: 'Last action',  value: 'updatedDate'},
      {text: 'User', value: 'user'},
      {text: 'Products', value: 'products'},
      {text: 'Total weight (kg)', value: 'weight'},
      {text: 'Status', value: 'status'},
    ],
  }),
  methods: {

    /**
     * Format a date to local format.
     */
    getDate(itemDate) {
      return (new Date(itemDate)).toLocaleDateString()
    },

    /**
     * Return an updated date.
     */
    getUpdatedDate(item) {

      // Use created date if the product has never been changed.
      const itemDate = item.updatedDate ? item.updatedDate : item.createdDate
      return (new Date(itemDate)).toLocaleDateString()
    },

    /**
     * Returns the number of products associated to an order. 
     */
    getProductsCount(order) {
      return order.products.length
    },

    /**
     * Get order string status.
     */
    getStatus(status) {

      let statusString = null

      switch (status) {
        case 'pending':
          statusString = '<span class="red pa-2">Pending</span>'
        break;
        case 'inprogress':
          statusString = '<span class="orange pa-2">In progress</span>'
        break;
        case 'completed': 
          statusString = '<span class="green pa-2">Completed</span>'
        break; 
      }

      return statusString
    },

    /**
     * Return used parcel weight.
     */
    getUsedWeight(item) {
      getWeightTotal(item.products)
    },

    /**
     * Handle clik on a row
     */
    handleClickRow(item) {
      this.$router.push({name: 'orderDetail', params: { id: item.id }});
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .elevation-1::v-deep td {
    cursor: pointer;
  }
</style>
