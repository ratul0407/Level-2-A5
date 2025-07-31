import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose
      .connect(envVars.DB_URL)
      .then(() => console.log("Connected to mongodb"))
      .catch((err) => console.log(err));

    server = app.listen(envVars.PORT, () => {
      console.log("Server listening at port", envVars.PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();
process.on("unhandledRejection", () => {
  console.log("unhandled rejection detected.... Server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected server shutting down... ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("SIGTERM signal received..... Server shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", (err) => {
  console.log("SIGTERM signal received..... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
