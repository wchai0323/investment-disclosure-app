import { DartApiResponse, DartDisclosure } from './types';

const DART_BASE_URL = 'https://opendart.fss.or.kr/api';

export async function fetchDisclosures(params?: {
  corpCode?: string;
  bgn_de?: string;
  end_de?: string;
  pblntf_ty?: string;
  page_no?: number;
  page_count?: number;
}): Promise<DartDisclosure[]> {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey || apiKey === 'your_dart_api_key_here') {
    return getMockDisclosures();
  }

  const today = new Date();
  const bgn_de = params?.bgn_de || formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
  const end_de = params?.end_de || formatDate(today);

  const searchParams = new URLSearchParams({
    crtfc_key: apiKey,
    bgn_de,
    end_de,
    page_no: String(params?.page_no || 1),
    page_count: String(params?.page_count || 20),
  });

  if (params?.corpCode) searchParams.set('corp_code', params.corpCode);
  if (params?.pblntf_ty) searchParams.set('pblntf_ty', params.pblntf_ty);

  try {
    const res = await fetch(`${DART_BASE_URL}/list.json?${searchParams}`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error(`DART API error: ${res.status}`);
    const data: DartApiResponse = await res.json();
    if (data.status !== '000') return getMockDisclosures();
    return data.list || [];
  } catch {
    return getMockDisclosures();
  }
}

export async function fetchDisclosureDocument(rcpNo: string): Promise<string> {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey || apiKey === 'your_dart_api_key_here') {
    return getMockDisclosureText(rcpNo);
  }

  try {
    const res = await fetch(
      `${DART_BASE_URL}/document.xml?crtfc_key=${apiKey}&rcept_no=${rcpNo}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`DART document API error: ${res.status}`);
    const text = await res.text();
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000);
  } catch {
    return getMockDisclosureText(rcpNo);
  }
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function getMockDisclosures(): DartDisclosure[] {
  return [
    {
      rcpNo: '20260521001234',
      corpName: '에이피알',
      stockCode: '352480',
      corpCls: 'K',
      reportNm: '잠정실적(공정공시)',
      rceptDt: '20260521',
      flrNm: '에이피알',
      rmk: '유',
    },
    {
      rcpNo: '20260521002345',
      corpName: '삼성전자',
      stockCode: '005930',
      corpCls: 'Y',
      reportNm: '주요사항보고서(유상증자결정)',
      rceptDt: '20260521',
      flrNm: '삼성전자',
      rmk: '유',
    },
    {
      rcpNo: '20260521003456',
      corpName: 'SK하이닉스',
      stockCode: '000660',
      corpCls: 'Y',
      reportNm: '잠정실적(공정공시)',
      rceptDt: '20260521',
      flrNm: 'SK하이닉스',
      rmk: '유',
    },
    {
      rcpNo: '20260521004567',
      corpName: '카카오',
      stockCode: '035720',
      corpCls: 'Y',
      reportNm: '단일판매·공급계약체결',
      rceptDt: '20260521',
      flrNm: '카카오',
      rmk: '유',
    },
    {
      rcpNo: '20260521005678',
      corpName: 'LG에너지솔루션',
      stockCode: '373220',
      corpCls: 'Y',
      reportNm: '잠정실적(공정공시)',
      rceptDt: '20260521',
      flrNm: 'LG에너지솔루션',
      rmk: '유',
    },
    {
      rcpNo: '20260521006789',
      corpName: '현대차',
      stockCode: '005380',
      corpCls: 'Y',
      reportNm: '주요사항보고서(자기주식취득결정)',
      rceptDt: '20260521',
      flrNm: '현대차',
      rmk: '유',
    },
    {
      rcpNo: '20260521007890',
      corpName: 'NAVER',
      stockCode: '035420',
      corpCls: 'Y',
      reportNm: '단일판매·공급계약체결',
      rceptDt: '20260521',
      flrNm: 'NAVER',
      rmk: '유',
    },
    {
      rcpNo: '20260521008901',
      corpName: '셀트리온',
      stockCode: '068270',
      corpCls: 'Y',
      reportNm: '임상시험결과보고(자진공시)',
      rceptDt: '20260521',
      flrNm: '셀트리온',
      rmk: '유',
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
