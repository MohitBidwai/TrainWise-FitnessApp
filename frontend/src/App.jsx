import { useState } from "react";

const activityTypes = [
  "RUNNING",
  "WALKING",
  "CYCLING",
  "YOGA",
  "GYM",
  "SPORTS",
  "CARDIO",
  "OTHER"
];

const initialUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const initialActivity = {
  userId: "",
  type: "RUNNING",
  duration: "",
  caloriesBurned: "",
  startTime: "",
  additionalMetrics: '{\n  "distanceKm": 5\n}'
};

const initialRecommendation = {
  userId: "",
  activityId: "",
  suggestions: "Hydrate well\nStart with a short warm-up",
  safety: "Keep posture stable\nStop if pain increases",
  improvemenets: "Increase pace gradually\nTrack recovery after exercise"
};

export default function App() {
  const [status, setStatus] = useState("Ready");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");

  const [userForm, setUserForm] = useState(initialUser);
  const [activityForm, setActivityForm] = useState(initialActivity);
  const [recommendationForm, setRecommendationForm] = useState(initialRecommendation);

  const [registerResult, setRegisterResult] = useState(null);
  const [activityResult, setActivityResult] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);

  const [activities, setActivities] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [activityRecommendations, setActivityRecommendations] = useState([]);

  const [errors, setErrors] = useState({
    register: "",
    activity: "",
    recommendation: "",
    activities: "",
    userRecommendations: "",
    activityRecommendations: ""
  });

  async function apiRequest(path, options = {}) {
    setStatus("Connecting...");
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}${path}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    if (!response.ok) {
      const text = await response.text();
      setStatus("Error");
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    setStatus("Connected");
    return response.json();
  }

  async function handleRegister(event) {
    event.preventDefault();
    clearError("register");

    try {
      const user = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userForm)
      });

      setRegisterResult(user);
      setSelectedUserId(String(user.id));
      setUserForm(initialUser);
      setActivityForm((current) => ({ ...current, userId: String(user.id) }));
      setRecommendationForm((current) => ({ ...current, userId: String(user.id) }));
    } catch (error) {
      setError("register", error.message);
    }
  }

  async function handleActivitySave(event) {
    event.preventDefault();
    clearError("activity");

    try {
      const payload = {
        userId: Number(activityForm.userId),
        type: activityForm.type,
        duration: Number(activityForm.duration),
        caloriesBurned: Number(activityForm.caloriesBurned),
        startTime: activityForm.startTime,
        additionalMetrics: activityForm.additionalMetrics.trim()
          ? JSON.parse(activityForm.additionalMetrics)
          : {}
      };

      const activity = await apiRequest("/api/activities", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setActivityResult(activity);
      setSelectedUserId(String(activity.userId));
      setSelectedActivityId(String(activity.id));
      setActivityForm((current) => ({
        ...initialActivity,
        userId: String(activity.userId),
        type: current.type
      }));
      setRecommendationForm((current) => ({
        ...current,
        userId: String(activity.userId),
        activityId: String(activity.id)
      }));
      await loadActivities(activity.userId);
    } catch (error) {
      setError("activity", error.message);
    }
  }

  async function handleRecommendationSave(event) {
    event.preventDefault();
    clearError("recommendation");

    try {
      const payload = {
        userId: Number(recommendationForm.userId),
        activityId: Number(recommendationForm.activityId),
        suggestions: splitLines(recommendationForm.suggestions),
        safety: splitLines(recommendationForm.safety),
        improvemenets: splitLines(recommendationForm.improvemenets)
      };

      const recommendation = await apiRequest("/api/recommendation/generate", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setRecommendationResult(recommendation);
      setSelectedUserId(String(payload.userId));
      setSelectedActivityId(String(payload.activityId));
      await Promise.all([
        loadUserRecommendations(payload.userId),
        loadActivityRecommendations(payload.activityId)
      ]);
    } catch (error) {
      setError("recommendation", error.message);
    }
  }

  async function loadActivities(userId = Number(selectedUserId || activityForm.userId)) {
    clearError("activities");
    if (!userId) {
      setError("activities", "Enter a user id first.");
      return;
    }

    try {
      const data = await apiRequest(`/api/activities/users/${userId}`);
      setActivities(data);

      if (data.length > 0) {
        const latest = data[data.length - 1];
        setSelectedActivityId(String(latest.id));
        setRecommendationForm((current) => ({ ...current, activityId: String(latest.id), userId: String(userId) }));
      }
    } catch (error) {
      setError("activities", error.message);
    }
  }

  async function loadUserRecommendations(userId = Number(recommendationForm.userId || selectedUserId)) {
    clearError("userRecommendations");
    if (!userId) {
      setError("userRecommendations", "Enter a user id first.");
      return;
    }

    try {
      const data = await apiRequest(`/api/recommendation/user/${userId}`);
      setUserRecommendations(data);
    } catch (error) {
      setError("userRecommendations", error.message);
    }
  }

  async function loadActivityRecommendations(activityId = Number(recommendationForm.activityId || selectedActivityId)) {
    clearError("activityRecommendations");
    if (!activityId) {
      setError("activityRecommendations", "Enter an activity id first.");
      return;
    }

    try {
      const data = await apiRequest(`/api/recommendation/activity/${activityId}`);
      setActivityRecommendations(data);
    } catch (error) {
      setError("activityRecommendations", error.message);
    }
  }

  function setError(key, message) {
    setErrors((current) => ({ ...current, [key]: message }));
  }

  function clearError(key) {
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TrainWise</p>
          <h1>Train smarter. Track progress with clarity.</h1>
          <p className="hero-text">A simple training dashboard for users, activities, and recommendations.</p>
          <div className="hero-stats">
            <StatCard label="API status" value={status} />
            <StatCard label="Selected user" value={selectedUserId ? `User #${selectedUserId}` : "None"} />
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="grid-section">
          <Panel
            title="Create User"
            description="Connects to /api/auth/register"
            footer={registerResult && (
              <ResultCard
                title="User created"
                meta={[
                  `ID: ${registerResult.id}`,
                  `${registerResult.firstName} ${registerResult.lastName}`,
                  registerResult.emailId
                ]}
              />
            )}
          >
            <form className="form-stack" onSubmit={handleRegister}>
              <Field label="First name">
                <input value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} required />
              </Field>
              <Field label="Last name">
                <input value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} required />
              </Field>
              <Field label="Email">
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
              </Field>
              <Field label="Password">
                <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required />
              </Field>
              <button type="submit">Register User</button>
              {errors.register && <p className="error-text">{errors.register}</p>}
            </form>
          </Panel>

          <Panel
            title="Track Activity"
            description="Connects to /api/activities"
            footer={activityResult && (
              <ResultCard
                title="Activity saved"
                meta={[
                  `Activity #${activityResult.id}`,
                  `${activityResult.type} for ${activityResult.duration} mins`,
                  `Calories: ${activityResult.caloriesBurned}`
                ]}
              />
            )}
          >
            <form className="form-stack" onSubmit={handleActivitySave}>
              <Field label="User ID">
                <input type="number" value={activityForm.userId} onChange={(e) => setActivityForm({ ...activityForm, userId: e.target.value })} required />
              </Field>
              <Field label="Activity type">
                <select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Duration (minutes)">
                <input type="number" min="1" value={activityForm.duration} onChange={(e) => setActivityForm({ ...activityForm, duration: e.target.value })} required />
              </Field>
              <Field label="Calories burned">
                <input type="number" min="0" value={activityForm.caloriesBurned} onChange={(e) => setActivityForm({ ...activityForm, caloriesBurned: e.target.value })} required />
              </Field>
              <Field label="Start time">
                <input type="datetime-local" value={activityForm.startTime} onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })} required />
              </Field>
              <Field label="Additional metrics (JSON)">
                <textarea rows="5" value={activityForm.additionalMetrics} onChange={(e) => setActivityForm({ ...activityForm, additionalMetrics: e.target.value })} />
              </Field>
              <button type="submit">Save Activity</button>
              {errors.activity && <p className="error-text">{errors.activity}</p>}
            </form>
          </Panel>
        </section>

        <section className="grid-section">
          <Panel
            title="Generate Recommendation"
            description="Connects to /api/recommendation/generate"
            footer={recommendationResult && <RecommendationCard recommendation={recommendationResult} />}
          >
            <form className="form-stack" onSubmit={handleRecommendationSave}>
              <Field label="User ID">
                <input type="number" value={recommendationForm.userId} onChange={(e) => setRecommendationForm({ ...recommendationForm, userId: e.target.value })} required />
              </Field>
              <Field label="Activity ID">
                <input type="number" value={recommendationForm.activityId} onChange={(e) => setRecommendationForm({ ...recommendationForm, activityId: e.target.value })} required />
              </Field>
              <Field label="Suggestions">
                <textarea rows="4" value={recommendationForm.suggestions} onChange={(e) => setRecommendationForm({ ...recommendationForm, suggestions: e.target.value })} />
              </Field>
              <Field label="Safety tips">
                <textarea rows="4" value={recommendationForm.safety} onChange={(e) => setRecommendationForm({ ...recommendationForm, safety: e.target.value })} />
              </Field>
              <Field label="Improvements">
                <textarea rows="4" value={recommendationForm.improvemenets} onChange={(e) => setRecommendationForm({ ...recommendationForm, improvemenets: e.target.value })} />
              </Field>
              <button type="submit">Generate Recommendation</button>
              {errors.recommendation && <p className="error-text">{errors.recommendation}</p>}
            </form>
          </Panel>

          <Panel
            title="Activity History"
            description="Loads /api/activities/users/{userId}"
            actions={<button className="secondary-button" type="button" onClick={() => loadActivities()}>Refresh</button>}
          >
            {errors.activities && <p className="error-text">{errors.activities}</p>}
            <ListSection
              empty="No activities loaded yet."
              items={activities}
              renderItem={(activity) => (
                <article className="list-item" key={activity.id}>
                  <div className="item-heading">
                    <strong>{activity.type}</strong>
                    <span className="item-meta">#{activity.id}</span>
                  </div>
                  <div className="item-meta">Duration: {activity.duration} mins</div>
                  <div className="item-meta">Calories: {activity.caloriesBurned}</div>
                  <div className="item-meta">Start: {formatDate(activity.startTime)}</div>
                </article>
              )}
            />
          </Panel>
        </section>

        <section className="grid-section">
          <Panel
            title="User Recommendations"
            description="Loads /api/recommendation/user/{userId}"
            actions={<button className="secondary-button" type="button" onClick={() => loadUserRecommendations()}>Load</button>}
          >
            {errors.userRecommendations && <p className="error-text">{errors.userRecommendations}</p>}
            <ListSection
              empty="No user recommendations loaded yet."
              items={userRecommendations}
              renderItem={(item) => <RecommendationCard key={item.id} recommendation={item} />}
            />
          </Panel>

          <Panel
            title="Activity Recommendations"
            description="Loads /api/recommendation/activity/{activityId}"
            actions={<button className="secondary-button" type="button" onClick={() => loadActivityRecommendations()}>Load</button>}
          >
            {errors.activityRecommendations && <p className="error-text">{errors.activityRecommendations}</p>}
            <ListSection
              empty="No activity recommendations loaded yet."
              items={activityRecommendations}
              renderItem={(item) => <RecommendationCard key={item.id} recommendation={item} />}
            />
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Panel({ title, description, actions, children, footer }) {
  return (
    <article className="card">
      <div className="card-heading split-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {actions}
      </div>
      {children}
      {footer}
    </article>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ResultCard({ title, meta }) {
  return (
    <div className="result-card">
      <strong>{title}</strong>
      {meta.map((line) => (
        <div key={line} className="item-meta">{line}</div>
      ))}
    </div>
  );
}

function RecommendationCard({ recommendation }) {
  return (
    <article className="list-item">
      <div className="item-heading">
        <strong>Recommendation #{recommendation.id}</strong>
        <span className="item-meta">{formatDate(recommendation.createdAt)}</span>
      </div>
      <TagRow title="Suggestions" items={recommendation.suggestions} />
      <TagRow title="Safety" items={recommendation.safety} />
      <TagRow title="Improvements" items={recommendation.improvemenets} />
    </article>
  );
}

function TagRow({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="tag-group">
      <div className="item-meta">{title}</div>
      <div className="tag-row">
        {items.map((item) => (
          <span className="tag" key={`${title}-${item}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function ListSection({ items, empty, renderItem }) {
  if (!items.length) {
    return <div className="empty-panel">{empty}</div>;
  }

  return <div className="list">{items.map(renderItem)}</div>;
}

function splitLines(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
