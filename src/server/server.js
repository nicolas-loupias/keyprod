import { createServer, Model, Factory, hasMany, belongsTo, RestSerializer } from "miragejs"
import faker from "faker"
import { getRandomNumberFromRange } from "../helpers/numberHelper"
import { getUniqueCode } from "../helpers/stringHelper"
import { getTrackingCode } from "../helpers/parcelHelper"


export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,
    models: {
      order: Model.extend({
        products: [{
          data: belongsTo(),
        }],
        user: {
          data: belongsTo()
        }
      }),
      product: Model.extend({
        order: belongsTo(),
        parcel: belongsTo(),
      }),
      user: Model.extend ({
        order: hasMany(),
        parcel: hasMany(),
      }),
      parcel: Model.extend ({
        products: [{
          data: belongsTo()
        }],
        user: {
          data: belongsTo()
        },
      })
    },
    factories: {
      product: Factory.extend({
        name(i) {

          // Select a different product each time.
          return (i % 2) ? 'KeyNetic' : 'KeyVibe'
        },
        code() {
          return getUniqueCode(this.name)
        }, 
        weight(i) {
          return (i % 2) ? 1 : 3
        },
        status() {
          return 'pending'
        },
      }),
      order : Factory.extend({
        name(i) {
          return 'Order_' + (i + 1)
        },
        createdDate(i) {

          let dateCreated = null

          // Pending order are from today or yesterday.
          if (this.status === "pending") {

            // Today.
            dateCreated = new Date()

            if (i % 2) {

              // Yesterday.
              dateCreated.setDate(dateCreated.getDate() - 1)
            }
          } else {

            // Random past date.
            dateCreated = faker.date.past()
          }

          return dateCreated
        },
        updatedDate() {

          // Create an updated date.
          let updatedDate =  new Date(this.createdDate)

          if (this.status !== "pending") {
            updatedDate.setDate(updatedDate.getDate() + getRandomNumberFromRange(2, 10))
          }

          return updatedDate
        },
      }),
      user: Factory.extend({
        name() {
          return faker.name.firstName() + '  '  + faker.name.lastName()
        }
      }),
      parcel: Factory.extend({
        name(i) {
          return 'Parcel_' + faker.datatype.uuid().substring(0, 6)
        },
        tracking() {
          return getTrackingCode()
        },
        weight() {
          return 0
        },
        status() {
          return 'pending'
        },
        sentDate() {
          return faker.date.past()
        }
      })
    },
    seeds(server) {

      // User seeder.
      const userList = server.createList("user", 5)

      // Seeder for pending orders.
      for (let i = 0; i < 4; i++) {

        const products = getOrderProductList(server, 'pending')
        const user = getUser(userList)

        // Create the order.
        server.create("order", {
          products: {data: server.createList("product", 5)}, 
          status: 'pending',
          user: {
            data: user
          }
        })
      }

      // Seeder for order in progress.
      for (let i = 0; i < 3; i++) {

        const user = getUser(userList)

        // Create the order.
        server.create("order", {
          products: {data: server.createList("product", 5, {status: 'prepared'})}, 
          status: 'inprogress',
          user: {
            data: user
          }
        })
      }      

      // Seeder for order completed.
      for (let i = 0; i < 5; i++) {

        const products = server.createList("product", 5, {status: 'sent'})
        const user = getUser(userList)

        // Create the order.
        server.create("order", {
          products: {data: products}, 
          status: 'completed',
          user: {
            data: user
          }
        })

        let totalWeight = 0 
        let parcelWeight = 0

        // Seed parcels to macth already sent data.
        products.forEach((product) => {
          totalWeight += product.weight
        })

        switch (true) {
          case (totalWeight < 2):
            parcelWeight = 2
          break;
          case (totalWeight < 3):
            parcelWeight = 3
          break;
          case (totalWeight < 5):
            parcelWeight = 5
          break;
          case (totalWeight <= 10):
            parcelWeight = 10
          break;
        }

        // Create parcel.
        server.create('parcel', {weight: parcelWeight, status: 'sent', products: {data: products}, user: {data: user}})
      }
    },
    routes() {
      this.namespace = "api";

      // All orders.
      this.get("/orders")

      // All Parcels.
      this.get('/parcels')

      // Add a new parcel from user action.
      this.post("/parcel/add" , (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        attrs.name = 'Parcel_' + faker.datatype.uuid().substring(0, 6)
        attrs.status = 'pending'
        return schema.parcels.create(attrs);
      })

      /**
       * Flag parcel as sent.
       */
      this.post("/parcel/attach" , (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        const parcel = schema.parcels.find(attrs.parcelId)
        parcel.products.data.push(attrs.product)
        return true
      })

      /**
       * Flag parcel as sent.
       */
      this.post("/parcel/send" , (schema, request) => {
        
        let parcel = JSON.parse(request.requestBody)
        parcel.status = 'sent'
        parcel.tracking = getTrackingCode()
        parcel.sentDate = new Date()
        let productToChangeList = []

        // This part of the code is due to miragejs not managing a product as same object for orders and parcel.
        // With a reall envireonment this part is not necessary.
        // Just need to update the associated product once.

        // Change associated product status.
        schema.parcels.all().models.forEach((exitsingParcel) => {

          // Only for matching product.
          if (exitsingParcel.id === parcel.id) {

            exitsingParcel.products.data.forEach((product) => {
              product.status = 'sent';

              // Store prodcut id to change it against the order list.
              productToChangeList.push(product.id)
            })
          }
        })

        // Check order status all products from an order have been sent.
        schema.orders.all().models.forEach((order) => {

          // Change flag for not completed order.
          if (order.status !== 'completed') {

            let stillPending = false

            // Check if all product have been sent now.
            order.products.data.forEach((data) => {
              
              if (productToChangeList.includes(data.id)) {
                data.status = 'sent'
              } else {

                // Check prodcuts status.
                if (data.status !== 'sent') {
                  stillPending = true
                }
              }
            })

            // Falg order as completed.
            if (! stillPending) {
              order.status = 'completed'
            }
          }
        })

        return parcel
      })
    },
  });

  return server;
}

/**
 * Returns a random list of products.
 * 
 * @param {Object} server 
 * @param {string} status 
 * @returns A list of products and statsu attached to them.
 */
function getOrderProductList(server, status) {

  // Allocate a random number of product
  const random = getRandomNumberFromRange(1, 10)
  const products = []
  const productList = server.createList("product", random)

  for (let j = 0; j < random; j++) {
    products.push({data: productList[j], status: status})
  }
  
  return products
}

/**
 * Get a random user.
 * 
 * @param {array} userList 
 * @returns A user from teh available list.
 */
function getUser(userList) {
  const randomUser = getRandomNumberFromRange(1, userList.length -1)
  return userList[randomUser]
}

