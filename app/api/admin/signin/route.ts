import bcrypt from "bcrypt";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return Response.json(
                { success: false, message: "Missing credentials" },
                { status: 400 }
            );
        }

        // 1️⃣ Get user
        const { data: user, error } = await supabaseServer
            .from("auth_users")
            .select(`
                id,
                email,
                password_hash,
                status,
                user_profiles (
                  full_name,
                  avatar_url,
                  role_id,
                  roles (
                    id,
                    name
                  )
                )
            `)
            .eq("email", email)
            .maybeSingle();

        if (error || !user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Check password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return Response.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }

        // 3️⃣ SAFE extraction
        const profile = user.user_profiles as unknown as {
            full_name: string | null;
            avatar_url: string | null;
            role_id: string | null;
            roles: {
                id: string;
                name: string;
            } | null;
        } | null;

        const role = profile?.roles;

        // 4️⃣ SUCCESS RESPONSE
        return Response.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                status: user.status,

                profile: {
                    fullName: profile?.full_name ?? null,
                    avatarUrl: profile?.avatar_url ?? null,
                },

                role: {
                    id: role?.id ?? null,
                    name: role?.name ?? "user",
                },
            },
        });
    } catch (error: any) {
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}