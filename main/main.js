require('dotenv').config();
const { default: axios } = require('axios');
var world = true;
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})
const start = new Date().getTime();
var response;

async function processPresence(robloxPresence){
    let data;
    console.log(robloxPresence)

}

async function getData(){
    response = await axios.post('https://presence.roblox.com/v1/presence/users', {
        "userIds": [
          process.env.ROBLOX_USER_ID
        ]
      })
    
    let userPresence = response.data.userPresences[0]
    //console.log(userPresence.userPresenceType)
    
    let data = {}
    let presenceType = Number(userPresence.userPresenceType)

    switch(presenceType){

        case 0:
            //user is offiline
            //console.log("caso 0")
            data = {
                details: "Not in game",
                state: "Offline",
                largeImageKey: "sam"
            }
            break;
        case 1:
            //user is on website
            //console.log("caso 1")
            data = {
                details: "Not in game",
                state: "Website",
                largeImageKey: "https://static.wikia.nocookie.net/projoot-testing/images/e/e6/Site-logo.png/revision/latest?cb=20210603012513",
            }
            break;
        case 2:
            //user is in game proceed with game checking
            data = await processPresence(userPresence)
            

            break;
    }


    //console.log(data)
    return data;
}



async function updatePresence(rpcData) {
    //this is where the main code will run
    //console.log(rpcData)
    rpc.setActivity(rpcData)
    
}



rpc.on("ready", async () => {
    let data = await getData();
    //console.log(data)
    updatePresence(data);


    setInterval(async () => {
        data = await getData();
        updatePresence(data);
    }, 5e3);


    console.log("active");

})

rpc.login({
    clientId: process.env.DISCORD_CLIENT_ID,
})
