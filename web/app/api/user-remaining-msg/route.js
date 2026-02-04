import { NextResponse } from "next/server";
import { aj } from "../../../config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const user = await currentUser();

    // Check if user is authenticated
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    let body = {};
    try {
      body = await request.json();
    } catch (err) {
      console.error("Failed to parse request body:", err);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { token = 0 } = body;
    const requestedTokens = token || 0;

    // Call Arcjet to check rate limit
    const decision = await aj.protect(request, {
      userId: user.primaryEmailAddress.emailAddress,
      requested: requestedTokens,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          remainingToken: decision.reason.remaining || 0,
        },
        { status: 429 },
      );
    }

    return NextResponse.json({
      allowed: true,
      remainingToken: decision.reason.remaining || 0,
    });
  } catch (error) {
    console.error("Error in user-remaining-msg route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
