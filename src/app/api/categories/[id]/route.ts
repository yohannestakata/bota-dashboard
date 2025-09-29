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
    if (!("ok" in check) || check.ok !== true) return check.res;
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = (await req.json()) as {
      name?: string;
      description?: string | null;
      icon_name?: string | null;
    };
    const updates: Record<string, unknown> = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description;
    if (body.icon_name !== undefined) updates.icon_name = body.icon_name;

    const { error } = await supabaseAdmin!
      .from("categories")
      .update(updates)
      .eq("id", categoryId);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update category" },
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
    if (!("ok" in check) || check.ok !== true) return check.res;
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const { error } = await supabaseAdmin!
      .from("categories")
      .delete()
      .eq("id", categoryId);
    if (error) {
      const msg =
        (error as { code?: string; message?: string }).code === "23503"
          ? "Cannot delete: category is in use by places"
          : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
