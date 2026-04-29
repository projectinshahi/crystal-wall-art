import { sendOTP } from "@/lib/otp";

export async function POST(req: Request) {
  const { mobile } = await req.json();

  if (!mobile) {
    return Response.json({ error: "Mobile required" }, { status: 400 });
  }

  await sendOTP(mobile);

  return Response.json({ success: true });
}