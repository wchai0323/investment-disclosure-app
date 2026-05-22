import { NextResponse } from 'next/server';

// Diagnostic endpoint — visit /api/debug on Vercel to see exactly what's happening
export const dynamic = 'force-dynamic';

export async function GET() {
  const result: Record<string, unknown> = {};

  // ── Step 1: env var check ────────────────────────────────────────────────
  const apiKey = process.env.DART_API_KEY;
  result.env = {
    DART_API_KEY_set: !!apiKey,
    DART_API_KEY_preview: apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : null,
    DART_API_KEY_length: apiKey?.length ?? 0,
    is_placeholder: !apiKey || apiKey.startsWith('your_'),
    NODE_ENV: process.env.NODE_ENV,
  };

  if (!apiKey || apiKey.startsWith('your_')) {
    result.verdict = 'BLOCKED: DART_API_KEY is missing or still a placeholder — returning mock data';
    return NextResponse.json(result, { status: 200 });
  }

  // ── Step 2: raw DART API call ────────────────────────────────────────────
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
  const end_de = fmt(today);
  const bgn_de = fmt(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000));

  const url = `https://opendart.fss.or.kr/api/list.json?crtfc_key=${apiKey}&bgn_de=${bgn_de}&end_de=${end_de}&page_no=1&page_count=5`;

  result.dart_request = { bgn_de, end_de, url_without_key: url.replace(apiKey, '****') };

  try {
    const res = await fetch(url, { cache: 'no-store' });
    result.http = { status: res.status, ok: res.ok, content_type: res.headers.get('content-type') };

    const text = await res.text();
    result.raw_response_preview = text.slice(0, 500);

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
      result.parsed = parsed;
    } catch {
      result.parse_error = 'Response is not valid JSON';
      result.verdict = 'ERROR: DART returned non-JSON response (check raw_response_preview)';
      return NextResponse.json(result, { status: 200 });
    }

    const data = parsed as Record<string, unknown>;
    result.dart_status = data.status;
    result.dart_message = data.message;
    result.dart_total_count = data.total_count;

    // ── Step 3: status code diagnosis ───────────────────────────────────────
    const statusMessages: Record<string, string> = {
      '000': 'OK — real data available',
      '010': 'ERROR: 등록되지 않은 키 (unregistered API key)',
      '011': 'ERROR: 사용할 수 없는 키 (key temporarily suspended)',
      '012': 'ERROR: 접근할 수 없는 IP (IP blocked)',
      '013': 'INFO: 조회된 데이터가 없음 (no filings in date range — try wider range)',
      '020': 'ERROR: 요청 제한 초과 (rate limit: 10,000/day, 100/min)',
      '100': 'ERROR: 필드 오류 (bad request params)',
      '800': 'ERROR: 시스템 점검 중',
      '900': 'ERROR: 알 수 없는 오류',
    };
    result.verdict = statusMessages[data.status as string] ?? `Unknown status: ${data.status}`;

    if (data.status === '000') {
      const list = data.list as Array<Record<string, unknown>>;
      result.sample_items = list?.slice(0, 2);
      result.field_names_from_first_item = list?.[0] ? Object.keys(list[0]) : [];
    }
  } catch (err) {
    result.fetch_error = String(err);
    result.verdict = 'ERROR: Network error reaching DART API';
  }

  return NextResponse.json(result, { status: 200 });
}
