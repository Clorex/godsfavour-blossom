export const dynamic = "force-dynamic";

import LoginClient from "./login-client";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/account";
  return <LoginClient next={next} />;
}
