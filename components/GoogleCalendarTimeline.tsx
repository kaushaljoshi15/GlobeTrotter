'use client';

import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Download,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  MoveUp,
  MoveDown
} from 'lucide-react';

interface Activity {
  id: number;
  custom_title?: string;
  original_activity_name?: string;
  category?: string;
  activity_date?: string;
  start_time?: string;
  end_time?: string;
  cost: number | string;
  notes?: string;
  trip_stop_id?: number;
}

interface Stop {
  id: number;
  city_name: string;
  country: string;
  arrival_date: string;
  departure_date: string;
  activities?: Activity[];
  stay_cost_estimated?: number;
  transport_cost_estimated?: number;
}

interface GoogleCalendarTimelineProps {
  trip: {
    id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    stops: Stop[];
  };
  onAddActivity?: (stopId: number, dateStr: string) => void;
  onDeleteActivity?: (activityId: number) => void;
}

export default function GoogleCalendarTimeline({
  trip,
  onAddActivity,
  onDeleteActivity,
}: GoogleCalendarTimelineProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'week'>('calendar');
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return trip.start_date ? new Date(trip.start_date) : new Date();
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    return trip.start_date ? new Date(trip.start_date).toISOString().split('T')[0] : null;
  });
  const [quickAddModal, setQuickAddModal] = useState<{ open: boolean; date: string; stopId?: number }>({
    open: false,
    date: '',
  });
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('10:00');
  const [quickCost, setQuickCost] = useState('30');
  const [copiedSync, setCopiedSync] = useState(false);

  // Local activities state for live reordering & quick additions
  const [localActivities, setLocalActivities] = useState<Activity[]>(() => {
    const all: Activity[] = [];
    trip.stops?.forEach((s) => {
      s.activities?.forEach((a) => {
        all.push({
          ...a,
          trip_stop_id: s.id,
          activity_date: a.activity_date || s.arrival_date,
        });
      });
    });
    return all;
  });

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map dates to active stops
  const getStopForDate = (dateStr: string) => {
    const d = new Date(dateStr).getTime();
    return trip.stops?.find((s) => {
      const arr = new Date(s.arrival_date).getTime();
      const dep = new Date(s.departure_date).getTime();
      return d >= arr && d <= dep;
    });
  };

  // Map activities for specific date
  const getActivitiesForDate = (dateStr: string) => {
    return localActivities.filter((a) => a.activity_date?.split('T')[0] === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Generate Google Calendar .ics Web Import / Sync
  const handleExportToGoogleCalendar = () => {
    // Generate .ics calendar format
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GlobeTrotter Atelier//Multi-City Trip Planner//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;

    trip.stops?.forEach((s, idx) => {
      const startClean = s.arrival_date.replace(/-/g, '').split('T')[0];
      const endClean = s.departure_date.replace(/-/g, '').split('T')[0];

      icsContent += `BEGIN:VEVENT\nSUMMARY:Stop ${idx + 1}: ${s.city_name}, ${s.country} (${trip.title})\nDESCRIPTION:Multi-city stop in ${s.city_name}. Booked via GlobeTrotter Atelier.\nLOCATION:${s.city_name}, ${s.country}\nDTSTART;VALUE=DATE:${startClean}\nDTEND;VALUE=DATE:${endClean}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;

      s.activities?.forEach((act) => {
        const actDate = (act.activity_date || s.arrival_date).replace(/-/g, '').split('T')[0];
        const title = act.custom_title || act.original_activity_name || 'Scheduled Activity';
        icsContent += `BEGIN:VEVENT\nSUMMARY:${title} (${s.city_name})\nDESCRIPTION:${title} in ${s.city_name}. Cost: $${act.cost}\nLOCATION:${s.city_name}\nDTSTART;VALUE=DATE:${actDate}\nDTEND;VALUE=DATE:${actDate}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
      });
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trip.title.replace(/\s+/g, '_')}_Google_Calendar_Sync.ics`;
    link.click();

    setCopiedSync(true);
    setTimeout(() => setCopiedSync(false), 3000);
  };

  // Quick Add Activity
  const handleSaveQuickActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickAddModal.date) return;

    const newAct: Activity = {
      id: Date.now(),
      custom_title: quickTitle,
      category: 'sightseeing',
      activity_date: quickAddModal.date,
      start_time: quickTime,
      end_time: '12:00',
      cost: quickCost,
      trip_stop_id: quickAddModal.stopId || trip.stops[0]?.id || 1,
    };

    setLocalActivities([...localActivities, newAct]);
    setQuickTitle('');
    setQuickAddModal({ open: false, date: '' });
  };

  // Reorder Activity (Move Up/Down)
  const handleReorder = (actId: number, direction: 'up' | 'down') => {
    const list = [...localActivities];
    const idx = list.findIndex((a) => a.id === actId);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const temp = list[idx - 1];
      list[idx - 1] = list[idx];
      list[idx] = temp;
    } else if (direction === 'down' && idx < list.length - 1) {
      const temp = list[idx + 1];
      list[idx + 1] = list[idx];
      list[idx] = temp;
    }
    setLocalActivities(list);
  };

  const selectedDayStop = selectedDay ? getStopForDate(selectedDay) : null;
  const selectedDayActivities = selectedDay ? getActivitiesForDate(selectedDay) : [];

  return (
    <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
      
      {/* Calendar Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            Google-Style Itinerary Flow
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Interactive Journey Calendar &amp; Timeline
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* View Mode Toggle */}
          <div className="bg-[#0c0d10] p-1 rounded-2xl border border-white/15 flex items-center gap-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Month Grid
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Vertical Timeline
            </button>
          </div>

          {/* Sync to Google Calendar Button */}
          <button
            onClick={handleExportToGoogleCalendar}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-[#e4c29e] text-xs font-bold border border-white/15 transition-all shadow-md cursor-pointer"
            title="Download .ics file to import directly into Google Calendar on iOS/Android/Web"
          >
            {copiedSync ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            <span>{copiedSync ? 'Downloaded .ics!' : 'Sync to Google Calendar'}</span>
          </button>

        </div>
      </div>

      {/* ================= VIEW 1: MONTH GRID CALENDAR ================= */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          
          {/* Month Navigation Banner */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-xl font-bold text-white">{monthName}</h3>
              <span className="text-xs text-stone-400">({trip.stops?.length || 0} Scheduled Cities)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#0c0d10] border border-white/10 hover:border-white/20 text-stone-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#0c0d10] border border-white/10 hover:border-white/20 text-stone-300 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="rounded-3xl border border-white/10 bg-[#0c0d10]/90 overflow-hidden shadow-2xl">
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-[#14151a] text-center text-[11px] font-bold uppercase tracking-wider text-stone-400 py-3">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[110px] p-2 border-b border-r border-white/5 bg-[#0c0d10]/40" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                const stop = getStopForDate(dateStr);
                const acts = getActivitiesForDate(dateStr);
                const isSelected = selectedDay === dateStr;

                return (
                  <div
                    key={`day-${dayNumber}`}
                    onClick={() => setSelectedDay(dateStr)}
                    className={`min-h-[110px] p-2 border-b border-r border-white/5 transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#14151a] ring-2 ring-[#c99a6b] shadow-inner'
                        : stop
                        ? 'bg-[#14151a]/40 hover:bg-[#14151a]/80'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Day Number and Stop Indicator */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${stop ? 'text-white' : 'text-stone-500'}`}>
                        {dayNumber}
                      </span>

                      {stop && (
                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/30 truncate max-w-[70px]">
                          {stop.city_name}
                        </span>
                      )}
                    </div>

                    {/* Activities Pills on Calendar Cell */}
                    <div className="space-y-1 my-1 flex-1 overflow-hidden">
                      {acts.slice(0, 2).map((act) => (
                        <div
                          key={act.id}
                          className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] text-stone-200 truncate flex items-center justify-between"
                        >
                          <span className="truncate">{act.custom_title || act.original_activity_name}</span>
                          <span className="text-[#e4c29e] font-mono ml-1">${act.cost}</span>
                        </div>
                      ))}
                      {acts.length > 2 && (
                        <span className="text-[8px] text-stone-400 font-semibold block">
                          +{acts.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Hover Quick Add Action */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickAddModal({ open: true, date: dateStr, stopId: stop?.id });
                        }}
                        className="p-1 rounded-md bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-stone-300 text-[10px]"
                        title="Quick Add Activity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Expandable Daily Plan Drawer */}
          {selectedDay && (
            <div className="p-6 rounded-[28px] bg-[#0c0d10] border border-[#c99a6b]/30 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-white">
                      Daily Schedule: {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {selectedDayStop && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] text-xs font-bold">
                        📍 {selectedDayStop.city_name}, {selectedDayStop.country}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {selectedDayActivities.length} Scheduled experiences for this date
                  </p>
                </div>

                <button
                  onClick={() => setQuickAddModal({ open: true, date: selectedDay, stopId: selectedDayStop?.id })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold text-xs shadow-md cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity to Day</span>
                </button>
              </div>

              {selectedDayActivities.length === 0 ? (
                <div className="text-center py-8 text-stone-500 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-stone-600" />
                  <p className="text-xs">No scheduled activities on this date yet.</p>
                  <p className="text-[11px] text-stone-600">Click &ldquo;Add Activity to Day&rdquo; above to schedule morning, afternoon, or evening sights.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayActivities.map((act, index) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-[#14151a] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#c99a6b]/15 text-[#e4c29e] font-serif font-bold flex items-center justify-center text-xs">
                          {act.start_time || '10:00'}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-bold text-white">{act.custom_title || act.original_activity_name}</p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            <span className="capitalize text-[#e4c29e] font-semibold">{act.category || 'Sightseeing'}</span>
                            <span> &bull; </span>
                            <span className="text-emerald-400 font-bold">${act.cost}</span>
                          </p>
                        </div>
                      </div>

                      {/* Reorder Buttons & Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReorder(act.id, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 disabled:opacity-30 cursor-pointer"
                          title="Move Earlier"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorder(act.id, 'down')}
                          disabled={index === selectedDayActivities.length - 1}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 disabled:opacity-30 cursor-pointer"
                          title="Move Later"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setLocalActivities(localActivities.filter((a) => a.id !== act.id));
                            if (onDeleteActivity) onDeleteActivity(act.id);
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-2"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ================= VIEW 2: VERTICAL TIMELINE ================= */}
      {viewMode === 'timeline' && (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#c99a6b]/30 space-y-8">
          {trip.stops?.map((stop, idx) => (
            <div key={stop.id} className="relative">
              
              {/* Timeline Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] border-4 border-[#0c0d10] flex items-center justify-center text-[9px] font-bold text-[#0c0d10] shadow-md">
                {idx + 1}
              </div>

              <div className="bg-[#0c0d10] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#e4c29e] uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      Stop {idx + 1} &bull; {stop.country}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1">{stop.city_name}</h3>
                  </div>

                  <span className="text-xs font-sans text-stone-400">
                    {new Date(stop.arrival_date).toLocaleDateString()} &rarr; {new Date(stop.departure_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Day-by-Day activities inside stop */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {stop.activities && stop.activities.length > 0 ? (
                    stop.activities.map((act) => (
                      <div
                        key={act.id}
                        className="text-xs flex items-center justify-between bg-[#14151a] p-3 rounded-2xl text-stone-300"
                      >
                        <span className="flex items-center gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-[#c99a6b]" />
                          <strong className="text-white">{act.start_time || '10:00'}</strong> — {act.custom_title || act.original_activity_name}
                        </span>
                        <span className="text-emerald-400 font-bold">${parseFloat(String(act.cost))}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500 py-2">No activities scheduled yet for {stop.city_name}.</p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= QUICK ADD ACTIVITY MODAL ================= */}
      {quickAddModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Add Activity</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Scheduled on {new Date(quickAddModal.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setQuickAddModal({ open: false, date: '' })}
                className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuickActivity} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Activity Name / Experience</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Louvre Museum Guided Tour, Gondola Ride..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={quickTime}
                    onChange={(e) => setQuickTime(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Est. Cost ($)</label>
                  <input
                    type="number"
                    value={quickCost}
                    onChange={(e) => setQuickCost(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuickAddModal({ open: false, date: '' })}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20"
                >
                  Save to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
