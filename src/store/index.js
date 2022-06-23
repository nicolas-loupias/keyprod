import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false, 
    orders: null,
    users: null,
    parcels: null,
  },
  getters: {
    isLoggedIn(state) {
      return state.loggedIn
    }
  },
  mutations: {
    /**
     * Flag user as logged
     * 
     * @param {} state 
     */
    login(state) {
      state.loggedIn = true
    },

    /**
     * Set the order list
     * 
     * @param {*} state 
     * @param {*} orders 
     */
    setOrderList(state, orders) {
      state.orders = orders
    },

    /**
     * Set the parcel list
     * 
     * @param {*} state 
     * @param {*} parcels 
     */
    setParcelList(state, parcels) {
      state.parcels = parcels
    },

    /**
     * Set product status from user action.
     * 
     * @param {*} state 
     * @param {*} payload 
     */
    setProductStatus(state, payload) {
      const order = state.orders.find((order) => order.id === payload.orderId)
      order.status = payload.orderStatus

      const product = order.products.find((product) => product.id === payload.productId)
      product.status = payload.productStatus
    },

    /**
     * Attach a product to a parcel.
     * 
     * @param {*} state 
     * @param {*} payload 
     */
    setProductParcel(state, payload) {
      const parcel = state.parcels.find((parcel) => parcel.id === payload.parcelId)
      parcel.products.push(payload.product)
    },

    /**
     * Create a new parcel.
     * 
     * @param {*} state 
     * @param {*} payload 
     */
     addParcelToList(state, payload) {

      // Cast to an array if null.
      if (! state.parcels) {
        state.parcels = []
      } 
      state.parcels.push(payload)
    },

    /**
     * Update a parcel.
     * 
     * @param {*} sate 
     * @param {*} payload 
     */
    updateParcel(state, payload) {
      var index = state.parcels.findIndex(parcel => parcel.id === payload.id);
      Vue.set(state.parcels, index, payload)
    }
  },
})
