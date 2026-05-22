'use client';

import { useState } from 'react';
import { Bell, BellOff, ChevronRight, Moon, Sun, Smartphone } from 'lucide-react';
import { NotificationSettings } from '@/lib/types';

const NOTIFICATION_ITEMS: {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  time?: string;
}[] = [
  {
    key: 'watchlistDisclosure',
    title: '관심종목 공시 알림',
    description: '내 관심종목에 새 공시가 등록되면 즉시 알림',
  },
  {
    key: 'earningsD3',
    title: '실적발표 D-3 알림',
    description: '관심종목 실적 발표 3일 전 사전 알림',
  },
  {
    key: 'earningsD1',
    title: '실적발표 D-1 알림',
    description: '관심종목 실적 발표 전날 알림',
  },
  {
    key: 'macroEvents',
    title: '매크로 이벤트 전날 알림',
    description: 'CPI, FOMC, 금통위 등 주요 경제지표 발표 전날',
  },
  {
    key: 'dailyBriefing',
    title: '일일 공시 브리핑',
    description: '장마감 후 오늘의 주요 공시 요약',
    time: '오후 4:00',
  },
  {
    key: 'usMarketUpdate',
    title: '미국장 주요 이슈',
    description: '미국 시장 주요 공시 및 이벤트 요약',
    time: '오후 10:00',
  },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    watchlistDisclosure: true,
    earningsD3: true,
    earningsD1: true,
    macroEvents: true,
    dailyBriefing: false,
    usMarketUpdate: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const toggleNotification = (key: keyof NotificationSettings) => {
    if (!pushEnabled) {
      setPushEnabled(true);
    }
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const enabledCount = Object.values(notifications).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">알림 설정</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{enabledCount}개 알림 활성화</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-24">

        {/* Push Permission */}
        {!pushEnabled && (
          <div className="mt-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Smartphone className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">알림 권한이 필요합니다</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5 leading-relaxed">
                  공시 알림을 받으려면 브라우저 알림 권한을 허용해주세요.
                </p>
                <button
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') setPushEnabled(true);
                      });
                    } else {
                      setPushEnabled(true);
                    }
                  }}
                  className="mt-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  알림 허용하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        <section className="mt-4">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1 mb-2">
            알림 종류
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {NOTIFICATION_ITEMS.map(({ key, title, description, time }) => {
              const isOn = notifications[key];
              return (
                <div key={key} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`p-2 rounded-lg ${isOn ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {isOn
                      ? <Bell className="h-4 w-4 text-red-500 dark:text-red-400" />
                      : <BellOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isOn ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">
                      {description}
                      {time && <span className="ml-1 text-gray-400 dark:text-gray-500">· {time}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isOn ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isOn ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Display Settings */}
        <section className="mt-5">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1 mb-2">
            화면 설정
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {darkMode ? <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">다크모드</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">어두운 화면으로 전환</p>
              </div>
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  document.documentElement.classList.toggle('dark');
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  darkMode ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section className="mt-5">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1 mb-2">
            앱 정보
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { label: '데이터 출처', value: 'DART 전자공시시스템', hasArrow: false },
              { label: '버전', value: 'v1.0.0', hasArrow: false },
              { label: '이용약관', value: '', hasArrow: true },
              { label: '개인정보처리방침', value: '', hasArrow: true },
            ].map(({ label, value, hasArrow }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5">
                <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
                <div className="flex items-center gap-1">
                  {value && <p className="text-sm text-gray-400 dark:text-gray-500">{value}</p>}
                  {hasArrow && <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
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
