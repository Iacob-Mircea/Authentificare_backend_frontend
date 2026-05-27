"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../lib/api";

function Page() {
  const route = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      route.push("/calendar");
    }
  }, [route]);

  return (
    <main className="homePage">
      <section className="heroSection">
        <div className="heroContent">
          <span className="badge">Productivity App</span>

          <h1 className="title">
            Organizează-ți timpul mai simplu cu <span>Calendar App</span>
          </h1>

          <p className="subtitle">
            Creează evenimente, urmărește task-uri și gestionează-ți programul
            într-o interfață clară și modernă.
          </p>

          <div className="heroButtons">
            <button
              className="primaryButton"
              onClick={() => route.push("/auth/register")}
            >
              Get Started
            </button>

            <button
              className="secondaryButton"
              onClick={() => route.push("/auth/login")}
            >
              Login
            </button>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardHeader">
            <h3>Programul de azi</h3>
            <span>Preview</span>
          </div>

          <div className="eventItem">
            <div>
              <h4>Team Meeting</h4>
              <p>09:00 - 10:00</p>
            </div>
            <span className="status statusBlue">Upcoming</span>
          </div>

          <div className="eventItem">
            <div>
              <h4>Project Review</h4>
              <p>12:30 - 13:30</p>
            </div>
            <span className="status statusGreen">Confirmed</span>
          </div>

          <div className="eventItem">
            <div>
              <h4>Workout</h4>
              <p>18:00 - 19:00</p>
            </div>
            <span className="status statusGray">Personal</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Page;
