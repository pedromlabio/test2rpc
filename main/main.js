//https://games.roblox.com/v1/games/multiget-place-details?placeIds=
require('dotenv').config();
const { default: axios } = require('axios');
const RPC = require('discord-rpc');
const images = "https://test2rpcimages.vercel.app/";  //require("./images/images.json")
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
        if(inGame){inGame = false}
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
            let imageLink = `${images}/misc/MENU.png`;
            console.log(imageLink)
            data = {
                details: "Playing Test2",
                state: "In Menu",
                largeImageKey: imageLink,
                startTimestamp: start
            }
        }else{
            if(!inGame){start = new Date().getDate(); inGame = true}
            //user is inside of a world
            let placeData = await getPlaceData(placeId);
            let dataArray = placeData.split(":");
            let world = dataArray[0];
            let cellCode = dataArray[1].split(",");
            let worldCode = ("").concat(worldArray[0], worldArray[1]);
            console.log(world);
            console.log(cellCode);
            
            //begin cell checking
            if(cellCode[0] == 3 && cellCode[1] == 3){
                //user is in center
                data = {
                    details: `World: ${world}`,
                    state: "Cell: C",
                    largeImageKey: `${images}/worlds/world${worldCode}/C.png`,
                    startTimestamp: start
                }
            }else{
                //user is in a different cell, begin to process info
                let x = Number(cellCode[0]);
                let y = Number(cellCode[1]);
                let cellString = "";
                switch(y){
                    case 1:
                        //NN
                        cellString = cellString.concat("NN");
                        break;
                    case 2:
                        //N
                        cellString = cellString.concat("N");
                        break;
                    case 3:
                        //null
                        break;
                    case 4:
                        //S
                        cellString = cellString.concat("S");
                        break;
                    case 5:
                        //SS
                        cellString = cellString.concat("SS");
                        break;
                }
                switch(x){
                    case 1:
                        //WW
                        cellString = cellString.concat("WW");
                        break;
                    case 2:
                        //W
                        cellString = cellString.concat("W");
                        break;
                    case 3:
                        //null
                        break;
                    case 4:
                        cellString = cellString.concat("E");
                        break;
                    case 5:
                        cellString = cellString.concat("EE");
                        break;
                }
                let worldArray = world.split(".");
                let worldCode = ("").concat(worldArray[0], worldArray[1]);
                //let imageCode = ("").concat(cellString, worldCode);
                //let imageLink = images[imageCode];
                //let imageLink2 = imageCode.toLowerCase();
                //console.log(imageCode)
                console.log(imageLink)
                data = {
                    details: `World: ${world}`,
                    state: `Cell: ${cellString}`,
                    largeImageKey: `${images}/worlds/world${worldCode}/${cellCode}.png`,
                    startTimestamp: start
                }

            }

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
        //console.log(response.data);

        return response.data[0].name; 
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
    
    let data = {}
    let presenceType = Number(userPresence.userPresenceType)

    switch(presenceType){

        case 0:
            if(inGame){inGame = false}
            //user is offiline
            //console.log("caso 0")
            data = {
                details: "Not in game",
                state: "Offline",
                largeImageKey: "sam"
            }
            break;
        case 1:
            if(inGame){inGame = false}
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
