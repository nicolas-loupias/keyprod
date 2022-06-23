<template>
  <div >

    <!-- Header -->
    <v-toolbar color="primary">
      <v-toolbar-title>Orders</v-toolbar-title>
    </v-toolbar>

    <!-- Loader while data are loading -->
    <Loader
      :showLoader="! orders"
    />

    <!-- Order list -->
    <OrderList 
      v-if="orders"
      :orderList="orders"
    />
        
  </div>
</template>

<script>

import OrderList from '../components/Order/OrderList.vue'
import Loader from '../components/Loader.vue'
import { fetchAllOrders } from '../services/orderFetchers'
import { mapState } from 'vuex'

export default {
  name: 'OrdersView',
  data() {
    return {}
  },
  computed: {

    // Import variables from store.
    ...mapState(['orders']),
  },
  mounted() {

    // Initial mock loading.
    if (! this.orders) {

      fetchAllOrders().then((res) => {

          // Keep into store to be able to use it later.
          this.$store.commit('setOrderList', res)
      })
    }
  },
  components: {
    OrderList,
    Loader
  },
}
</script>

<style scoped>
</style>
