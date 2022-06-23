<template>
  <div class="text-center">
    
    <v-dialog v-model="showDialog" width="600">

      <v-card v-if="activeProduct">

        <v-toolbar color="primary">
          <v-toolbar-title>Select a parcel</v-toolbar-title>
        </v-toolbar>
  
        <v-card-text class="justify-center">

          <!-- List of existing parcel for the user -->
          <v-select
            :items="getUserValidParcel"
            label="Parcels"
            item-text="name"
            item-value="id"
            v-model="selected"
            @change="selectParcelHandler"
          ></v-select>

        </v-card-text>

        <v-card-text class="justify-center">
          
          <!-- Size selection -->
          <v-select
            v-show="newWeightSelection"
            :items="weightList"
            label="Select weigth"
            v-model="weight"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">

          <!-- Close option on left -->
          <v-btn @click="closeDialog">Close</v-btn>
          
          <v-spacer></v-spacer>

          <!-- Main action on right -->
          <v-btn color="primary" @click="accept()">
            <span v-if="newWeightSelection">Create</span>
            <span v-else>Add to parcel</span>
          </v-btn>

        </v-card-actions>
     
        <!-- Error handler message -->
        <v-snackbar color="primary" v-model="invalidSelection">
          Please select a value.
        </v-snackbar>

        <v-snackbar color="primary" v-model="tooHeavy">
          The selected product is too heavy for this parcel please select another one.
        </v-snackbar>

     </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addParcel, attachParcel} from '@/services/parcelFetchers'
import { getWeightTotal } from '@/helpers/parcelHelper'

export default {
  name: 'AttachParcel',
  props: {
    activeProduct: {
      type: Object|null,
      required: true
    },
    user: {
      type: Object|null,
      required: true
    },
  },
  data: () => ({
    showDialog: false,
    invalidSelection: false,
    weight: null,
    weightList: [2, 3, 5, 10],
    selected: null,
    newWeightSelection: false,
    tooHeavy: false
  }),
  computed: {
    ...mapState(['parcels']),

    /**
     * Return all parcels which are not sent for the customer.
     */
    getUserValidParcel() {
      const parcelList = (this.parcels) ? this.parcels.filter((parcel) => parcel.user.id === this.user.id && parcel.status === 'pending') : []

      // Add the add option at first option.
      parcelList.unshift({id: -1, name: 'Add new parcel'})
      return parcelList
    }
  },
  methods: {
    accept() {
    
      // Create new parcel.
      if (this.selected === -1) {

        // Make sure the weight is selected.
        if (this.weight) {

          // Make sure the parcel is not too small.
          if (this.activeProduct.weight > this.weight) {
            this.tooHeavy = true
          } else {
            // Build required data.
            const parcel = {
              weight: this.weight,
              products: {data: [this.activeProduct]}, 
              user: {
                data: this.user
              }
            }
            

            // Add a nw parcel atached to the user and link it to the product.
            addParcel(parcel).then((res) => {

              // Keep into store to be able to use it later.
              this.$store.commit('addParcelToList', res)
            }) 

            // Close itself.
            this.closeDialog()
          }
        } else {
          this.invalidSelection = true
        }
      } else {

        // Make sure something has been selected.
        if (this.selected) {

          // Check if the parcel is not too small.
          const parcels = this.parcels.filter((parcel) => parcel.id === this.selected)
          const parcelTotalHeight = getWeightTotal(parcels[0].products)

          if ((parcelTotalHeight + this.activeProduct.weight) > parcels[0].weight) {
            this.tooHeavy = true
          } else {

            const $payload = {
              product: this.activeProduct, 
              parcelId: this.selected
            }

            // Save at server side.
            attachParcel($payload).then((res) =>{
              this.$store.commit('setProductParcel', $payload)
            })
  
            // Close itself.
            this.closeDialog()
          }
        } else {
          this.invalidSelection = true
        }
      }
    },

    /**
     * Show or hide add option if selected.
     */
    selectParcelHandler() {
      this.newWeightSelection = (this.selected === -1)
    },

    /**
     * Reset deilog before closing it.
     */
    closeDialog(){
      this.selected = null
      this.invalidSelection = false
      this.weight = null,
      this.newWeightSelection= false
      this.showDialog = false
    }
  },
}

</script>