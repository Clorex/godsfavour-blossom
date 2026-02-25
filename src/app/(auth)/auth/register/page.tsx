export const dynamic = "force-dynamic";

import RegisterClient from "./register-client";

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/account";
  return <RegisterClient next={next} />;
}
