import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/** Sanity webhook: any publish refreshes every page that reads from Sanity (tag "sanity"). */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ ok: false, error: "invalid-signature" }, { status: 401 });
  // expire: 0 so the very next visit already shows what she just published.
  revalidateTag("sanity", { expire: 0 });
  return NextResponse.json({ ok: true, type: body?._type ?? null });
}
