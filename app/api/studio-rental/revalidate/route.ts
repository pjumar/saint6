import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });

  revalidateTag("studio-rental", { expire: 0 });
  revalidateTag("studio-discovery", { expire: 0 });

  for (const locale of ["en", "vi"]) {
    revalidatePath(`/${locale}/studio-rental`);
    for (const slug of [
      "room-125m2",
      "medium-room",
      "big-room",
      "concept-room-1",
      "concept-room-2",
      "concept-room-3",
    ]) {
      revalidatePath(`/${locale}/studio-rental/rooms/${slug}`);
    }
  }

  return NextResponse.json({ revalidated: true });
}
