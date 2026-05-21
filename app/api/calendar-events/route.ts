import { NextResponse } from 'next/server';
import { CalendarEvent } from '@/lib/types';

export async function GET() {
  const events: CalendarEvent[] = [
    // 매크로 이벤트
    {
      id: 'macro-cpi-may',
      title: '미국 CPI (4월)',
      date: '2026-05-13',
      category: 'macro',
      description: '전월비 +0.3% 예상. 연준 금리결정 선행지표로 시장 변동성 확대 가능',
    },
    {
      id: 'macro-fomc-may',
      title: 'FOMC 금리결정',
      date: '2026-05-29',
      category: 'macro',
      description: '기준금리 동결 예상 (4.25~4.50%). 점도표 및 파월 의장 발언 주목',
    },
    {
      id: 'macro-ppi-may',
      title: '미국 PPI (4월)',
      date: '2026-05-14',
      category: 'macro',
      description: '생산자물가지수. CPI와 함께 인플레이션 트렌드 확인',
    },
    {
      id: 'macro-pce-may',
      title: '미국 PCE (4월)',
      date: '2026-05-30',
      category: 'macro',
      description: '연준 선호 물가지표. Core PCE 연율 2.8% 예상',
    },
    {
      id: 'macro-jobs-may',
      title: '미국 고용보고서 (4월)',
      date: '2026-05-02',
      category: 'macro',
      description: '비농업 일자리 +185,000 예상. 실업률 4.1% 예상',
    },
    {
      id: 'macro-bok-may',
      title: '한국은행 금통위',
      date: '2026-05-29',
      category: 'macro',
      description: '기준금리 결정. 현 2.75% 유지 또는 25bp 인하 전망',
    },
    {
      id: 'macro-witching-jun',
      title: '네 마녀의 날 (쿼드러플 위칭)',
      date: '2026-06-19',
      category: 'macro',
      description: '주가지수선물·옵션, 개별주식선물·옵션 동시 만기일. 거래량 급증 및 변동성 확대',
    },
    {
      id: 'macro-fomc-jun',
      title: 'FOMC 의사록 공개',
      date: '2026-06-04',
      category: 'macro',
      description: '5월 FOMC 회의록 공개. 위원들의 세부 논의 내용 확인 가능',
    },
    // 실적발표
    {
      id: 'earnings-samsung-q1',
      title: '삼성전자 1Q 실적',
      date: '2026-05-29',
      category: 'earnings',
      description: '매출 73조, 영업이익 6.5조 예상. 반도체 부문 회복 여부 주목',
      stockCode: '005930',
      corpName: '삼성전자',
    },
    {
      id: 'earnings-nvidia',
      title: '엔비디아 1Q FY27 실적',
      date: '2026-05-28',
      category: 'earnings',
      description: '매출 $43.3B 예상. Blackwell GPU 출하량 및 데이터센터 수요 강도 주목',
      stockCode: 'NVDA',
      corpName: 'NVIDIA',
    },
    {
      id: 'earnings-kakao',
      title: '카카오 1Q 실적',
      date: '2026-05-15',
      category: 'earnings',
      description: '매출 2.1조, 영업이익 1,100억 예상. 카카오톡 광고 회복 여부 주목',
      stockCode: '035720',
      corpName: '카카오',
    },
    {
      id: 'earnings-apple',
      title: '애플 2Q FY26 실적',
      date: '2026-05-02',
      category: 'earnings',
      description: '매출 $92B 예상. 아이폰 16 판매 동향 및 서비스 매출 성장 확인',
      stockCode: 'AAPL',
      corpName: 'Apple',
    },
    // 배당
    {
      id: 'div-samsung-exdiv',
      title: '삼성전자 배당락일',
      date: '2026-06-27',
      category: 'dividend',
      description: '2분기 분기배당. 주당 361원 예정. 배당받으려면 6/26까지 보유 필요',
      stockCode: '005930',
      corpName: '삼성전자',
    },
    {
      id: 'div-hyundai-pay',
      title: '현대차 배당지급일',
      date: '2026-05-27',
      category: 'dividend',
      description: '1분기 현금배당 지급. 주당 2,000원',
      stockCode: '005380',
      corpName: '현대차',
    },
    // 공모주
    {
      id: 'ipo-sub-jun',
      title: '케이뱅크 공모주 청약',
      date: '2026-06-10',
      category: 'ipo',
      description: '청약일: 6/10~11. 환불일: 6/13. 상장 예정일: 6/17. 공모가 밴드 9,500~11,000원',
    },
    {
      id: 'ipo-list-jun',
      title: '케이뱅크 코스피 상장',
      date: '2026-06-17',
      category: 'ipo',
      description: '인터넷전문은행. 시가총액 약 5조원 수준. 카카오뱅크 대비 밸류에이션 비교 주목',
    },
  ];

  return NextResponse.json({ events });
}
