import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";
import { rateLimit } from "./rate-limit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // CORS with origin validation
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    // In development, allow the Manus sandbox origins and localhost
    const isAllowed =
      !origin ||
      ENV.allowedOrigins.includes(origin) ||
      (!ENV.isProduction && (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes(".manus.computer") ||
        origin.includes(".manus.im")
      ));

    if (isAllowed && origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Security headers
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    res.header("Referrer-Policy", "strict-origin-when-cross-origin");

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Rate limiting - prevent brute force and abuse
  app.use("/api/auth", rateLimit({ windowMs: 60_000, max: 20, message: "Too many auth requests" }));
  app.use("/api/trpc", rateLimit({ windowMs: 60_000, max: 200 }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Configurar timeout para evitar "Premature close"
  server.timeout = 120000; // 2 minutos
  server.keepAliveTimeout = 65000; // 65 segundos
  server.headersTimeout = 66000; // 66 segundos

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });

  // Tratamento de erros do servidor
  server.on('error', (error) => {
    console.error('[api] Server error:', error);
  });

  server.on('clientError', (err, socket) => {
    console.error('[api] Client error:', err);
    if (!socket.destroyed) {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    }
  });
}

startServer().catch(console.error);
