import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import { requestAsUser } from "../services/authenticated-request.js";
import { sendError } from "../utils/upstream.js";

const router = Router();
router.use(requireSession);

function collectionRoute(path, upstreamPath) {
  router.get(path, async (request, response) => {
    try {
      response.json(
        await requestAsUser(
          request,
          `${upstreamPath}?${new URLSearchParams(request.query)}`,
        ),
      );
    } catch (error) {
      sendError(response, error);
    }
  });
}

collectionRoute("/listings", "/v1/listings");
collectionRoute("/rentals", "/v1/rentals");
collectionRoute("/projects", "/v1/projects");

router.get("/listings/:id", async (request, response) => {
  try {
    response.json(
      await requestAsUser(
        request,
        `/v1/listings/${encodeURIComponent(request.params.id)}`,
      ),
    );
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/listings/:id/similar", async (request, response) => {
  try {
    response.json(
      await requestAsUser(
        request,
        `/v1/listings/${encodeURIComponent(request.params.id)}/similar`,
      ),
    );
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/rentals/:id", async (request, response) => {
  try {
    response.json(
      await requestAsUser(
        request,
        `/v1/rentals/${encodeURIComponent(request.params.id)}`,
      ),
    );
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/projects/:id", async (request, response) => {
  try {
    response.json(
      await requestAsUser(
        request,
        `/v1/projects/${encodeURIComponent(request.params.id)}`,
      ),
    );
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
