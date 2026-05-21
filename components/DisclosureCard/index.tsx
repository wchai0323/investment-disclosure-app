'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Disclosure, DisclosureAnalysis } from '@/lib/types';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface Props {
  disclosure: Disclosure;
  isWatchlist?: boolean;
}

export default function DisclosureCard({ disclosure, isWatchlist }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<DisclosureAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = disclosure.rceptDt
    ? `${disclosure.rceptDt.slice(0, 4)}.${disclosure.rceptDt.slice(4, 6)}.${disclosure.rceptDt.slice(6, 8)}`
    : '';

  const handleExpand = async () => {
    if (!expanded && !analysis) {
      setExpanded(true);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rcpNo: disclosure.rcpNo,
            companyName: disclosure.corpName,
            reportType: disclosure.reportNm,
          }),
        });
        if (!res.ok) throw new Error('분석 요청 실패');
        const data = await res.json();
        setAnalysis(data.analysis);
      } catch (e) {
        setError('AI 분석을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    } else {
      setExpanded(!expanded);
    }
  };

  const sentimentConfig = {
    positive: {
      label: '호재',
      icon: <TrendingUp className="h-3 w-3" />,
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    },
    negative: {
      label: '악재',
      icon: <TrendingDown className="h-3 w-3" />,
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    neutral: {
      label: '중립',
      icon: <Minus className="h-3 w-3" />,
      className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    },
  };

  const reportTypeColor = getReportTypeColor(disclosure.reportNm);

  return (
    <Card
      className={`overflow-hidden border transition-all duration-200 hover:shadow-md ${
        isWatchlist
          ? 'border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
      }`}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={handleExpand}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isWatchlist && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 shrink-0">관심종목</Badge>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${reportTypeColor}`}>
                {getReportTypeShort(disclosure.reportNm)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {disclosure.corpName}
              </h3>
              {disclosure.stockCode && (
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {disclosure.stockCode}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {disclosure.reportNm}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {formattedDate} {disclosure.rceptTm}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Quick preview if analysis loaded */}
        {analysis && !expanded && (
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={`text-xs flex items-center gap-1 ${sentimentConfig[analysis.sentiment].className}`}
            >
              {sentimentConfig[analysis.sentiment].icon}
              {sentimentConfig[analysis.sentiment].label}
            </Badge>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 flex-1">
              {analysis.summary.split('.')[0]}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Analysis */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {/* AI disclaimer */}
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              AI가 생성한 참고용 분석입니다.
            </p>
          </div>

          {loading && (
            <div className="p-6 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm">AI 분석 중...</p>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {analysis && !loading && (
            <div className="p-4 space-y-4">
              {/* Sentiment + Summary */}
              <div className="flex items-start gap-3">
                <Badge
                  className={`text-xs flex items-center gap-1 shrink-0 mt-0.5 ${
                    sentimentConfig[analysis.sentiment].className
                  }`}
                >
                  {sentimentConfig[analysis.sentiment].icon}
                  {sentimentConfig[analysis.sentiment].label}
                </Badge>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analysis.summary}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {analysis.sentimentReason}
                  </p>
                </div>
              </div>

              {/* Key Numbers */}
              {analysis.keyNumbers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    주요 수치
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.keyNumbers.map((num, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400">{num.label}</p>
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                          {num.value}
                        </p>
                        {num.change && (
                          <p
                            className={`text-xs mt-0.5 ${
                              num.isPositive
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-blue-500 dark:text-blue-400'
                            }`}
                          >
                            {num.change}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positive & Risk Factors */}
              <div className="grid grid-cols-1 gap-3">
                {analysis.positiveFactors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      긍정적 요인
                    </h4>
                    <ul className="space-y-1">
                      {analysis.positiveFactors.map((f, i) => (
                        <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                          <span className="text-green-500 shrink-0 mt-0.5">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.riskFactors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      리스크 요인
                    </h4>
                    <ul className="space-y-1">
                      {analysis.riskFactors.map((f, i) => (
                        <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                          <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Related Stocks */}
              {analysis.relatedStocks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    연관 종목 파급효과
                  </h4>
                  <div className="space-y-2">
                    {analysis.relatedStocks.map((stock, i) => (
                      <div key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <Badge
                          className={`text-xs shrink-0 ${
                            stock.impact === 'positive'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : stock.impact === 'negative'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {stock.impact === 'positive' ? '↑' : stock.impact === 'negative' ? '↓' : '→'}
                        </Badge>
                        <div>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{stock.name}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stock.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {analysis.upcomingEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    향후 체크 이벤트
                  </h4>
                  <ul className="space-y-1">
                    {analysis.upcomingEvents.map((ev, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                        <span className="text-purple-500 shrink-0 mt-0.5">•</span>
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* DART link */}
              <a
                href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${disclosure.rcpNo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                DART 원문 보기
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function getReportTypeShort(reportNm: string): string {
  if (reportNm.includes('잠정실적')) return '잠정실적';
  if (reportNm.includes('유상증자')) return '유상증자';
  if (reportNm.includes('자기주식취득')) return '자사주취득';
  if (reportNm.includes('단일판매') || reportNm.includes('공급계약')) return '계약체결';
  if (reportNm.includes('임상시험')) return '임상결과';
  if (reportNm.includes('분기보고')) return '분기보고';
  if (reportNm.includes('반기보고')) return '반기보고';
  if (reportNm.includes('사업보고')) return '사업보고';
  if (reportNm.includes('배당')) return '배당결정';
  return '공시';
}

function getReportTypeColor(reportNm: string): string {
  if (reportNm.includes('잠정실적')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
  if (reportNm.includes('유상증자')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  if (reportNm.includes('자기주식')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (reportNm.includes('임상')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
}
