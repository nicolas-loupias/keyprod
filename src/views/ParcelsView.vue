<template>
  <div>

    <!-- Header -->
    <v-toolbar color="primary">
      <v-toolbar-title>Parcels</v-toolbar-title>
    </v-toolbar>

    <!-- Loader while data are loading -->
    <Loader
      :showLoader="! parcels"
    />

    <!-- Parcels list -->
    <ParcelList
      v-if="parcels"
      :parcelList="parcels"
    />
  </div>
          
</template>

<script>

  import ParcelList from '../components/Parcel/ParcelList.vue'
  import { fetchAllParcels } from '../services/parcelFetchers'
  import { mapState } from 'vuex'
  import Loader from '../components/Loader.vue'

  export default {
    name: 'ParcelsView',
    data() {
      return {}
    },
    computed: {

      // Import variables from store.
      ...mapState(['parcels']),
    },
    mounted() {

      // Initial mock loading.
      if (! this.parcels) {

        fetchAllParcels().then((res) => {

          // Keep into store to be able to use it later.
          this.$store.commit('setParcelList', res)
        })
      }
    },
    components: {
      ParcelList,
      Loader
    }
  }
</script>

<style>
</style>
