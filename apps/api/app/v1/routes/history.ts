import { checkUser } from "@/checks/check.user";
import { Hono } from "hono";

const hist = new Hono();

hist.use(checkUser);

export default hist;