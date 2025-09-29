import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body?.name || "").trim();
    const place_id = String(body?.place_id || "").trim();
    if (!name || !place_id)
      return NextResponse.json(
        { error: "Name and place_id are required" },
        { status: 400 }
      );

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

    const insert: Record<string, unknown> = {
      place_id,
      name,
      description: body?.description ?? null,
      phone: body?.phone ?? null,
      website_url: body?.website_url ?? null,
      address_line1: body?.address_line1 ?? null,
      address_line2: body?.address_line2 ?? null,
      city: body?.city ?? null,
      state: body?.state ?? null,
      postal_code: body?.postal_code ?? null,
      country: body?.country ?? null,
      latitude: body?.latitude ?? null,
      longitude: body?.longitude ?? null,
      price_range: body?.price_range ?? null,
      is_main_branch: body?.is_main_branch ?? false,
      is_active: body?.is_active ?? true,
    };

    const { data, error } = await supabaseAdmin
      .from("branches")
      .insert(insert)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return NextResponse.json({ id: data?.id }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create branch" },
      { status: 500 }
    );
  }
}
