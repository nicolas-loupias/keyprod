import axios from 'axios'
import { formatServerResponseObject } from '../helpers/fetcherHelper'

/**
 * Gets all parcels.
 * 
 * @returns all parcels
 */
 export const fetchAllParcels = async function() {
  const response = await axios.get('/api/parcels')

   // Correct relationship format.
  const parcels = response.data.parcels.map((parcel) => {
    return formatServerResponseObject(parcel)
  })

  return parcels
}

/**
 * Add a new parcel in db.
 * 
 * @param {Object} payload 
 * @returns Parcel created.
 */
export const addParcel = async function(payload) {
  const response = await axios.post('/api/parcel/add', payload)
  return formatServerResponseObject(response.data.parcel)
}

/**
 * Flag a parcel as sent in DB.
 * 
 * @param {int} parcelId 
 * @returns Updated parcel
 */
export const sendParcel = async function(parcelId) {
  const response = await axios.post('/api/parcel/send', parcelId)
  return response.data
}

/**
 * Asscoiate a product to a parcel.
 * 
 * @param {Object} payload 
 * @returns Boolean
 */
export const attachParcel = async function(payload) {
  const response = await axios.post('/api/parcel/attach', payload)
  return response.data
}