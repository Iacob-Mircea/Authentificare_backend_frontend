"use client";

import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import CalendarToolbar from "../../components/CalendarToolbar";
import CalendarView from "../../components/CalendarView";
import EventModal from "../../components/EventModal";

export default function CalendarPage() {
  const [filterType, setFilterType] = useState("all");
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleDateSelect(selectInfo) {
    setEditingEvent(null);
    setSelectedRange({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setModalOpen(true);
  }

  function handleEventClick(clickInfo) {
    setSelectedRange(null);
    setEditingEvent(clickInfo.event);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedRange(null);
    setEditingEvent(null);
  }

  function handleSaved() {
    setRefreshKey((key) => key + 1);
  }

  return (
    <ProtectedRoute>
      <div className="calendarPage">
          <section className="pageHeader">
            <h1>Calendar</h1>
            <p>Gestionează task-uri și evenimente. Trage pentru a muta, redimensionează pentru a ajusta durata.</p>
          </section>

          <CalendarToolbar filterType={filterType} onFilterChange={setFilterType} />

          <button
            type="button"
            className="primaryButton addEventBtn"
            onClick={() => {
              setEditingEvent(null);
              setSelectedRange(null);
              setModalOpen(true);
            }}
          >
            + Adaugă eveniment
          </button>

          <CalendarView
           calendarId={selectedCalendarId}
            filterType={filterType}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            refreshKey={refreshKey}
          />

          <EventModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            onSaved={handleSaved}
            selectedRange={selectedRange}
            editingEvent={editingEvent}
          />
          <select
          value={selectedCalendarId ?? ""}
          onChange={(e) => setSelectedCalendarId(Number(e.target.value))}
        >
          <option value="">Alege calendarul</option>
          <option value="1">uu</option>
          <option value="2">Muncă</option>
          <option value="3">Personal</option>
        </select>
      </div>
    </ProtectedRoute>
  );
}
