import { monitorPendingPayments } from "@/actions/monitor-pending-payments";

function isAuthorized(req: Request) {
  const url = new URL(req.url);
  const token =
    url.searchParams.get("token") ?? req.headers.get("x-cron-token");
  const secret = process.env.CRON_SECRET;
  return secret ? token === secret : true;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  const result = await monitorPendingPayments();
  return Response.json(result);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  const result = await monitorPendingPayments();
  return Response.json(result);
}
