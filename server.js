const net = require("net");

const connectedUsers = [];
const connectedClients = [];
const messageHistory = [];
id = 0;
const groups = [
  { id: 1, name: "Group A", users: [] },
  { id: 2, name: "Group B", users: [] },
  { id: 3, name: "Group C", users: [] },
  { id: 4, name: "Group D", users: [] },
  { id: 5, name: "Group E", users: [] },
];

const tcpServer = net.createServer((socket) => {
  // when server recieves data
  console.log("A client just connected");
  socket.write("Enter username: ");
  socket.groups = [];
  socket.on("data", (clientData) => {
    data = clientData.toString();
    if (socket.username == null) {
      connectedUsers.push(data);
      connectedClients.push(socket);
      socket.username = data;
      console.log(`Welcome ${data}`);
      console.log(`Connected Users: ${connectedUsers}`);
      broadcast(`Welcome ${data}`);
      broadcast(`Connected Users: ${connectedUsers}`);

      groups.forEach((group) => {
        socket.write(`ID: ${group.id}, Name: ${group.name}\n`);
      });
      socket.write("Enter groups ID or name: ");
      if (messageHistory.length > 0) {
        socket.write("Last 2 messages:\n");
        messageHistory.slice(-2).forEach((message) => {
          socket.write(message + "\n");
        });
      }
    } else if (data.toLowerCase() == "exit") {
      index = connectedUsers.indexOf(socket.username);

      connectedUsers.splice(index, 1);
      console.log(`${socket.username} has disconnected`);
      broadcast(`${socket.username} has disconnected`);
      console.log(`Connected Users: ${connectedUsers}`);
      broadcast(`Connected Users: ${connectedUsers}`);
      socket.end();
    } //else if (socket.group == null) {
    //   const numbers = data
    //     .split(" ")
    //     .map((item) => (isNaN(item) ? item : Number(item)));
    //   socket.write(`Groups: ${numbers}\n`);
    //   socket.group = numbers;
    else if (socket.groups.length === 0) {
      // User joining groups
      const selectedGroups = data
        .split(" ")
        .map((item) => {
          // Find group by ID or name
          return groups.find(
            (group) =>
              group.id == item ||
              group.name.toLowerCase() === item.toLowerCase()
          );
        })
        .filter((group) => group); // Remove undefined groups

      selectedGroups.forEach((group) => {
        if (!group.users.includes(socket)) {
          group.users.push(socket);
          socket.groups.push(group);
        }
        const joinedGroupNames = selectedGroups
          .map((group) => group.name)
          .join(", ");
        socket.write(`You have joined: ${joinedGroupNames}\n`);
      });
    } else {
      // messages
      const currentTime = new Date().toLocaleString();
      const userGroups = socket.groups;
      broadcastMessage = `${id} ${socket.username} ${currentTime}: ${data}`;
      //broadcast(`${broadcastMessage}`);
      console.log(broadcastMessage);

      userGroups.forEach((group) => {
        if (group.users.includes(socket)) {
          broadcastToGroup(group, broadcastMessage);
        }
      });
      messageHistory.push(broadcastMessage);
      id++;
    }
  });
});

tcpServer.listen(5000, "localhost", () => {
  console.log("Listening on 5000");
});

function broadcast(message) {
  connectedClients.forEach((client) => {
    client.write(message + "\n");
  });
}
function broadcastToGroup(group, message) {
  group.users.forEach((userSocket) => {
    userSocket.write(message + "\n");
  });
}
