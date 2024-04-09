// middleware.ts ベーシック認証の実装
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証に使用するユーザー名とパスワード
const AUTH_USER = process.env.AUTH_USER || '';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';

// ベーシック認証のヘルパー関数
const basicAuth = (req: NextRequest) => {
  const auth = req.headers.get('authorization');
  if (auth) {
    const scheme = auth.split(' ')[0];
    const credentials = auth.split(' ')[1];
    if (scheme === 'Basic') {
      const decoded = Buffer.from(credentials, 'base64').toString('utf8');
      const [user, password] = decoded.split(':');
      if (user === AUTH_USER && password === AUTH_PASSWORD) {
        return true;
      }
    }
  }
  return false;
};

export function middleware(req: NextRequest) {
  // ベーシック認証が通過していない場合は、401 Unauthorizedを返す
  if (!basicAuth(req)) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // ベーシック認証が通過している場合は、通常通りリクエストを処理する
  return NextResponse.next();
}

// 適用するパスを指定する
export const config = {
  matcher: '/:path*',
};