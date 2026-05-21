'use client';

import { useState, useEffect } from 'react';
import { Disclosure } from '@/lib/types';
import DisclosureCard from '@/components/DisclosureCard';
import OnboardingFlow from '@/components/OnboardingFlow';
import { RefreshCw, TrendingUp, Bell } from 'lucide-react';

const MOCK_WATCHLIST = ['352480', '005930', '000660'];

export default function HomePage() {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('onboarding_done');
    if (!done) {
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadDisclosures = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/disclosure');
      const data = await res.json();
      setDisclosures(data.disclosures || []);
    } catch {
      console.error('Failed to fetch disclosures');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDisclosures();
  }, []);

  const watchlistDisclosures = disclosures.filter((d) => MOCK_WATCHLIST.includes(d.stockCode));
  const otherDisclosures = disclosures.filter((d) => !MOCK_WATCHLIST.includes(d.stockCode));

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {showOnboarding && (
        <OnboardingFlow
          onComplete={(profile) => {
            localStorage.setItem('onboarding_done', 'true');
            localStorage.setItem('onboarding_profile', JSON.stringify(profile));
            setShowOnboarding(false);
          }}
          onSkip={() => {
            setShowOnboarding(false);
          }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">공시레이더</h1>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{dateStr} 공시 피드</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDisclosures(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-gray-900 rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Watchlist Section */}
            {watchlistDisclosures.length > 0 && (
              <section className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">관심종목 공시</h2>
                  </div>
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                    {watchlistDisclosures.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {watchlistDisclosures.map((d) => (
                    <DisclosureCard key={d.rcpNo} disclosure={d} isWatchlist />
                  ))}
                </div>
              </section>
            )}

            {watchlistDisclosures.length > 0 && (
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">전체 시장 공시</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>
            )}

            {/* All Disclosures */}
            <section className={watchlistDisclosures.length === 0 ? 'mt-4' : ''}>
              {watchlistDisclosures.length === 0 && (
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">오늘의 주요 공시</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{disclosures.length}건</span>
                </div>
              )}
              <div className="space-y-2.5">
                {otherDisclosures.map((d) => (
                  <DisclosureCard key={d.rcpNo} disclosure={d} />
                ))}
              </div>

              {disclosures.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">오늘은 주요 공시가 없습니다.</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">장마감 후 업데이트됩니다.</p>
                </div>
              )}
            </section>

            <div className="mt-6 px-3 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                본 서비스는 참고용 정보 제공을 목적으로 하며, 투자 권유 또는 투자 조언이 아닙니다.
                투자에 대한 최종 판단과 책임은 투자자 본인에게 있습니다.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
