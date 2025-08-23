import { checkUser } from "@/middleware/check.user";
import { Hono } from "hono";

const cntxt = new Hono();

cntxt.use(checkUser);

export default cntxt;
