import { NextRequest } from "next/server";
import { aj } from "../../../config/Arcjet";
export async function GET(req) {
  const userId = "user123"; // Replace with your authenticated user ID
  const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return new Response("Too many requests", { status: 429 });
  }

  return new Response("Hello world");
}
