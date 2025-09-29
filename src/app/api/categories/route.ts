import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  name?: string;
  description?: string | null;
  icon_name?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const name = (body?.name || "").trim();
    if (!name || name.length < 2)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (n: string) => cookieStore.get(n)?.value,
          set: () => {},
          remove: () => {},
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!supabaseAdmin)
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );

    const description = (body.description ?? null) as string | null;
    const icon_name = (body.icon_name ?? null) as string | null;

    let created: { id: number } | null = null;
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidateName = attempt === 0 ? name : `${name} ${attempt + 1}`;
      const { data, error } = await supabaseAdmin
        .from("categories")
        .insert({ name: candidateName, description, icon_name })
        .select("id")
        .maybeSingle();
      if (!error && data) {
        created = data;
        break;
      }
      const errCode = (error as { code?: string } | null)?.code;
      if (
        error &&
        (errCode === "23505" ||
          error?.message?.toLowerCase().includes("unique"))
      ) {
        lastErr = error;
        continue;
      }
      if (error) throw new Error(error.message);
    }

    if (!created) {
      const msg =
        lastErr instanceof Error
          ? lastErr.message
          : "Duplicate slug, please try another name";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ id: created.id }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
