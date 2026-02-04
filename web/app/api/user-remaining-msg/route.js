import { NextResponse } from "next/server";
import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";
export async function POST(request) {
  const user = await currentUser();
  const { token } = await request.json();
  if (token) {
    const decision = await aj.protect(request, {
      userId: user?.primaryEmailAddress?.emailAddress,
      requested: token,
    });

    if (decision.isDenied()) {
      return NextResponse.json({
        error: "Too many requests",
        remainingToken: decision.reason.remaining,
      });
    }

    return NextResponse.json({
      allowed: true,
      remainingToken: decision.reason.remaining,
    });
  } else {
    const decision = await aj.protect(request, {
      userId: user?.primaryEmailAddress?.emailAddress,
      requested: 0,
    });
    return NextResponse.json({ remainingToken: decision.reason.remaining });
  }
}
