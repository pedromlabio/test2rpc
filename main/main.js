//https://games.roblox.com/v1/games/multiget-place-details?placeIds=
require('dotenv').config();
const { default: axios } = require('axios');
const RPC = require('discord-rpc');

const rpc = new RPC.Client({
    transport: "ipc"
})
var start;
var inGame = false;

async function processPresence(robloxPresence){
    let data;
    let universeId = robloxPresence.universeId
    //console.log(robloxPresence)
    if(universeId != 1250803741){
        //user is in different game
        data = {
            details: "In different game",
            state: "In Game",
            largeImageKey: "sam"
        }
    }else{
        //user is in test2 proceed with checkings
        //checking is the user is on the menu or inside a world
        let placeId = robloxPresence.placeId
        if(placeId == 3540051865){
            //user is in projoot menu
            if(!inGame){start = new Date().getDate(); inGame = true}
            data = {
                details: "Playing Test2",
                state: "In Menu",
                largeImageKey: "sam",
                startTimestamp: start
            }
        }else{
            //user is inside of a world
            let placeData = getPlaceData(placeId);
        }


    }


    return data
}


async function getPlaceData(id){

    try{
        const response = await axios.get(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${id}`,
        {
            headers: {
                cookie: `.ROBLOSECURITY=${process.env.ROBLOX_USER_TOKEN}`
            }
        }

        );
        console.log(response.data);

        return response.data; 
    } catch(error){
        console.error(error.response.data);
    }

    
}

async function getData(){
    const response = await axios.post('https://presence.roblox.com/v1/presence/users', {
        "userIds": [
          process.env.ROBLOX_USER_ID
        ]
      }, {
        headers: {
            cookie: `.ROBLOSECURITY=${process.env.ROBLOX_USER_TOKEN}`
        }
      })
      
    let userPresence = response.data.userPresences[0]
    //console.log(userPresence)
    // Eu to é chorando de rir aqui kkkkkkkkkkkk
    
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
