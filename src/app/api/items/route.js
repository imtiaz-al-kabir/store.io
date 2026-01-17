import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const db = await getDb();
        const items = await db.collection("products").find({}).toArray();

        // Map _id to id
        const formattedItems = items.map(item => ({
            ...item,
            id: item._id.toString()
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const db = await getDb();

        // Basic validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await db.collection("products").insertOne(body);

        return NextResponse.json({
            ...body,
            id: result.insertedId.toString()
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
