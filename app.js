// @ts-check
//  <ImportConfiguration>-----------------
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const dbContext = require("./data/databaseContext");
//  </ImportConfiguration>

// <Locate file and folder>-----------------------------
const fs = require('fs')
//const path = require('path')
//const file = path.basename('/Users/remyg/Programming/Azure/SendFilesToCosmosDB_javascript/jsonFiles/19.json');
const file = '/Users/remyg/Programming/Azure/test/20.json';

//const slicedFile = file.slice(0,1);
//read json file

function TempHumJson(link, callback, errorCallback) {

  fs.readFile(link, 'utf8', (err, jsonString) => {
    if (err) {
      //   console.log("File read failed:", err)
        errorCallback('File read failed');
    }
    try {
        const item = JSON.parse(jsonString)
        var temperature = item.Body.temperature;
        var humidity = item.Body.humidity;
        callback(temperature, humidity);
    }
    catch(err) {
      //   console.log('Error parsing JSON string:', err)
        errorCallback('Error parsing JSON string');
    }
  })
}
//declare the temperature and humidity variables

var newItem;
//call the function
TempHumJson(file, (temp, hum) => {

  newItem = {
    id: Date.now().toString(),
    temperature: temp,
    humidity: hum,
    description: 'Temperature and Humidity data',
    isComplete: false
  };

  console.log(`temp is ${temp}`);
  console.log(`Hum is ${hum}`);
  return

}, (errorMessage) => {
  console.log(`The following error occured: ${errorMessage}`)
});

//console.log("Final temperature is " + humidityFromJson);
//console.log("Final humidity is " + temperatureFromJson)




// </Locate file and folder>-----------------


//  <DefineNewItem>------------------------------------------

// const newItem = {
//   //id: "3",
//   //category: "fun",
//   //name: "Cosmos DB",
//   //description: "Complete Cosmos DB Node.js Quickstart ⚡",
//   //isComplete: false
//   id: Date.now().toString(),
//   temperature: temperatureFromJson,
//   humidity: humidityFromJson,
//   description: 'Temperature and Humidity data',
//   isComplete: false
// };
//  </DefineNewItem>----------------------


async function main() {
  
  // <CreateClientObjectDatabaseContainer>
  const { endpoint, key, databaseId, containerId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  await dbContext.create(client, databaseId, containerId);
  // </CreateClientObjectDatabaseContainer>
  
  try {
    // <QueryItems>------------------------------------------------------
    console.log(`Querying container: Items`);

    // query to return all items
    const querySpec = {
      query: "SELECT * from c"
    };
    
    // read all items in the Items container
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    items.forEach(item => {
      console.log(`${item.id} - ${item.description}`);
    });
    // </QueryItems>---------------------------
    

    // <CreateItem>-----------------------------------------------------------
    /** Create new item
     * newItem is defined at the top of this file
     */



    const { resource: createdItem } = await container.items.create(newItem);

    console.log(`\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`);
    // </CreateItem>------------------------------
    


    // <UpdateItem>------------------------------------------------------------
    /** Update item
     * Pull the id and partition key value from the newly created item.
     * Update the isComplete field to true.
     */
    const { id, category } = createdItem;

    createdItem.isComplete = true;

    const { resource: updatedItem } = await container
      .item(id, category)
      .replace(createdItem);

    console.log(`Updated item: ${updatedItem.id} - ${updatedItem.description}`); 
    console.log(`Updated isComplete to ${updatedItem.isComplete}\r\n`);
    // </UpdateItem>---------------------
    


    // <DeleteItem>  ------------------------------------------------------  
    /**
     * Delete item
     * Pass the id and partition key value to delete the item
     */
    //const { resource: result } = await container.item(id, category).delete();
    //console.log(`Deleted item with id: ${id}`);
    // </DeleteItem>  
    


  } catch (err) {
    console.log(err.message);
  }
}

main();