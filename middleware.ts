import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const retryCount = Number.parseInt(searchParams.get('retryCount') || '0', 10);

  if (pathname.startsWith('/test/') && retryCount > 0) {
    if (retryCount >= 3) {
      // Break the loop after 3 retries
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Increment retryCount
    searchParams.set('retryCount', (retryCount + 1).toString());
    return NextResponse.rewrite(
      new URL(`${pathname}?${searchParams}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/test/:path*',
};
