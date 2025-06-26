"use server";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/lib/mongodb";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { IUser } from "@/types/typesData";
import VerificationCode from "@/models/verificationCodeModel";

interface NewIUser extends IUser {
    _id: any;
}

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        const { firstName, lastName, email, password, phoneNumber, location, verificationCode } = userData;

        if (!firstName || !lastName || !email || !password || !phoneNumber || !location || !verificationCode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const code = await VerificationCode.findOne({ email });
        if (!code) {
            return NextResponse.json({ error: "Verification code not found" }, { status: 404 });
        }
        if (code.code !== verificationCode) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
        }

        const newUser: NewIUser = new User({ firstName, lastName, email, password, phoneNumber, location });
        const accessToken = generateAccessToken(newUser._id.toString());
        const refreshToken = generateRefreshToken(newUser._id.toString());
        await newUser.save();
        return NextResponse.json({ accessToken, refreshToken, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 },
        );
    }
}

