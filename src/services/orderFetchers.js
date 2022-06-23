import axios from 'axios'
import { formatServerResponseObject } from '../helpers/fetcherHelper'

/**
 * Gets all orders.
 * 
 * @returns all orders
 */
export const fetchAllOrders = async function() {
  const response = await axios.get('/api/orders')

  // Correct format relationship format.
  const orders = response.data.orders.map((order) => {
    return formatServerResponseObject(order)
  })

  return orders
}