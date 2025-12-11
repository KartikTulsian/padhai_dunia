'use client';
import React, { useMemo } from 'react';

interface ActivityData {
  date: Date | string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  title?: string;
  subtitle?: string;
  colorScheme?: 'github' | 'green' | 'blue' | 'purple' | 'orange';
}

// === constants ===
const WEEKS_TO_SHOW = 53;
const CELL_SIZE = 11;
const CELL_GAP = 3;
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_OF_WEEK_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatLocalDateKey(d: Date) {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const GITHUB_COLORS = [
  'bg-gray-100',
  'bg-[#9be9a8]',
  'bg-[#40c463]',
  'bg-[#30a14e]',
  'bg-[#216e39]',
];

const colorSchemes: Record<string, string[]> = {
  github: GITHUB_COLORS,
  green: ['bg-gray-100','bg-green-200','bg-green-400','bg-green-600','bg-green-800'],
  blue:  ['bg-gray-100','bg-blue-200','bg-blue-400','bg-blue-600','bg-blue-800'],
  purple:['bg-gray-100','bg-purple-200','bg-purple-400','bg-purple-600','bg-purple-800'],
  orange:['bg-gray-100','bg-orange-200','bg-orange-400','bg-orange-600','bg-orange-800'],
};

const getColorLevel = (count: number): number => {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
};

export default function ActivityHeatmap({
  data,
  title = 'Contributions in the last year',
  subtitle,
  colorScheme = 'github',
}: ActivityHeatmapProps) {
  const colors = colorSchemes[colorScheme] ?? GITHUB_COLORS;

  const { totalContributions, gridData, monthLabels } = useMemo(() => {
    // 1. Aggregate by date - FIXED: Handle both Date objects and strings
    const dateMap = new Map<string, number>();
    let total = 0;

    data.forEach((item) => {
      // Handle both Date objects and string dates
      let dt: Date;
      if (typeof item.date === 'string') {
        // If string, parse it properly
        dt = new Date(item.date);
      } else {
        dt = item.date;
      }
      
      // Validate date
      if (isNaN(dt.getTime())) {
        console.warn('Invalid date found:', item.date);
        return;
      }

      const key = formatLocalDateKey(dt);
      const currentCount = (dateMap.get(key) || 0) + item.count;
      dateMap.set(key, currentCount);
      total += item.count;
    });

    // Debug log
    console.log('ActivityHeatmap - Total items:', data.length);
    console.log('ActivityHeatmap - Unique dates:', dateMap.size);
    console.log('ActivityHeatmap - Total contributions:', total);
    console.log('ActivityHeatmap - Sample dates:', Array.from(dateMap.entries()).slice(0, 5));

    // 2. Range: last WEEKS_TO_SHOW weeks ending today
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (WEEKS_TO_SHOW * 7 - 1));
    startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday

    // 3. Build grid
    const cells: { date: Date; count: number; level: number }[] = [];
    let currentDate = new Date(startDate);
    const monthLabelsMap = new Map<number, string>();

    for (let i = 0; i < WEEKS_TO_SHOW * 7; i++) {
      const dateKey = formatLocalDateKey(currentDate);
      const count = dateMap.get(dateKey) ?? 0;
      const level = getColorLevel(count);
      const weekIndex = Math.floor(i / 7);

      if (currentDate.getDate() === 1 && !monthLabelsMap.has(weekIndex)) {
        monthLabelsMap.set(weekIndex, MONTH_NAMES[currentDate.getMonth()]);
      }

      cells.push({
        date: new Date(currentDate),
        count: currentDate > endDate ? -1 : count,
        level: currentDate > endDate ? -1 : level,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthLabels = Array.from(monthLabelsMap.entries())
      .map(([index, name]) => ({ name, index }))
      .sort((a, b) => a.index - b.index);

    return { totalContributions: total, gridData: cells, monthLabels };
  }, [data]);

  const PIXEL_PER_COLUMN = CELL_SIZE + CELL_GAP;

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-100">
      <div className="mb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {totalContributions} {title.toLowerCase()}
            </h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block pt-5 relative">
          {/* month labels */}
          <div className="absolute top-0 left-8 h-4 flex items-center whitespace-nowrap">
            {monthLabels.map(({ name, index }) => (
              <span
                key={index}
                className="text-xs text-gray-500 absolute"
                style={{ left: `${index * PIXEL_PER_COLUMN}px` }}
              >
                {name}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* day labels */}
            <div className="flex flex-col text-xs text-gray-500 pr-2">
              {[...Array(7)].map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="h-[11px] mb-[3px] flex items-center"
                  style={{ visibility: [1, 3, 5].includes(dayIndex) ? 'visible' : 'hidden' }}
                >
                  {DAYS_OF_WEEK_LABELS[dayIndex]}
                </div>
              ))}
            </div>

            {/* grid */}
            <div className="flex gap-[3px]">
              {[...Array(WEEKS_TO_SHOW)].map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {[...Array(7)].map((_, dayIndex) => {
                    const cellIndex = weekIndex * 7 + dayIndex;
                    const cell = gridData[cellIndex];
                    if (!cell) return <div key={dayIndex} className="w-[11px] h-[11px]" />;

                    const colorClass = cell.count === -1 ? 'bg-transparent' : colors[cell.level];
                    const title =
                      cell.count === -1
                        ? ''
                        : `${cell.date.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}: ${cell.count} contribution${cell.count !== 1 ? 's' : ''}`;

                    return (
                      <div
                        key={dayIndex}
                        title={title}
                        aria-label={title}
                        className={`w-[11px] h-[11px] rounded-xs ${
                          cell.count === -1 ? '' : 'border border-black/10 cursor-pointer'
                        } ${colorClass} transition-transform duration-100 hover:scale-110`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-600">
        <span className="text-sm text-gray-500 mr-1">Less</span>
        {colors.map((c, i) => (
          <div
            key={i}
            className={`w-[11px] h-[11px] rounded-xs ${c} border border-black/10`}
            title={`Level ${i}`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">More</span>
      </div>
    </div>
  );
}