export interface Disclosure {
  rcpNo: string;
  corpName: string;
  stockCode: string;
  corpCls: string;
  reportNm: string;
  rceptDt: string;
  rceptTm?: string;
  flrNm: string;
  rmk?: string;
  sector?: string;
  analysis?: DisclosureAnalysis;
}

export interface DisclosureAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentReason: string;
  keyNumbers: KeyNumber[];
  relatedStocks: RelatedStock[];
  positiveFactors: string[];
  riskFactors: string[];
  upcomingEvents: string[];
  isLoading?: boolean;
  error?: string;
}

export interface KeyNumber {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface RelatedStock {
  name: string;
  stockCode: string;
  impact: 'positive' | 'negative' | 'neutral';
  reason: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: 'watchlist' | 'earnings' | 'dividend' | 'macro' | 'ipo';
  description?: string;
  stockCode?: string;
  corpName?: string;
  isWatchlist?: boolean;
}

export interface WatchlistItem {
  stockCode: string;
  corpName: string;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ';
  nextEarningsDate?: string;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  addedAt: string;
}

export interface NotificationSettings {
  watchlistDisclosure: boolean;
  earningsD3: boolean;
  earningsD1: boolean;
  macroEvents: boolean;
  dailyBriefing: boolean;
  usMarketUpdate: boolean;
}

export interface OnboardingProfile {
  userType: string[];
  marketPreference: string[];
  categories: string[];
  completed: boolean;
}

export interface DartApiResponse {
  status: string;
  message: string;
  page_no: number;
  page_count: number;
  total_count: number;
  total_page: number;
  list: DartDisclosure[];
}

// Field names match the real DART OpenAPI response exactly (snake_case)
export interface DartDisclosure {
  rcept_no: string;
  corp_name: string;
  corp_code: string;
  stock_code: string;
  corp_cls: string;
  report_nm: string;
  flr_nm: string;
  rcept_dt: string;
  rm: string;
}
