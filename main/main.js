require('dotenv').config();

var world = true;
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})
const start = new Date().getTime();


async function setActivity(data) {
    //this is where the main code will run
    rpc.setActivity(data)
    
}



rpc.on("ready", () => {
    setActivity();


    setInterval(() => {
        let data;
        if(world == true){
            data = {
                details: "World: 1.1",
                state: "Cell: C",
                largeImageKey: "sam",
                startTimestamp: start
            }
        }else{
            data = {
                details: "In Menu",
                //state: "Cell: C",
                largeImageKey: "sam",
                startTimestamp: start
            }
        }


        setActivity(data);
    }, 5e3);


    console.log("active");

})

rpc.login({
    clientId: process.env.DISCORD_CLIENT_ID,
})
