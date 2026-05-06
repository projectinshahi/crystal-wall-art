import { apiResponse } from "@/lib/api/response";
import { createUser, getUserByEmail } from "@/lib/db/repositories/public/user.public.repository";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // 1. Validate input
    if (!email || !password || !firstName || !lastName) {
      return apiResponse({ error: "Missing required fields" }, 400);
    }

    // 2. Check existing user
    const existing = await getUserByEmail(email);
    console.log("existing",existing);
    
    if (existing.length) {
      return apiResponse({ error: "User already exists" }, 400);
    }

    // 3. Hash password (ONLY here)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword, // already hashed
    });

    // 5. Return success
    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);

    return apiResponse(
      { error: "Internal server error" },
      500
    );
  }
};

// export const POST = withHandler(
//   (async())
// )