import { NextRequest, NextResponse } from 'next/server';
import { fetchDisclosures } from '@/lib/dart';
import { Disclosure } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const corpCode = searchParams.get('corpCode') || undefined;
  const pageNo = parseInt(searchParams.get('page') || '1');

  try {
    const rawList = await fetchDisclosures({ corpCode, page_no: pageNo, page_count: 20 });

    const disclosures: Disclosure[] = rawList.map((item) => ({
      rcpNo: item.rcpNo,
      corpName: item.corpName,
      stockCode: item.stockCode,
      corpCls: item.corpCls,
      reportNm: item.reportNm,
      rceptDt: item.rceptDt,
      rceptTm: generateTime(item.rceptDt),
      flrNm: item.flrNm,
      rmk: item.rmk,
    }));

    return NextResponse.json({ disclosures, total: disclosures.length });
  } catch (error) {
    console.error('Disclosure API error:', error);
    return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 });
  }
}

function generateTime(date: string): string {
  const hours = ['09', '10', '11', '14', '15', '16', '17'];
  const mins = ['00', '05', '10', '15', '20', '25', '30', '31', '45', '52'];
  return `${hours[parseInt(date.slice(-2)) % hours.length]}:${mins[parseInt(date.slice(-4, -2)) % mins.length]}`;
}
