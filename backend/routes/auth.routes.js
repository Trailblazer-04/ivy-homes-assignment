import { Router } from "express";
import { requestUpstream, sendError } from "../utils/upstream.js";
import {
  deleteSession,
  requireSession,
  saveSession,
} from "../middleware/session.middleware.js";
import { requestAsUser } from "../services/authenticated-request.js";

const router = Router();

router.post("/login", async (request, response) => {
  try {
    const result = await requestUpstream("/auth/login", {
      method: "POST",
      body: JSON.stringify(request.body),
    });
    saveSession({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: result.user,
    });
    response.json({
      token: result.access_token,
      user: result.user,
      expiresIn: result.expires_in,
    });
  } catch (error) {
    sendError(response, error);
  }
});

router.post("/logout", requireSession, async (request, response) => {
  try {
    await requestAsUser(request, "/auth/logout", { method: "POST" });
  } catch {
      
  }
  deleteSession(request.accessToken);
  response.status(204).end();
});

export default router;
