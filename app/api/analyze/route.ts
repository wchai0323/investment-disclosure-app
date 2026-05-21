import { NextRequest, NextResponse } from 'next/server';
import { analyzeDisclosure } from '@/lib/claude';
import { fetchDisclosureDocument } from '@/lib/dart';

export async function POST(request: NextRequest) {
  try {
    const { rcpNo, companyName, reportType, sector } = await request.json();

    if (!rcpNo || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const disclosureText = await fetchDisclosureDocument(rcpNo);
    const analysis = await analyzeDisclosure({ disclosureText, companyName, reportType, sector });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
