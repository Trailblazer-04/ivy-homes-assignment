import express from "express";
import cors from "cors";
import { requestUpstream, sendError } from "./utils/upstream.js";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import favouriteRoutes from "./routes/favourites.routes.js";
import insightRoutes from "./routes/insights.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/api/health", async (_request, response) => {
    try {
      response.json(await requestUpstream("/health"));
    } catch (error) {
      sendError(response, error);
    }
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/v1/saved", favouriteRoutes);
  app.use("/api/v1/insights", insightRoutes);
  app.use("/api/v1", propertyRoutes);
  return app;
}
