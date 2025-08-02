// app/api/assets/route.ts
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

const DB_NAME = 'AssetsManagement';
const COLLECTION_NAME = 'assets';

export async function GET(req: NextRequest) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const assets = await collection.find({}).toArray();

    // Convert ObjectId to string for _id before sending to frontend
    const serializedAssets = assets.map(asset => ({
      ...asset,
      _id: asset._id.toString(),
    }));

    return NextResponse.json(serializedAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ message: 'Failed to fetch assets', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Add detailed environment debugging
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI?.substring(0, 20) || 'undefined');

    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI ? 'URI present' : 'URI MISSING');
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newAsset = await req.json();
    console.log('Received asset data for POST:', JSON.stringify(newAsset, null, 2));

    // Ensure 'value' field is a number
    if (newAsset.value && typeof newAsset.value === 'string') {
        newAsset.value = parseFloat(newAsset.value);
        if (isNaN(newAsset.value)) {
            throw new Error('Invalid value provided for asset.value: not a valid number.');
        }
    }

    const result = await collection.insertOne(newAsset);
    
    if (!result.acknowledged || !result.insertedId) {
      console.error('MongoDB insert not acknowledged or no ID returned. Result:', JSON.stringify(result, null, 2));
      return NextResponse.json({ message: 'Failed to create asset: Insertion not acknowledged or no ID returned' }, { status: 500 });
    }

    console.log('Successfully inserted asset with _id:', result.insertedId.toString());
    // Ensure _id is returned as a string
    return NextResponse.json({ ...newAsset, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error('Detailed error in POST:', error);
    return NextResponse.json({ 
      message: `Failed to create asset: ${(error as Error).message}`,
      stack: (error as Error).stack 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { _id, ...updatedAsset } = await req.json();

    if (!_id) {
      return NextResponse.json({ message: 'Asset ID is required for update' }, { status: 400 });
    }

    // Ensure 'value' field is a number for updates too
    if (updatedAsset.value && typeof updatedAsset.value === 'string') {
        updatedAsset.value = parseFloat(updatedAsset.value);
        if (isNaN(updatedAsset.value)) {
            console.error('Parsed value for update is NaN, removing value field from update.');
            delete updatedAsset.value; // Remove if invalid to prevent errors
        }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedAsset }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'No changes made to asset' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Asset updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ message: 'Failed to update asset', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Asset ID is required for deletion' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Asset deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ message: 'Failed to delete asset', error: (error as Error).message }, { status: 500 });
  }
}
