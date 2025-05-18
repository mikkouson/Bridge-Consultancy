import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const hasAccessToken = request.nextUrl.searchParams.has("access_token");

  // **Allow invite links to proceed**
  if (hasAccessToken && request.nextUrl.pathname.startsWith("/login")) {
    return supabaseResponse;
  }

  // **Allow public access to login, auth, and forgot-password pages**
  const publicPaths = ["/login", "/auth", "/forgot-password"];

  if (!user && !publicPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && url.pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (url.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
