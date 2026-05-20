import net from "node:net";

const [host = "localhost", portArg = "5432", timeoutSecondsArg = "60"] =
  process.argv.slice(2);

const port = Number(portArg);
const timeoutMs = Number(timeoutSecondsArg) * 1000;
const startedAt = Date.now();

function tryConnect() {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });

    socket.setTimeout(2000);

    socket.once("connect", () => {
      socket.end();
      resolve();
    });

    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out."));
    });

    socket.once("error", (error) => {
      socket.destroy();
      reject(error);
    });
  });
}

while (Date.now() - startedAt < timeoutMs) {
  try {
    await tryConnect();
    console.log(`Port ${host}:${port} is reachable.`);
    process.exit(0);
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

console.error(`Timed out waiting for ${host}:${port} after ${timeoutSecondsArg} seconds.`);
process.exit(1);
