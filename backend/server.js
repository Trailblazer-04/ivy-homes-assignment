import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(import.meta.env.PORT || 4000);
createApp().listen(port, () =>
  console.log(`Ivy Homes API running on http://localhost:${port}`),
);
