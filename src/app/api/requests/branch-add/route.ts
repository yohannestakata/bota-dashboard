import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function getServerUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, supabase } as const;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return { user, isAdmin: !!profile?.is_admin, supabase } as const;
}

export async function GET(req: NextRequest) {
  const { user, isAdmin } = await getServerUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!supabaseAdmin)
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );

  const searchParams = req.nextUrl.searchParams;
  const pageIndex = Number(searchParams.get("pageIndex") ?? "0");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const status = searchParams.get("status") ?? "pending";
  const search = (searchParams.get("search") || "").trim();
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("branch_add_requests")
    .select(
      "id, place_id, author_id, profiles:author_id ( full_name, username ), proposed_branch, status, reviewed_by, reviewed_at, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);
  if (status !== "all") query = query.eq("status", status);
  if (search) {
    const pattern = `%${search}%`;
    query = query.filter("proposed_branch->>name", "ilike", pattern);
  }

  const { data, error, count } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [], total: count ?? 0 });
}

export async function PATCH(req: NextRequest) {
  const { user, isAdmin } = await getServerUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!supabaseAdmin)
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );

  const body = await req.json().catch(() => ({} as any));
  const id: string | undefined = body?.id;
  const action: "approve" | "reject" | undefined = body?.action;
  const rejectReason: string | undefined = body?.reason;
  if (!id || !action)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (action === "reject") {
    const { error } = await supabaseAdmin
      .from("branch_add_requests")
      .update({
        status: "rejected",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { data: reqRow, error: reqErr } = await supabaseAdmin
    .from("branch_add_requests")
    .select("place_id, proposed_branch")
    .eq("id", id)
    .maybeSingle();
  if (reqErr)
    return NextResponse.json({ error: reqErr.message }, { status: 500 });
  if (!reqRow)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const placeId = (reqRow as any).place_id as string;
  const proposedBranch = (reqRow as any).proposed_branch || {};

  const { error: branchErr } = await supabaseAdmin.from("branches").insert({
    place_id: placeId,
    name: proposedBranch.name ?? "Branch",
    address_line1: proposedBranch.address_line1 ?? null,
    city: proposedBranch.city ?? null,
    country: proposedBranch.country ?? null,
    latitude: proposedBranch.latitude ?? null,
    longitude: proposedBranch.longitude ?? null,
    is_main_branch: proposedBranch.is_main_branch ?? false,
    is_active: true,
  });
  if (branchErr)
    return NextResponse.json({ error: branchErr.message }, { status: 500 });

  const { error: markErr } = await supabaseAdmin
    .from("branch_add_requests")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (markErr)
    return NextResponse.json({ error: markErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
