import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
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
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin)
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  if (!supabaseAdmin)
    return {
      ok: false as const,
      res: NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      ),
    };
  return { ok: true as const };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const check = await requireAdmin();
    if (!("ok" in check) || !check.ok) return check.res;
    const { id } = await params;
    const cuisineId = Number(id);
    if (!Number.isFinite(cuisineId))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = (await req.json()) as {
      name?: string;
      description?: string | null;
    };
    const updates: Record<string, unknown> = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description;
    const { error } = await supabaseAdmin!
      .from("cuisine_types")
      .update(updates)
      .eq("id", cuisineId);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update cuisine" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const check = await requireAdmin();
    if (!("ok" in check) || !check.ok) return check.res;
    const { id } = await params;
    const cuisineId = Number(id);
    if (!Number.isFinite(cuisineId))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const { error } = await supabaseAdmin!
      .from("cuisine_types")
      .delete()
      .eq("id", cuisineId);
    if (error) {
      const msg =
        (error as { code?: string; message?: string }).code === "23503"
          ? "Cannot delete: cuisine is in use by places/branches"
          : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete cuisine" },
      { status: 500 }
    );
  }
}
