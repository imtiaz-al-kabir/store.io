import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const db = await getDb();
        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            provider: 'credentials'
        };

        const result = await db.collection("users").insertOne(newUser);

        return NextResponse.json({
            message: "User registered successfully",
            userId: result.insertedId.toString()
        }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}
