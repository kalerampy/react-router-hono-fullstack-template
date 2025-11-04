import { Hono } from "hono";
import { createRequestHandler } from "react-router";

const app = new Hono();


// Add more routes here
app.get("/api", async (c) =>  {
	const count = (await c.env.TEST_KV.get("count")) ?? "0";
	const next = c.req.query("name")

	await c.env.TEST_KV.put("count", next);

	return c.json({ previous: count, current: next });
	});


app.get("*", (c) => {
	const requestHandler = createRequestHandler(
		() => import("virtual:react-router/server-build"),
		import.meta.env.MODE,
	);

	return requestHandler(c.req.raw, {
		cloudflare: { env: c.env, ctx: c.executionCtx },
	});
});


export default app;
