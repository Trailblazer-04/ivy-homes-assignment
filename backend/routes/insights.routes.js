import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import { requestAsUser } from "../services/authenticated-request.js";
import { sendError } from "../utils/upstream.js";

const router = Router();
router.use(requireSession);

router.get("/", async (request, response) => {
  try {
    const [listings, rentals, projects] = await Promise.all([
      requestAsUser(request, "/v1/listings?limit=1"),
      requestAsUser(request, "/v1/rentals?limit=1"),
      requestAsUser(request, "/v1/projects?limit=1"),
    ]);
    response.json({
      listings: listings.total,
      rentals: rentals.total,
      projects: projects.total,
      source: "live collection totals",
    });
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
