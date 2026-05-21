'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/types';
import CalendarComponent from '@/components/Calendar';
import { Clock, ChevronRight } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  watchlist: '관심종목',
  earnings: '실적발표',
  dividend: '배당',
  macro: '매크로',
  ipo: '공모주',
};

const CATEGORY_COLORS: Record<string, string> = {
  watchlist: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  earnings: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  dividend: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  macro: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  ipo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    fetch('/api/calendar-events')
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();

  const upcomingEvents = events
    .filter((e) => {
      const eventDate = new Date(e.date);
      const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 14;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">투자 캘린더</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">실적·매크로·배당·공모주 일정 통합</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {loading ? (
          <div className="mt-4 h-80 bg-white dark:bg-gray-900 rounded-xl animate-pulse border border-gray-200 dark:border-gray-800" />
        ) : (
          <>
            <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <CalendarComponent events={events} viewMode={viewMode} />
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">다가오는 주요 일정</h2>
                </div>
                <div className="space-y-2">
                  {upcomingEvents.map((event) => {
                    const daysUntil = getDaysUntil(event.date);
                    const isUrgent = daysUntil <= 3;
                    return (
                      <div
                        key={event.id}
                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex items-start gap-3"
                      >
                        <div
                          className={`shrink-0 text-center px-2 py-1 rounded-lg min-w-[48px] ${
                            isUrgent
                              ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <p className={`text-xs font-bold ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {daysUntil === 0 ? 'D-DAY' : `D-${daysUntil}`}
                          </p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                            {new Date(event.date).getMonth() + 1}/{new Date(event.date).getDate()}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                CATEGORY_COLORS[event.category]
                              }`}
                            >
                              {CATEGORY_LABELS[event.category]}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

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
