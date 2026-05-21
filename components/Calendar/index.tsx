'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  events: CalendarEvent[];
  viewMode: 'month' | 'week';
}

const CATEGORY_STYLES: Record<CalendarEvent['category'], { bg: string; text: string; label: string; dot: string }> = {
  watchlist: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-800 dark:text-red-300',
    label: '관심종목',
    dot: 'bg-red-500',
  },
  earnings: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-800 dark:text-blue-300',
    label: '실적발표',
    dot: 'bg-blue-500',
  },
  dividend: {
    bg: 'bg-green-100 dark:bg-green-900/40',
    text: 'text-green-800 dark:text-green-300',
    label: '배당',
    dot: 'bg-green-500',
  },
  macro: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
    text: 'text-yellow-800 dark:text-yellow-300',
    label: '매크로',
    dot: 'bg-yellow-500',
  },
  ipo: {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    text: 'text-purple-800 dark:text-purple-300',
    label: '공모주',
    dot: 'bg-purple-500',
  },
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function CalendarComponent({ events, viewMode }: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {currentYear}년 {MONTHS[currentMonth]}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-1 ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {Array.from({ length: totalCells }).map((_, idx) => {
          const day = idx - firstDay + 1;
          const isCurrentMonth = day >= 1 && day <= daysInMonth;
          const dayEvents = isCurrentMonth ? getEventsForDate(day) : [];
          const dayOfWeek = idx % 7;

          return (
            <div
              key={idx}
              className={`min-h-[72px] p-1 ${
                isCurrentMonth
                  ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                  : 'bg-gray-50 dark:bg-gray-850'
              } transition-colors`}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex justify-center mb-1">
                    <span
                      className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${
                        isToday(day)
                          ? 'bg-red-500 text-white font-bold'
                          : dayOfWeek === 0
                          ? 'text-red-500'
                          : dayOfWeek === 6
                          ? 'text-blue-500'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((event) => {
                      const style = CATEGORY_STYLES[event.category];
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left px-1 py-0.5 rounded text-[9px] leading-tight truncate font-medium ${style.bg} ${style.text} hover:opacity-80 transition-opacity`}
                        >
                          {event.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <button
                        onClick={() => setSelectedEvent(dayEvents[2])}
                        className="w-full text-left px-1 text-[9px] text-gray-400 dark:text-gray-500"
                      >
                        +{dayEvents.length - 2}개
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 px-1">
        {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden">
          {selectedEvent && (
            <div>
              <div
                className={`p-4 ${CATEGORY_STYLES[selectedEvent.category].bg}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={`text-xs mb-2 ${CATEGORY_STYLES[selectedEvent.category].bg} ${CATEGORY_STYLES[selectedEvent.category].text} border-0`}>
                      {CATEGORY_STYLES[selectedEvent.category].label}
                    </Badge>
                    <h3 className={`font-bold text-base ${CATEGORY_STYLES[selectedEvent.category].text}`}>
                      {selectedEvent.title}
                    </h3>
                    <p className={`text-sm mt-0.5 ${CATEGORY_STYLES[selectedEvent.category].text} opacity-80`}>
                      {formatEventDate(selectedEvent.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 rounded-full hover:bg-black/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {selectedEvent.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
                {selectedEvent.isWatchlist && (
                  <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors">
                    <Bell className="h-4 w-4" />
                    사전 알림 설정
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}
