import { checkUser } from "@/middleware/check.user";
import { Hono } from "hono";

const cntxt = new Hono();

cntxt.use(checkUser);

cntxt.post("/links/add", async (c) => {
    const { name, alias, status, projectId } = await c.req.json();
});

export default cntxt;
