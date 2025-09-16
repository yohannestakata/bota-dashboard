import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Admin client not configured" },
      { status: 500 }
    );
  }

  const ADMIN_SIGNUP_TOKEN = process.env.ADMIN_SIGNUP_TOKEN;
  try {
    const body = await req.json();
    const { email, password, full_name, token } = body ?? {};
    if (!email || !password || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!ADMIN_SIGNUP_TOKEN || token !== ADMIN_SIGNUP_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: signUp, error: signUpErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });
    if (signUpErr || !signUp?.user) {
      return NextResponse.json(
        { error: signUpErr?.message ?? "Failed to create user" },
        { status: 500 }
      );
    }

    // Set is_admin flag on profile
    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update({ is_admin: true, full_name: full_name ?? null })
      .eq("id", signUp.user.id);
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
