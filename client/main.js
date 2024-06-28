const socket = io();

socket.on("connect", () => {
    console.log("connected!", socket.id);
});

socket.on("disconnect", () => {
    console.log("disconnected!", socket.id);
});

socket.on("tokens_detected:app", (data) => {
    const eventList = document.getElementById("content");
    eventList.textContent = data.join(" ");
});
