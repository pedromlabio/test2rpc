require('dotenv').config();
const { default: axios } = require('axios');
var world = true;
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
})
const start = new Date().getTime();

async function getData(){
    const response = await axios.post('https://presence.roblox.com/v1/presence/users', {
        "userIds": [
          process.env.ROBLOX_USER_ID
        ]
      })
      .then(function (response){
        var userPresence = response
        //console.log(userPresence)
      })

    console.log(response.data)
    let data = {}



    return data;
}



async function setActivity(data) {
    //this is where the main code will run
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
