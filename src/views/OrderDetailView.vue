<template>
  <div>

    <!-- Loader while data are loading -->
    <Loader
      :showLoader="(! order) || (! parcels)"
    />

    <div v-if="order && parcels" class="pa-3">

      <div class="white--text mb-3">
        <div class="font-weight-bold display-1 text-white">{{ order.name }}</div>
        <div>Total weight: {{ getUsedWeight }} Kg</div>
        <div>Status: {{ getOrderStatus }}</div>
      </div>

        <!-- Header -->
      <v-toolbar color="primary">
        <v-toolbar-title>Products</v-toolbar-title>
      </v-toolbar>

      <!-- Show all products -->
      <productCard
        :products="getProducts"
        :user="order.user"
        :scanHandler="scanProduct"
      >
      </productCard>  
    </div>

  </div>
</template>

<script>

import ProductCard from '@/components/Product/ProductCard.vue'
import { mapState } from 'vuex'
import { fetchAllOrders } from '@/services/orderFetchers'
import { fetchAllParcels } from '@/services/parcelFetchers'
import Loader from '@/components/Loader.vue'
import { getWeightTotal } from '@/helpers/parcelHelper'

export default {
  name: 'OrdersDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    order: null
  }),
  computed: {
    ...mapState(['orders', 'parcels']),

    /**
     * Return used parcel weight
     */
    getUsedWeight() {
      return getWeightTotal(this.getProducts)
    },

    /**
     * Return lots of products which belong to the order.
     */
    getProducts() {
      return this.order.products
    },

    /**
     * Get the orser string status.
     */
    getOrderStatus() {
      let status = 'Completed'

      switch (this.order.status) {
        case 'pending':
            status = 'Pending'
        break;
        case 'inprogress':
            status = 'In progress'
        break;
      }

      return status
    }
  },
  methods: {

    /**
     * Flag product as scan in store.
     */
    scanProduct(id) {
      this.$store.commit('setProductStatus', {orderId: this.id, productId: id, productStatus: 'prepared', orderStatus: 'inprogress'})
    },
  },
  mounted() {

    // Initial mock loading
    if (! this.orders) {

      fetchAllOrders().then((res) => {

        // Store loaded data.
        this.$store.commit('setOrderList', res)

        // Load current order.
        this.order = res.find(item => item.id === this.id)
      })
    } else {
      this.order = this.orders.find(item => item.id === this.id)
    }

    if (! this.parcels) {

      fetchAllParcels().then((res) => {

        // Flag user as logged in
        this.$store.commit('setParcelList', res)
      })
    }
  },
  components: {
    ProductCard,
    Loader
  }
}
</script>
