'use client';

import { useState } from 'react';
import { WatchlistItem } from '@/lib/types';
import { Search, Star, StarOff, Plus, X, TrendingUp, TrendingDown, Calendar, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    stockCode: '352480',
    corpName: '에이피알',
    market: 'KOSDAQ',
    nextEarningsDate: '2026-07-15',
    currentPrice: 312000,
    priceChange: 8500,
    priceChangePercent: 2.8,
    addedAt: '2026-04-01',
  },
  {
    stockCode: '005930',
    corpName: '삼성전자',
    market: 'KOSPI',
    nextEarningsDate: '2026-05-29',
    currentPrice: 68400,
    priceChange: -600,
    priceChangePercent: -0.87,
    addedAt: '2026-03-15',
  },
  {
    stockCode: '000660',
    corpName: 'SK하이닉스',
    market: 'KOSPI',
    nextEarningsDate: '2026-07-25',
    currentPrice: 201000,
    priceChange: 5000,
    priceChangePercent: 2.55,
    addedAt: '2026-04-10',
  },
];

const SEARCH_RESULTS: WatchlistItem[] = [
  { stockCode: '035420', corpName: 'NAVER', market: 'KOSPI', currentPrice: 198000, priceChange: 2500, priceChangePercent: 1.28, addedAt: '' },
  { stockCode: '035720', corpName: '카카오', market: 'KOSPI', currentPrice: 38250, priceChange: -750, priceChangePercent: -1.92, addedAt: '' },
  { stockCode: '373220', corpName: 'LG에너지솔루션', market: 'KOSPI', currentPrice: 356000, priceChange: 4000, priceChangePercent: 1.14, addedAt: '' },
  { stockCode: 'NVDA', corpName: 'NVIDIA', market: 'NASDAQ', currentPrice: 912, priceChange: 24, priceChangePercent: 2.7, addedAt: '' },
  { stockCode: 'AAPL', corpName: 'Apple', market: 'NASDAQ', currentPrice: 195, priceChange: -2, priceChangePercent: -1.02, addedAt: '' },
  { stockCode: 'MSFT', corpName: 'Microsoft', market: 'NASDAQ', currentPrice: 425, priceChange: 5, priceChangePercent: 1.19, addedAt: '' },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredSearch = SEARCH_RESULTS.filter(
    (s) =>
      !watchlist.some((w) => w.stockCode === s.stockCode) &&
      (s.corpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.stockCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => [...prev, { ...item, addedAt: new Date().toISOString() }]);
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeFromWatchlist = (stockCode: string) => {
    setWatchlist((prev) => prev.filter((w) => w.stockCode !== stockCode));
  };

  const getDaysUntilEarnings = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">관심종목</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{watchlist.length}개 종목 등록됨</p>
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              종목 추가
            </button>
          </div>

          {showSearch && (
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="종목명 또는 코드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>

              {searchQuery && filteredSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden">
                  {filteredSearch.slice(0, 5).map((item) => (
                    <button
                      key={item.stockCode}
                      onClick={() => addToWatchlist(item)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.corpName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.stockCode} · {item.market}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.market === 'NASDAQ' || item.market === 'NYSE'
                            ? `$${item.currentPrice?.toLocaleString()}`
                            : `${item.currentPrice?.toLocaleString()}원`}
                        </p>
                        <p className={`text-xs font-medium ${(item.priceChangePercent || 0) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                          {(item.priceChangePercent || 0) >= 0 ? '+' : ''}{item.priceChangePercent?.toFixed(2)}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <Star className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">관심종목이 없습니다</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">종목을 추가하면 공시 알림을 받을 수 있어요</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {watchlist.map((item) => {
              const isPositive = (item.priceChangePercent || 0) >= 0;
              const daysUntil = getDaysUntilEarnings(item.nextEarningsDate);
              const isUS = item.market === 'NASDAQ' || item.market === 'NYSE';

              return (
                <div
                  key={item.stockCode}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.corpName}</h3>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 ${
                            item.market === 'KOSPI'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : item.market === 'KOSDAQ'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {item.market}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.stockCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-base">
                        {isUS ? `$${item.currentPrice?.toLocaleString()}` : `${item.currentPrice?.toLocaleString()}원`}
                      </p>
                      <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                        {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {isPositive ? '+' : ''}{item.priceChangePercent?.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Earnings & Alerts */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {item.nextEarningsDate && daysUntil !== null && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        daysUntil <= 7
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Calendar className="h-3 w-3" />
                        실적발표 D-{daysUntil}
                      </div>
                    )}
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Bell className="h-3 w-3" />
                      알림 설정
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(item.stockCode)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors ml-auto"
                    >
                      <StarOff className="h-3 w-3" />
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 px-3 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
            본 서비스는 참고용 정보 제공을 목적으로 하며, 투자 권유 또는 투자 조언이 아닙니다.
            투자에 대한 최종 판단과 책임은 투자자 본인에게 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
