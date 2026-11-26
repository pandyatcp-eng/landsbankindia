import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const params = request.nextUrl.searchParams;
    const q = (params.get("q") || "").trim();
    const category = params.get("category") || "";
    const state = params.get("state") || "";
    const district = params.get("district") || "";
    const maxPrice = Number(params.get("maxPrice") || 0);
    const limit = Math.min(Math.max(Number(params.get("limit") || 20), 1), 50);

    let query = supabase.from("land_listings")
      .select("id,title,description,category,state,district,city_or_village,area_value,area_unit,asking_price_inr,record_status,created_at")
      .eq("status", "published").order("created_at", { ascending: false }).limit(limit);

    if (category) query = query.eq("category", category);
    if (state) query = query.ilike("state", `%${state}%`);
    if (district) query = query.ilike("district", `%${district}%`);
    if (maxPrice > 0) query = query.lte("asking_price_inr", maxPrice);
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,state.ilike.%${q}%,district.ilike.%${q}%,city_or_village.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: "Could not search listings.", details: error.message }, { status: 400 });
    return NextResponse.json({ listings: data ?? [], source: "database", count: data?.length ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search service unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
