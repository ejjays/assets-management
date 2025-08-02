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
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI ? 'URI present' : 'URI MISSING');
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newAsset = await req.json();
    console.log('Received asset data for POST:', newAsset);
    const result = await collection.insertOne(newAsset);
    
    if (!result.acknowledged || !result.insertedId) {
      console.error('MongoDB insert not acknowledged or no ID returned:', result);
      return NextResponse.json({ message: 'Failed to create asset' }, { status: 500 });
    }

    console.log('Successfully inserted asset with _id:', result.insertedId.toString());
    // Ensure _id is returned as a string
    return NextResponse.json({ ...newAsset, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ message: 'Failed to create asset', error: (error as Error).message }, { status: 500 });
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

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedAsset }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'No changes made to asset' }, { status: 200 }); // Or 304 Not Modified
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
