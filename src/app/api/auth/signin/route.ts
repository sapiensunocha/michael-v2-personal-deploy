"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import VerificationCode from "@/models/verificationCodeModel";

export async function POST(req: NextRequest) {
    try {
        const { email, password, verificationCode } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        await connectDB();
        
        const user:any = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
        const code = await VerificationCode.findOne({ email });
        if (!code) {
            return NextResponse.json({ error: "Verification code not found" }, { status: 404 });
        }
        if (code.code !== verificationCode) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
        }
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return NextResponse.json({ accessToken, refreshToken, email: user.email, firstName: user.firstName, lastName:user.lastName }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 },
        );
    }
}