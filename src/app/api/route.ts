import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Last Stand: Mars Exodus',
    status: 'ok',
    mode: 'local-dev',
  });
}
