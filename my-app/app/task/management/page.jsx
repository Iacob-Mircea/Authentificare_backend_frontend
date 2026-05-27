"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import {
  fetchManagements,
  createManagement,
  apiFetch,
} from "../../../lib/api";
import { localInputToIso } from "../../../lib/datetime";

export default function ManagementPage() {
  const [managementForm, setManagementForm] = useState({
    title: "",
    description: "",
    type: false,
  });

  const [taskForm, setTaskForm] = useState({
    description: "",
    data: "",
    startHour: "",
    endHour: "",
    assign: false,
    management_id: "",
  });

  const [managements, setManagements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchManagements().then(setManagements).catch(console.error);
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await apiFetch("/task/task/");
      if (!res.ok) return;
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  }

  function handleManagementChange(e) {
    const { name, value, type, checked } = e.target;
    setManagementForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTaskChange(e) {
    const { name, value, type, checked } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleCreateManagement(e) {
    e.preventDefault();
    setMessage("");

    try {
      await createManagement({
        title: managementForm.title,
        description: managementForm.description,
        type: managementForm.type,
      });

      setMessage("Categorie creată cu succes");
      setManagementForm({ title: "", description: "", type: false });
      const data = await fetchManagements();
      setManagements(data);
    } catch (error) {
      console.error(error);
      setMessage("Eroare de server");
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await apiFetch("/task/task/", {
        method: "POST",
        body: JSON.stringify({
          description: taskForm.description,
          data: taskForm.data,
          startHour: localInputToIso(taskForm.startHour),
          endHour: localInputToIso(taskForm.endHour),
          assign: taskForm.assign,
          management_id: taskForm.management_id
            ? Number(taskForm.management_id)
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Nu s-a putut crea task-ul");
        return;
      }

      setMessage("Task creat cu succes");
      setTaskForm({
        description: "",
        data: "",
        startHour: "",
        endHour: "",
        assign: false,
        management_id: "",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
      setMessage("Eroare de server");
    }
  }

  return (
    <ProtectedRoute>
      <main className="managementPage">
        <section className="pageHeader">
          <h1>Categorii & Task-uri</h1>
          <p>Administrează categoriile (management) folosite de task-uri în calendar.</p>
        </section>

        {message && <p className="messageBox">{message}</p>}

        <section className="dashboardGrid">
          <div className="card">
            <h2>Creează categorie</h2>

            <form onSubmit={handleCreateManagement} className="form">
              <input
                name="title"
                placeholder="Titlu categorie"
                value={managementForm.title}
                onChange={handleManagementChange}
                required
              />

              <textarea
                name="description"
                placeholder="Descriere"
                value={managementForm.description}
                onChange={handleManagementChange}
                required
              />

              <label className="checkboxRow">
                <input
                  name="type"
                  type="checkbox"
                  checked={managementForm.type}
                  onChange={handleManagementChange}
                />
                Tip special
              </label>

              <button type="submit" className="primaryButton">
                Creează categorie
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Creează task rapid</h2>

            <form onSubmit={handleCreateTask} className="form">
              <input
                name="description"
                placeholder="Descriere task"
                value={taskForm.description}
                onChange={handleTaskChange}
                required
              />

              <input
                name="data"
                type="date"
                value={taskForm.data}
                onChange={handleTaskChange}
              />

              <label>Start</label>
              <input
                name="startHour"
                type="datetime-local"
                value={taskForm.startHour}
                onChange={handleTaskChange}
                required
              />

              <label>Sfârșit</label>
              <input
                name="endHour"
                type="datetime-local"
                value={taskForm.endHour}
                onChange={handleTaskChange}
                required
              />

              <select
                name="management_id"
                value={taskForm.management_id}
                onChange={handleTaskChange}
              >
                <option value="">Fără categorie</option>
                {managements.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <label className="checkboxRow">
                <input
                  name="assign"
                  type="checkbox"
                  checked={taskForm.assign}
                  onChange={handleTaskChange}
                />
                Asignat
              </label>

              <button type="submit" className="primaryButton">
                Creează task
              </button>
            </form>
          </div>
        </section>

        <section className="listsGrid">
          <div className="card">
            <h2>Categorii</h2>

            {managements.length === 0 ? (
              <p>Nicio categorie încă.</p>
            ) : (
              <div className="list">
                {managements.map((item) => (
                  <div key={item.id} className="listItem">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2>Task-uri recente</h2>

            {tasks.length === 0 ? (
              <p>Niciun task încă.</p>
            ) : (
              <div className="list">
                {tasks.map((task) => (
                  <div key={task.id} className="listItem">
                    <h3>{task.description}</h3>
                    <p>
                      {task.startHour} - {task.endHour}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
