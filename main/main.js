const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})

rpc.on("ready", () => {
    rpc.setActivity({



    })


    console.log("active");

})

rpc.login({
    clientId: "1016530131516391455"
})