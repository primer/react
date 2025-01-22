import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      {
        code: 400,
        message: 'Expected color-preference payload to be JSON',
      },
      {
        status: 400,
      },
    )
  }

  const payload = await req.json()
  if (!payload.colorMode) {
    return NextResponse.json(
      {
        code: 400,
        message: 'Expected color-preference payload to contain colorMode property',
      },
      {
        status: 400,
      },
    )
  }

  if (payload.colorMode !== 'light' && payload.colorMode !== 'dark') {
    return NextResponse.json(
      {
        code: 400,
        message: 'Expected color-preference payload to contain colorMode property that is either light or dark',
      },
      {
        status: 400,
      },
    )
  }

  const response = NextResponse.json({
    colorMode: payload.colorMode,
  })
  response.cookies.set('color-preference', payload.colorMode)
  return response
}
