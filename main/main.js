require('dotenv').config();
const { default: axios } = require('axios');
var world = true;
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})
const start = new Date().getTime();
var response;

async function getData(){
    response = await axios.post('https://presence.roblox.com/v1/presence/users', {
        "userIds": [
          process.env.ROBLOX_USER_ID
        ]
      })
    
    let userPresence = response.data.userPresences[0]
    console.log(userPresence.userPresenceType)
    
    let data = {}
    let presenceType = userPresence.userPresenceType

    switch(presenceType){

        case 0:
            //user is offiline
            data = {
                details: "Not in game",
                state: "Offline"

            }
        case 1:
            //user is on website
            data = {
                details: "Not in game",
                state: "Website"
            }

        case 2:
            //user is in game proceed with game checking



    }


    console.log(data)
    return data;
}



async function setActivity(data) {
    //this is where the main code will run
    //console.log(data)
    rpc.setActivity(data)
    
}



rpc.on("ready", () => {
    let data = getData();
    setActivity();


    setInterval(() => {
        let data = getData();
        setActivity(data);
    }, 5e3);


    console.log("active");

})

rpc.login({
    clientId: process.env.DISCORD_CLIENT_ID,
})
