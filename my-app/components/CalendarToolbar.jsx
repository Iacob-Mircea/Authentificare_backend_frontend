"use client";

export default function CalendarToolbar({ filterType, onFilterChange }) {
  return (
    <div className="calendarToolbar">
      <div className="filterGroup">
        <span className="filterLabel">Afișează:</span>
        <button
          type="button"
          className={filterType === "all" ? "filterBtn active" : "filterBtn"}
          onClick={() => onFilterChange("all")}
        >
          Toate
        </button>
        <button
          type="button"
          className={filterType === "task" ? "filterBtn active" : "filterBtn"}
          onClick={() => onFilterChange("task")}
        >
          Task-uri
        </button>
        <button
          type="button"
          className={filterType === "event" ? "filterBtn active" : "filterBtn"}
          onClick={() => onFilterChange("event")}
        >
          Evenimente
        </button>
      </div>
    </div>
  );
}
