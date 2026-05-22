import Anthropic from '@anthropic-ai/sdk';
import { DisclosureAnalysis } from './types';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function analyzeDisclosure(params: {
  disclosureText: string;
  companyName: string;
  reportType: string;
  sector?: string;
}): Promise<DisclosureAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return getMockAnalysis(params.companyName, params.reportType);
  }

  const prompt = `당신은 10년 경력의 프랍 트레이더입니다. 아래 공시를 분석해주세요.

[공시 원문]
${params.disclosureText}

[회사 정보]
종목명: ${params.companyName}
공시 유형: ${params.reportType}
업종: ${params.sector || '정보 없음'}

다음 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:
{
  "summary": "3줄 이내 핵심 요약",
  "sentiment": "positive 또는 negative 또는 neutral",
  "sentimentReason": "호재/악재/중립 판단 이유 (1-2문장)",
  "keyNumbers": [
    {"label": "지표명", "value": "값", "change": "변화율", "isPositive": true}
  ],
  "relatedStocks": [
    {"name": "종목명", "stockCode": "코드", "impact": "positive/negative/neutral", "reason": "이유"}
  ],
  "positiveFactors": ["긍정 요인1", "긍정 요인2"],
  "riskFactors": ["리스크 요인1", "리스크 요인2"],
  "upcomingEvents": ["향후 체크 이벤트1", "향후 체크 이벤트2"]
}

주의: 매수/매도/투자 추천 문구는 절대 사용 금지. 참고용 정보 제공만 목적.`;

  try {
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      sentiment: parsed.sentiment || 'neutral',
      sentimentReason: parsed.sentimentReason || '',
      keyNumbers: parsed.keyNumbers || [],
      relatedStocks: parsed.relatedStocks || [],
      positiveFactors: parsed.positiveFactors || [],
      riskFactors: parsed.riskFactors || [],
      upcomingEvents: parsed.upcomingEvents || [],
    };
  } catch {
    return getMockAnalysis(params.companyName, params.reportType);
  }
}

function getMockAnalysis(companyName: string, reportType: string): DisclosureAnalysis {
  const isEarnings = reportType.includes('잠정실적') || reportType.includes('실적');
  const isBiotech = companyName.includes('셀트리온') || companyName.includes('바이오');

  if (isEarnings && companyName === '에이피알') {
    return {
      summary: '비수기임에도 QoQ +8.3% 성장하며 어닝 서프라이즈 달성. 미국 매출 +340% 급증이 핵심 동인. 영업이익률 25.7%로 수익성도 대폭 개선.',
      sentiment: 'positive',
      sentimentReason: '컨센서스를 매출 +14.1%, 영업이익 +19.3% 상회하는 어닝 서프라이즈',
      keyNumbers: [
        { label: '매출액', value: '5,934억', change: '+123% YoY', isPositive: true },
        { label: '영업이익', value: '1,527억', change: '+156% YoY', isPositive: true },
        { label: '영업이익률', value: '25.7%', change: '+3.2%p', isPositive: true },
        { label: '컨센서스 대비', value: '+14.1%', change: '어닝 서프라이즈', isPositive: true },
      ],
      relatedStocks: [
        { name: '클래시스', stockCode: '214150', impact: 'positive', reason: '뷰티디바이스 섹터 동반 수혜 기대' },
        { name: '원텍', stockCode: '336570', impact: 'positive', reason: '미용의료기기 섹터 밸류에이션 재평가' },
      ],
      positiveFactors: [
        '미국 시장 매출 YoY +340% 급증으로 글로벌 확장 본격화',
        '비수기(1Q)에도 QoQ 성장 달성, 계절성 극복',
        '컨센서스 대폭 상회하는 어닝 서프라이즈',
        '영업레버리지 효과로 수익성 개선 뚜렷',
      ],
      riskFactors: [
        '고성장에 따른 기저효과 부담 (향후 성장률 둔화 가능성)',
        '미국 관세 정책 변화 시 수출 마진 영향 가능성',
        '경쟁사 신규 진입 및 가격 경쟁 심화 리스크',
      ],
      upcomingEvents: [
        '2026년 2분기 실적 발표 (7월 예정)',
        '미국 신규 제품 라인업 출시 일정 확인',
        '유럽 시장 진출 현황 업데이트',
      ],
    };
  }

  if (isEarnings && companyName === 'SK하이닉스') {
    return {
      summary: 'HBM3E 출하량 급증으로 분기 최대 매출 달성. 영업이익률 38.9%로 반도체 업체 중 최상위권. AI 인프라 투자 확대 수혜 지속.',
      sentiment: 'positive',
      sentimentReason: '컨센서스 영업이익 대비 +9.7% 상회하는 서프라이즈, HBM 수요 강세 지속 확인',
      keyNumbers: [
        { label: '매출액', value: '17.5조원', change: '+12.3% QoQ', isPositive: true },
        { label: '영업이익', value: '6.8조원', change: '+15.2% QoQ', isPositive: true },
        { label: '영업이익률', value: '38.9%', change: '+1.0%p', isPositive: true },
        { label: 'HBM 매출 비중', value: '40%+', change: '역대 최고', isPositive: true },
      ],
      relatedStocks: [
        { name: '삼성전자', stockCode: '005930', impact: 'neutral', reason: 'HBM 시장 경쟁 심화 가능성' },
        { name: '한미반도체', stockCode: '042700', impact: 'positive', reason: 'HBM 패키징 장비 수요 증가' },
      ],
      positiveFactors: [
        'HBM3E 공급 부족 상황에서 프리미엄 가격 유지',
        'AI 데이터센터 투자 확대로 수요 가시성 높음',
        '수율 개선으로 원가 구조 개선 지속',
      ],
      riskFactors: [
        'DRAM 일반 제품 가격 약세 지속',
        'HBM4 전환 시 초기 수율 리스크',
        '중국 업체 추격에 따른 장기 시장 점유율 압박',
      ],
      upcomingEvents: [
        '2분기 HBM4 양산 일정 확인 (6월)',
        '마이크로소프트·엔비디아 공급 계약 업데이트',
        'DRAM 고정가격 월간 동향 체크',
      ],
    };
  }

  if (isBiotech) {
    return {
      summary: '임상시험 주요 결과 발표. 1차 평가지표 달성 여부가 향후 기업 가치의 핵심 변수. 규제 기관 제출 일정 및 파트너십 가능성 주목.',
      sentiment: 'positive',
      sentimentReason: '임상 성공 시 파이프라인 가치 재평가 기대, 규제 기관 심사 진입 단계',
      keyNumbers: [
        { label: '임상 단계', value: 'Phase 3', change: '결과 발표', isPositive: true },
        { label: '1차 평가지표', value: '달성', change: 'p<0.001', isPositive: true },
      ],
      relatedStocks: [
        { name: '삼성바이오로직스', stockCode: '207940', impact: 'neutral', reason: 'CDO 파트너십 가능성 모니터링' },
      ],
      positiveFactors: ['임상 1차 평가지표 달성으로 허가 신청 근거 확보', '글로벌 빅파마 파트너십 협상 레버리지 강화'],
      riskFactors: ['규제 기관 심사 과정에서 추가 자료 요구 가능성', '상업화까지 추가 시간·비용 소요'],
      upcomingEvents: ['FDA/EMA 허가 신청 일정 확인', '2분기 파트너십 계약 업데이트'],
    };
  }

  return {
    summary: `${companyName}의 ${reportType} 공시가 접수되었습니다. 공시 내용을 검토하고 관련 사항을 확인하시기 바랍니다.`,
    sentiment: 'neutral',
    sentimentReason: '추가 세부 내용 검토 필요',
    keyNumbers: [],
    relatedStocks: [],
    positiveFactors: ['공시 내용 확인 후 판단 필요'],
    riskFactors: ['공시 내용 확인 후 판단 필요'],
    upcomingEvents: ['공시 세부 내용 검토'],
  };
}
