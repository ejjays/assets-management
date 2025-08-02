// app/api/assets/route.ts
import { MongoClient } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('AssetsManagement'); 
    const collection = db.collection('assets'); 

    const assets = await collection.find({}).toArray();

    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ message: 'Failed to fetch assets', error: (error as Error).message }, { status: 500 });
  }
}
