"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import roLocale from "@fullcalendar/core/locales/ro";
import { fetchCalendarEvents, patchCalendarEvent } from "../lib/api";

export default function CalendarView({
  filterType,
  onDateSelect,
  onEventClick,
  refreshKey,
}) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadEvents(info) {
    const start = info?.start;
    const end = info?.end;

    if (!start || !end) return;

    setLoading(true);
    try {
      const data = await fetchCalendarEvents(
        start.toISOString(),
        end.toISOString(),
        filterType
      );
      setEvents(data);
    } catch (error) {
      console.error(error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    const view = api?.view;

    if (view?.activeStart && view?.activeEnd) {
      loadEvents({
        start: view.activeStart,
        end: view.activeEnd,
      });
    }
  }, [filterType, refreshKey]);

  async function handleEventDrop(info) {
    const eventType = info.event.extendedProps.type;
    const id =
      eventType === "task"
        ? info.event.extendedProps.taskId
        : info.event.extendedProps.eventId;

    try {
      await patchCalendarEvent(
        eventType,
        id,
        info.event.start.toISOString(),
        info.event.end
          ? info.event.end.toISOString()
          : info.event.start.toISOString()
      );
    } catch (error) {
      console.error(error);
      info.revert();
    }
  }

  async function handleEventResize(info) {
    const eventType = info.event.extendedProps.type;
    const id =
      eventType === "task"
        ? info.event.extendedProps.taskId
        : info.event.extendedProps.eventId;

    try {
      await patchCalendarEvent(
        eventType,
        id,
        info.event.start.toISOString(),
        info.event.end.toISOString()
      );
    } catch (error) {
      console.error(error);
      info.revert();
    }
  }

  return (
    <div className="calendarWrapper">
      {loading && <div className="calendarLoading">Se încarcă evenimentele...</div>}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        locale={roLocale}
        firstDay={1}
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        events={events}
        datesSet={loadEvents}
        select={onDateSelect}
        eventClick={onEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
      />
    </div>
  );
}
