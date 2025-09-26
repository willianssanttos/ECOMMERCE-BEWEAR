import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

import { monitorPendingPayments } from "@/actions/monitor-pending-payments";

function isAuthorized(req: Request) {
  const url = new URL(req.url);
  const token =
    url.searchParams.get("token") ?? req.headers.get("x-cron-token");
  const secret = process.env.CRON_SECRET;
  return secret ? token === secret : true;
}

async function run() {
  const result = await monitorPendingPayments();
  return Response.json(result);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  return run();
}

export const POST = verifySignatureAppRouter(async () => {
  return run();
});
