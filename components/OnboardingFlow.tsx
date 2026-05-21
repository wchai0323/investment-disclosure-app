'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';
import { OnboardingProfile } from '@/lib/types';

interface Props {
  onComplete: (profile: OnboardingProfile) => void;
  onSkip: () => void;
}

const USER_TYPES = ['직장인 투자자', '전업 투자자', '투자 입문자'];
const MARKET_PREFS = ['국내주식 위주', '미국주식 위주', '둘 다'];
const CATEGORIES = ['실적공시', '매크로', '배당', '공모주'];

export default function OnboardingFlow({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string[]>([]);
  const [marketPref, setMarketPref] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleComplete = () => {
    onComplete({
      userType,
      marketPreference: marketPref,
      categories,
      completed: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden">
        {/* Skip button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-1.5">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  s <= step ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onSkip}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
          >
            나중에 하기
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                어떤 분이세요?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                맞춤형 공시 피드를 제공해 드릴게요 (복수 선택 가능)
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                    투자 스타일
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {USER_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleItem(userType, type, setUserType)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          userType.includes(type)
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                    관심 시장
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MARKET_PREFS.map((pref) => (
                      <button
                        key={pref}
                        onClick={() => toggleItem(marketPref, pref, setMarketPref)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          marketPref.includes(pref)
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                관심 카테고리
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                알림받고 싶은 공시 종류를 선택해주세요 (복수 선택 가능)
              </p>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleItem(categories, cat, setCategories)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                      categories.includes(cat)
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-400 text-red-700 dark:text-red-400'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getCategoryEmoji(cat)}</div>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-[2] bg-red-500 hover:bg-red-600 text-white"
                >
                  시작하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    실적공시: '📊',
    매크로: '🌐',
    배당: '💰',
    공모주: '🚀',
  };
  return map[cat] || '📋';
}
