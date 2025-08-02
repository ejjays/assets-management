// test-mongo-insert.js
const { MongoClient } = require('mongodb');

// Your MongoDB URI (obtained from .env.local or direct input)
const uri = 'mongodb+srv://ejalloso021:WriDV1zQfHi8a7wd@cluster0.poahyow.mongodb.net/AssetsManagement?retryWrites=true&w=majority&appName=Cluster0';

const dbName = 'AssetsManagement'; // Your database name
const collectionName = 'assets'; // Your collection name

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const testAsset = {
      name: `Test Asset from Script - ${new Date().toLocaleString()}`,
      category: 'Test Category',
      status: 'Active',
      location: 'Test Location',
      purchaseDate: '2023-01-01',
      value: 99.99,
      description: 'This is a test asset inserted directly from a Node.js script.',
      scriptGenerated: true,
      timestamp: new Date(),
    };

    console.log(`Attempting to insert: ${testAsset.name}`);
    const result = await collection.insertOne(testAsset);
    
    if (result.acknowledged && result.insertedId) {
      console.log(`Successfully inserted document with _id: ${result.insertedId}`);
      // Now, try to read it back immediately
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      console.log('Found inserted document:', insertedDoc);
    } else {
      console.error('Insert operation not acknowledged or no ID returned.');
    }

  } catch (err) {
    console.error('An error occurred:', err);
    console.error('Error details:', err.message, err.stack);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

run().catch(console.dir);
