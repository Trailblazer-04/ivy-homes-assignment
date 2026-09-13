import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import { requestAsUser } from "../services/authenticated-request.js";
import { sendError } from "../utils/upstream.js";

const router = Router();
router.use(requireSession);

router.get("/", async (request, response) => {
  try {
    response.json(await requestAsUser(request, "/v1/saved"));
  } catch (error) {
    sendError(response, error);
  }
});

router.post("/", async (request, response) => {
  try {
    response.json(
      await requestAsUser(request, "/v1/saved", {
        method: "POST",
        body: JSON.stringify(request.body),
      }),
    );
  } catch (error) {
    sendError(response, error);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    response.json(
      await requestAsUser(
        request,
        `/v1/saved/${encodeURIComponent(request.params.id)}`,
        { method: "DELETE" },
      ),
    );
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
