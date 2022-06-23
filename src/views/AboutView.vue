<template>
  <v-card dark flat class="text-left">

    <v-toolbar color="primary">
      <v-toolbar-title>Implementation explaination</v-toolbar-title>
    </v-toolbar>

    <v-card-text>

      <h3>Tools</h3>
      <p>
        I use axios to cool the Api Rest<br />
        The API mock has been managed using mirageJs. It didn't give me 100% the expected result so I have done some helper to convert data to be more accurante with a real life Api format.
        mirageJs is compatible with different serializer but none of them match a real Rest Api and relationship data format.<br /><br />
        I am using Vuex as a store to prevent mutiple load of data.<br />
        For the design I used vuetify as required.
      </p>

      <h3>Usage</h3>
      <p>
        Please refer to read me to install it.<br />
        To use the application you need to be logged, only login and about page are public.<br /><br />
        <ul> 
          <li>hLogin: keyprod</li>
          <li>Password: Keyprod</li>
        </ul>
      </p>
        
      <h3>Data</h3>
      <p>
        Data have been build respection some relationships:
        <h5>Order:</h5>
        <ul> 
          <li>has many products</li>
          <li>belong to 1 user</li>
        </ul>

        <h5>Product:</h5>
        <ul> 
          <li>belong to 1 order</li>
          <li>belong to 1 parcel</li>
        </ul>

        <h5>User:</h5>
        <ul> 
          <li>has many orders</li>
          <li>has many parcels (due to parcel mixed for different orders)</li>
        </ul>

        <h5>Parcel:</h5>
        <ul> 
          <li>has many products</li>
          <li>belong to 1 user</li>
        </ul>

        <h5>Decisions:</h5>
        I have choose a different weight for each product type:
        <ul> 
          <li>KeyNetic: 1kg</li>
          <li>KeyVibe: 3kg</li>
        </ul> <br />

        You can have 4 different weight of parcel: 1, 3, 5, 10 kg
      </p>

      <h3>Mocking</h3>
      <p>
        Three types of order are created: pending, in progress, completed. This orders have a random number of products, it changes each time tyou reload the application.<br />
        Product are created respecting the two suggested type: KeyVibe and KeyNetic.<br />
        Random users are createdated and attached to orders, so the same user has pending, in porgress and completed orders.
      </p>
      

      <h3>Functionnalities</h3>
      <p>
        As a manager you can:
        <ul>
          <li>View and sort a list of orders</li>
          <li>View and order details</li>
          <li>Scan a product to validate it with the current order (Check to detect incorect scan), this change the product and the order status</li>
          <li>Attach a prodcut to a parcel (or create a new parcel if all used)</li>
          <li>View and sort a list of parcels</li>
          <li>Flag a parcel as sent and adding a tracking code (this will change product and order status)</li>
        </ul>
      </p>

      <h3>Issues</h3>
      <p>
        My main issue was to use mirageJs as a mocking framework. I have spent lost of time (3 or 4hours in total) to try to make it working as a real RestApi tool without any succes.
      </p>

      <h3>Improvement</h3>
      <p>
        The following imporvement can be done:
        <ul>
          <li>Display user address in parcel page</li>
          <li>Display all parcel info from order detail page</li>
          <li>Add search for orders and parcels list</li>
          <li>View a user history for orders and parcels</li>
        </ul>
      </p>
      
    </v-card-text>
  </v-card>
</template>
