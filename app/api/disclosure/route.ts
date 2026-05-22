import { NextRequest, NextResponse } from 'next/server';
import { fetchDisclosures } from '@/lib/dart';
import { Disclosure } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const corpCode = searchParams.get('corpCode') || undefined;
  const pageNo = parseInt(searchParams.get('page') || '1');

  try {
    const { list: rawList, source } = await fetchDisclosures({ corpCode, page_no: pageNo, page_count: 20 });

    // Map DART snake_case fields → app Disclosure type
    const disclosures: Disclosure[] = rawList
      .filter((item) => item.stock_code) // only listed stocks
      .map((item) => ({
        rcpNo: item.rcept_no,
        corpName: item.corp_name,
        stockCode: item.stock_code,
        corpCls: item.corp_cls,
        reportNm: item.report_nm,
        rceptDt: item.rcept_dt,
        rceptTm: generateTime(item.rcept_dt),
        flrNm: item.flr_nm,
        rmk: item.rm,
      }));

    console.log(`[/api/disclosure] source=${source} count=${disclosures.length}`);
    return NextResponse.json({ disclosures, total: disclosures.length, _source: source });
  } catch (error) {
    console.error('[/api/disclosure] error:', error);
    return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 });
  }
}

// Deterministic pseudo-time from date string (used when DART doesn't provide exact time)
function generateTime(date: string): string {
  const hours = ['09', '10', '11', '14', '15', '16', '17'];
  const mins = ['00', '05', '10', '15', '20', '25', '30', '31', '45', '52'];
  return `${hours[parseInt(date.slice(-2)) % hours.length]}:${mins[parseInt(date.slice(-4, -2)) % mins.length]}`;
}
