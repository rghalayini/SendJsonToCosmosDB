# JSON loader to Azure CosmosDB

This is a node.js app that serves the following:
_ read a local json file from a local directory
_ deserialise the json file
_ create a new json file by extracting the temperature and humidity data, and adding the current time
_ send the new json file to CosmosDB

Replace the endpoint and the key in the config.js file to match those of CosmosDB.