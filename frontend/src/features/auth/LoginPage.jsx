import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client.js";
import { saveSession } from "../../shared/session.js";
import { Brand } from "../../components/Brand.jsx";
import {
  propertyCaptions,
  propertyImages,
} from "../../shared/propertyImages.js";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo1@ivy.homes");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const imageTimer = window.setInterval(() => {
      setImageIndex((currentIndex) => (currentIndex + 1) % propertyImages.length);
    }, 4800);

    return () => window.clearInterval(imageTimer);
  }, []);
  async function submit(event) {
    event.preventDefault();
    try {
      saveSession(
        await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }),
      );
      navigate("/");
    } catch (loginError) {
      setError(loginError.message);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Brand dark />
        <h1>
          Find the place
          <br />
          <em>that feels right.</em>
        </h1>
        <p className="muted">
          Browse verified homes, compare neighbourhoods, and keep your shortlist
          close.
        </p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary wide">
            Enter Ivy Homes <span>→</span>
          </button>
        </form>
      </div>
      <div className="auth-art">
        <div
          className="auth-art-image"
          key={propertyImages[imageIndex]}
          style={{ backgroundImage: `url(${propertyImages[imageIndex]})` }}
        />
        <div className="art-features" aria-live="polite">
          <span className="art-features-label">Ivy Homes / {String(imageIndex + 1).padStart(2, "0")}</span>
          <h3 key={propertyCaptions[imageIndex]}>{propertyCaptions[imageIndex]}</h3>
        </div>
        <div className="art-copy">
          <span>{String(imageIndex + 1).padStart(2, "0")} / 05</span>
          <h2>
            Space to live.
            <br />
            Room to grow.
          </h2>
        </div>
      </div>
    </div>
  );
}
