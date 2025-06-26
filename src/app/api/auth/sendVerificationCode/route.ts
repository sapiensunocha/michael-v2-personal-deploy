"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationCode from "@/models/verificationCodeModel";
import nodemailer from "nodemailer";
import crypto from "crypto";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        await connectDB();
        
        const existingCode = await VerificationCode.findOne({ email });
        if(existingCode){
            return NextResponse.json({ message:"Code already sent" }, { status: 400 });
        }
        // const existingUser = await User.findOne({ email })
        // if(existingUser){
            //     NextResponse.json("User already exists");    
            // }
            
        var code = crypto.randomInt(100000,999999).toString();
        await VerificationCode.create({ email, code });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "noreply@worlddisastercenter.org",
                pass: "irzqmslnxgxvydsm",
            },
        });
        await transporter.sendMail({
            from: "noreply@worlddisastercenter.org",
            to: email,
            subject: "Your World Disaster Center Verification Code",
            html: template(code),
        });
        return NextResponse.json({ message:"Email sent successfully" }, { status: 200 });
    } catch (error) {
        NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}
const template = (code: string) => { 
    return ` 
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            .code {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                padding: 10px;
                background: #f8f8f8;
                display: inline-block;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Your Michael Verification Code</h2>
            <p>Use the code below to verify your email address. This code is only valid for 5 minutes.</p>
            <div class="code">${code}</div>
            <p>If you did not request this, please ignore this email.</p>
            <div class="footer">&copy; 2025 Your Company. All rights reserved.</div>
        </div>
    </body>
    </html>
    `;
    };
