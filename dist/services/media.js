import { Hono } from "hono";
import { allMedia, uploadMedia } from "../controllers/media_controller";
const app = new Hono();
app.get("/all", allMedia);
app.post("/upload", uploadMedia);
export default app;
