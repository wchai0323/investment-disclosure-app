import { DartApiResponse, DartDisclosure } from './types';

const DART_BASE_URL = 'https://opendart.fss.or.kr/api';

export type DisclosureSource = 'real' | 'mock';

export async function fetchDisclosures(params?: {
  corpCode?: string;
  bgn_de?: string;
  end_de?: string;
  pblntf_ty?: string;
  page_no?: number;
  page_count?: number;
}): Promise<{ list: DartDisclosure[]; source: DisclosureSource }> {
  const apiKey = process.env.DART_API_KEY;

  // ── Guard: no key or placeholder ─────────────────────────────────────────
  if (!apiKey || apiKey.startsWith('your_')) {
    console.log('[DART] DART_API_KEY not set — returning mock data');
    return { list: getMockDisclosures(), source: 'mock' };
  }
  console.log(`[DART] DART_API_KEY found (${apiKey.length} chars, starts: ${apiKey.slice(0, 4)})`);

  const today = new Date();
  const end_de = params?.end_de || formatDate(today);
  const bgn_de = params?.bgn_de || formatDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000));

  const searchParams = new URLSearchParams({
    crtfc_key: apiKey,
    bgn_de,
    end_de,
    page_no: String(params?.page_no || 1),
    page_count: String(params?.page_count || 20),
  });

  if (params?.corpCode) searchParams.set('corp_code', params.corpCode);
  if (params?.pblntf_ty) searchParams.set('pblntf_ty', params.pblntf_ty);

  const url = `${DART_BASE_URL}/list.json?${searchParams}`;
  console.log(`[DART] GET ${url.replace(apiKey, '****')} (bgn_de=${bgn_de} end_de=${end_de})`);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    console.log(`[DART] HTTP ${res.status} ${res.statusText}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: DartApiResponse = await res.json();
    console.log(`[DART] status=${data.status} message="${data.message}" total_count=${data.total_count}`);

    if (data.status === '013') {
      // "조회된 데이터가 없습니다" — valid response, just no filings in range
      console.log('[DART] No filings in date range — returning mock data');
      return { list: getMockDisclosures(), source: 'mock' };
    }

    if (data.status !== '000') {
      console.error(`[DART] API error status=${data.status} message="${data.message}"`);
      return { list: getMockDisclosures(), source: 'mock' };
    }

    const list = data.list || [];
    console.log(`[DART] Got ${list.length} real disclosures`);
    return { list, source: 'real' };
  } catch (err) {
    console.error('[DART] fetchDisclosures error:', err);
    return { list: getMockDisclosures(), source: 'mock' };
  }
}

export async function fetchDisclosureDocument(rcpNo: string): Promise<string> {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    return getMockDisclosureText(rcpNo);
  }

  try {
    const res = await fetch(
      `${DART_BASE_URL}/document.xml?crtfc_key=${apiKey}&rcept_no=${rcpNo}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`DART document API ${res.status}`);
    const text = await res.text();
    // Strip XML/HTML tags, collapse whitespace, truncate for Claude context
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000);
  } catch (err) {
    console.error('DART fetchDisclosureDocument error:', err);
    return getMockDisclosureText(rcpNo);
  }
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function getMockDisclosures(): DartDisclosure[] {
  return [
    {
      rcept_no: '20260521001234',
      corp_name: '에이피알',
      corp_code: '00421045',
      stock_code: '352480',
      corp_cls: 'K',
      report_nm: '잠정실적(공정공시)',
      rcept_dt: '20260521',
      flr_nm: '에이피알',
      rm: '코',
    },
    {
      rcept_no: '20260521002345',
      corp_name: '삼성전자',
      corp_code: '00126380',
      stock_code: '005930',
      corp_cls: 'Y',
      report_nm: '주요사항보고서(유상증자결정)',
      rcept_dt: '20260521',
      flr_nm: '삼성전자',
      rm: '유',
    },
    {
      rcept_no: '20260521003456',
      corp_name: 'SK하이닉스',
      corp_code: '00164779',
      stock_code: '000660',
      corp_cls: 'Y',
      report_nm: '잠정실적(공정공시)',
      rcept_dt: '20260521',
      flr_nm: 'SK하이닉스',
      rm: '유',
    },
    {
      rcept_no: '20260521004567',
      corp_name: '카카오',
      corp_code: '00166894',
      stock_code: '035720',
      corp_cls: 'Y',
      report_nm: '단일판매·공급계약체결',
      rcept_dt: '20260521',
      flr_nm: '카카오',
      rm: '유',
    },
    {
      rcept_no: '20260521005678',
      corp_name: 'LG에너지솔루션',
      corp_code: '01148993',
      stock_code: '373220',
      corp_cls: 'Y',
      report_nm: '잠정실적(공정공시)',
      rcept_dt: '20260521',
      flr_nm: 'LG에너지솔루션',
      rm: '유',
    },
    {
      rcept_no: '20260521006789',
      corp_name: '현대차',
      corp_code: '00164742',
      stock_code: '005380',
      corp_cls: 'Y',
      report_nm: '주요사항보고서(자기주식취득결정)',
      rcept_dt: '20260521',
      flr_nm: '현대차',
      rm: '유',
    },
    {
      rcept_no: '20260521007890',
      corp_name: 'NAVER',
      corp_code: '00266961',
      stock_code: '035420',
      corp_cls: 'Y',
      report_nm: '단일판매·공급계약체결',
      rcept_dt: '20260521',
      flr_nm: 'NAVER',
      rm: '유',
    },
    {
      rcept_no: '20260521008901',
      corp_name: '셀트리온',
      corp_code: '00112218',
      stock_code: '068270',
      corp_cls: 'Y',
      report_nm: '임상시험결과보고(자진공시)',
      rcept_dt: '20260521',
      flr_nm: '셀트리온',
      rm: '유',
    },
  ];
}

function getMockDisclosureText(rcpNo: string): string {
  const texts: Record<string, string> = {
    '20260521001234': `에이피알 2026년 1분기 잠정실적 공시. 연결기준 매출액 5,934억원 (전년동기대비 +123%, 전분기대비 +8.3%), 영업이익 1,527억원 (전년동기대비 +156%), 영업이익률 25.7%. 뷰티디바이스 부문 해외 매출 확대가 주요 성장 동인. 미국 시장 매출 전년대비 +340% 성장. 컨센서스 매출액 5,200억원 대비 +14.1% 상회. 컨센서스 영업이익 1,280억원 대비 +19.3% 상회.`,
    '20260521002345': `삼성전자 유상증자 결정 공시. 발행예정 주식수 200,000,000주, 발행가액 미정, 증자 목적: 반도체 생산설비 투자 및 운영자금. 예상 조달금액 약 15조원. 주주 배정 후 실권주 일반공모 방식. 신주배정기준일 2026년 7월 1일 예정.`,
    '20260521003456': `SK하이닉스 2026년 1분기 잠정실적. 매출액 17조 5천억원 (QoQ +12.3%), 영업이익 6조 8천억원 (OPM 38.9%). HBM3E 출하량 급증이 실적 견인. 컨센서스 영업이익 6.2조 대비 +9.7% 서프라이즈.`,
  };
  return texts[rcpNo] || `${rcpNo} 공시 원문 (데모 데이터)`;
}
