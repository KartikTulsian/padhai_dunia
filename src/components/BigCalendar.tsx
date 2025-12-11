"use client";

import { Calendar, momentLocalizer, View, Views, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'lesson' | 'quiz' | 'exam' | 'assignment';
  course?: string;
  description?: string;
}

const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent>) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToToday = () => toolbar.onNavigate('TODAY');

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 p-2 bg-gray-50/50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <button onClick={goToBack} className="p-1.5 hover:bg-gray-50 rounded-l-lg transition text-gray-600 border-r">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToNext} className="p-1.5 hover:bg-gray-50 rounded-r-lg transition text-gray-600">
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
        <span className="text-lg font-bold text-gray-800 min-w-[150px]">
            {toolbar.label}
        </span>
      </div>

      <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
        <button onClick={goToToday} className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded transition mr-2">Today</button>
        <div className="w-px bg-gray-200 mx-1"></div>
        <button onClick={() => toolbar.onView('month')} className={`px-3 py-1 text-xs font-semibold rounded transition ${toolbar.view === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Month</button>
        <button onClick={() => toolbar.onView('work_week')} className={`px-3 py-1 text-xs font-semibold rounded transition ${toolbar.view === 'work_week' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Week</button>
        <button onClick={() => toolbar.onView('day')} className={`px-3 py-1 text-xs font-semibold rounded transition ${toolbar.view === 'day' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Day</button>
      </div>
    </div>
  );
};

const BigCalendar = ({ id, type = 'student' }: { id?: string, type?: 'student' | 'teacher' }) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'teacher' ? '/api/teacher/schedule' : '/api/student/schedule';
        const paramKey = type === 'teacher' ? 'teacherId' : 'studentId';
        const url = id ? `${endpoint}?${paramKey}=${id}` : endpoint;
            
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          const calendarEvents: CalendarEvent[] = [];
          const parseDate = (d: any) => new Date(d);

          if (data.lessons) {
            data.lessons.forEach((lesson: any) => {
              const start = parseDate(lesson.scheduledTime);
              if (!isNaN(start.getTime())) {
                  const end = new Date(start.getTime() + (lesson.duration || 45) * 60000); 
                  calendarEvents.push({
                    id: `lesson-${lesson.id}-${start.getTime()}`,
                    title: `📚 ${lesson.title}`,
                    start, end, type: 'lesson', course: lesson.course?.title,
                  });
              }
            });
          }

          if (type === 'student') {
              if (data.quizzes) {
                data.quizzes.forEach((quiz: any) => {
                  if (quiz.scheduledAt) {
                    const start = parseDate(quiz.scheduledAt);
                    if (!isNaN(start.getTime())) {
                        const end = new Date(start.getTime() + (quiz.duration || 30) * 60000);
                        calendarEvents.push({
                          id: `quiz-${quiz.id}`, title: `❓ ${quiz.title}`, start, end, type: 'quiz', course: quiz.course?.title,
                        });
                    }
                  }
                });
              }
              // ... Add Exams and Assignments parsing same as before ...
          }

          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, type]);

  const handleOnChangeView = (selectedView: View) => setView(selectedView);
  const handleNavigate = (newDate: Date) => setDate(newDate);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6';
    let borderLeft = '4px solid #1d4ed8';

    switch (event.type) {
      case 'lesson': backgroundColor = '#eff6ff'; borderLeft = '4px solid #3b82f6'; break; 
      case 'quiz': backgroundColor = '#faf5ff'; borderLeft = '4px solid #a855f7'; break; 
    }

    return {
      style: {
        backgroundColor, color: '#1f2937', border: 'none', borderLeft, borderRadius: '4px',
        padding: '2px 6px', fontSize: '0.75rem', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50/50 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day", "month"]}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleOnChangeView}
        style={{ height: "100%", minHeight: "500px" }}
        min={new Date(2025, 0, 1, 7, 0, 0)} 
        max={new Date(2025, 0, 1, 19, 0, 0)}
        eventPropGetter={eventStyleGetter}
        components={{ toolbar: CustomToolbar }}
        tooltipAccessor={(event) => `${event.title} (${event.course || 'General'})`}
        formats={{ eventTimeRangeFormat: () => "" }}
      />
    </div>
  );
};

export default BigCalendar;