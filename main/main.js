var world = true;
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})


async function setActivity() {
    //this is where the main code will run
    rpc.setActivity({
        

        if(world = true){
            details: "World: 1.1",
            state: "Cell: N",
            largeImageKey: "sam" 
        }
        

    })
    
}



rpc.on("ready", () => {
    setActivity();


    setInterval(() => {
        setActivity();
    }, 15e3);


    console.log("active");

})

rpc.login({
    clientId: "1016530131516391455"
})