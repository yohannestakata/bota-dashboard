import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type IdParams = { id: string };

export async function DELETE(
  req: NextRequest,
  context: { params: IdParams } | { params: Promise<IdParams> }
) {
  try {
    const { id } = await (context as { params: IdParams | Promise<IdParams> })
      .params;

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

    const token = String(id);
    const looksUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        token
      );
    if (!looksUuid) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    console.log("[places.delete] deleting", { id: token });
    const { data, error } = await supabaseAdmin
      .from("places")
      .delete()
      .eq("id", token)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("[places.delete] error", error);
      throw new Error(error.message);
    }
    if (!data) {
      console.warn("[places.delete] no row matched", { id: token });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.log("[places.delete] deleted row", data);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("[places.delete] exception", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
