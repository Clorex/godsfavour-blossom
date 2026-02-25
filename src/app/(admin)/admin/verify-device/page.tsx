export const dynamic = "force-dynamic";

import VerifyDeviceClient from "./verify-device-client";
import { requireAdminSession } from "@/lib/auth/server";

export default async function VerifyDevicePage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  await requireAdminSession();

  const next = searchParams?.next || "/admin";
  return <VerifyDeviceClient next={next} />;
}
