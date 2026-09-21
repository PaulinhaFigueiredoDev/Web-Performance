import { NextResponse } from 'next/server';
import { aggregateQualityReports } from '@/scripts/aggregate-quality-reports';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const quality = await aggregateQualityReports();
    return NextResponse.json(quality, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Não foi possível ler os relatórios de qualidade.',
        detail: error.message
      },
      { status: 500 }
    );
  }
}
