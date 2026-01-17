import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const db = await getDb();
        const item = await db.collection("products").findOne({ _id: new ObjectId(id) });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...item,
            id: item._id.toString()
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
    }
}
