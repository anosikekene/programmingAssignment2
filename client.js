const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 5000, host: "localhost" }, () => {
  console.log("Connected to server");
  console.log("Enter exit to quit");
});

rl.on("line", (input) => {
  client.write(input);

  if (input.toLowerCase() === "exit") {
    client.end(); // Close the client connection
    return; // Exit the line handler
  }
});

client.on("data", (message) => {
  console.log(message.toString());
});

client.on("end", () => {
  rl.close();
});
