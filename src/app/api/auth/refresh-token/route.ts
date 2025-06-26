"use server";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = await req.json();
    
        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token provided" } , { status: 400 });
        }
    
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid or expired refresh token" } , { status: 403 });
        }
    
        const newAccessToken = generateAccessToken(decoded.userId);
    
        return NextResponse.json({ accessToken: newAccessToken } , { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" } , { status: 500 });
    }

}
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: "GET request not allowed" } , { status: 200 });
}
