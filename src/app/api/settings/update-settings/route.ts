import { db } from "@/database/db";
import { settingsTable } from "@/database/schemas/settingsTable";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.showFeedback !== "boolean") {
      return NextResponse.json(
        { error: "Invalid showFeedback value" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return NextResponse.json(
        { error: "Failed to get session" },
        { status: 400 },
      );
    }

    const userId = data.user.id;

    await db
      .update(settingsTable)
      .set({ showFeedback: body.showFeedback })
      .where(eq(settingsTable.userId, userId));

    return NextResponse.json(
      { message: "Settings updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
