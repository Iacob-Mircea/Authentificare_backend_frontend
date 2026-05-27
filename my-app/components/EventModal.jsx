"use client";

import { useEffect, useState } from "react";
import {
  toLocalInputValue,
  localInputToIso,
  toDateInputValue,
} from "../lib/datetime";
import {
  createSimpleEvent,
  updateSimpleEvent,
  deleteSimpleEvent,
  createTask,
  updateTask,
  deleteTask,
  fetchCategories,
} from "../lib/api";

const EMPTY_FORM = {
  itemType: "event",
  title: "",
  description: "",
  start_at: "",
  end_at: "",
  category: "meeting",
  management_id: "",
  assign: false,
};

export default function EventModal({
  isOpen,
  onClose,
  onSaved,
  selectedRange,
  editingEvent,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories().then(setCategories).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (editingEvent) {
      const props = editingEvent.extendedProps || {};
      const isTask = props.type === "task";

      setForm({
        itemType: isTask ? "task" : "event",
        title: isTask ? props.description || editingEvent.title : editingEvent.title,
        description: props.description || "",
        start_at: toLocalInputValue(editingEvent.start),
        end_at: toLocalInputValue(editingEvent.end || editingEvent.start),
        category: props.category || "meeting",
        management_id: props.managementId ? String(props.managementId) : "",
        assign: props.assign || false,
        editId: isTask ? props.taskId : props.eventId,
      });
    } else if (selectedRange) {
      setForm({
        ...EMPTY_FORM,
        start_at: toLocalInputValue(selectedRange.start),
        end_at: toLocalInputValue(selectedRange.end || selectedRange.start),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setMessage("");
  }, [isOpen, editingEvent, selectedRange]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (form.itemType === "event") {
        const payload = {
          title: form.title,
          description: form.description,
          start_at: localInputToIso(form.start_at),
          end_at: localInputToIso(form.end_at),
          category: form.category,
        };

        if (editingEvent) {
          await updateSimpleEvent(form.editId, payload);
        } else {
          await createSimpleEvent(payload);
        }
      } else {
        const payload = {
          description: form.title,
          data: toDateInputValue(form.start_at),
          startHour: localInputToIso(form.start_at),
          endHour: localInputToIso(form.end_at),
          assign: form.assign,
          management_id: form.management_id ? Number(form.management_id) : null,
        };

        if (editingEvent) {
          await updateTask(form.editId, payload);
        } else {
          await createTask(payload);
        }
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      setMessage("Nu s-a putut salva. Verifică datele introduse.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingEvent || !window.confirm("Sigur vrei să ștergi?")) return;

    setSaving(true);
    try {
      const props = editingEvent.extendedProps || {};
      if (props.type === "task") {
        await deleteTask(props.taskId);
      } else {
        await deleteSimpleEvent(props.eventId);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      setMessage("Nu s-a putut șterge.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>{editingEvent ? "Editează" : "Eveniment nou"}</h2>
          <button type="button" className="modalClose" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalForm">
          {!editingEvent && (
            <label>
              Tip
              <select name="itemType" value={form.itemType} onChange={handleChange}>
                <option value="event">Eveniment simplu</option>
                <option value="task">Task</option>
              </select>
            </label>
          )}

          <label>
            {form.itemType === "task" ? "Descriere task" : "Titlu"}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder={form.itemType === "task" ? "Descriere task" : "Titlu eveniment"}
            />
          </label>

          {form.itemType === "event" && (
            <>
              <label>
                Descriere
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detalii opționale"
                />
              </label>

              <label>
                Categorie
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                  <option value="personal">Personal</option>
                </select>
              </label>
            </>
          )}

          {form.itemType === "task" && (
            <>
              <label>
                Categorie (Management)
                <select
                  name="management_id"
                  value={form.management_id}
                  onChange={handleChange}
                >
                  <option value="">Fără categorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="checkboxRow">
                <input
                  name="assign"
                  type="checkbox"
                  checked={form.assign}
                  onChange={handleChange}
                />
                Asignat
              </label>
            </>
          )}

          <label>
            Început
            <input
              name="start_at"
              type="datetime-local"
              value={form.start_at}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Sfârșit
            <input
              name="end_at"
              type="datetime-local"
              value={form.end_at}
              onChange={handleChange}
              required
            />
          </label>

          {message && <p className="modalError">{message}</p>}

          <div className="modalActions">
            {editingEvent && (
              <button
                type="button"
                className="dangerButton"
                onClick={handleDelete}
                disabled={saving}
              >
                Șterge
              </button>
            )}
            <button type="button" className="secondaryButton" onClick={onClose}>
              Anulează
            </button>
            <button type="submit" className="primaryButton" disabled={saving}>
              {saving ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
