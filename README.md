# Status Seekers

This is an initial proof of concept for interacting with a very simple set of smart contracts as you explore an upcoming artwork by the Truebit team and an amazing artist named Jessica Angel.

The basic idea is to create a number of smaller installations - quite literally just QR codes - that people will need to find by exploring the much bigger piece being created by Angel et al. The whole idea is to bring into the physical world a tactile, interactive space which represents the radical shift now underway in the way we organize through decentralized networks incentivized by tokens. If we can get people to explore that space with deep attention to it's minute details, that will be a great success. We need better and bigger metaphors if we are to form properly the sorts of intentions that will make networks like Ethereum truly world-changing.

Moreover, we think that being able to illustrate that all it takes in order to interact with and benefit from using thse networks is a piece of technology that already exists in your pocket and with which a growing majority of the world is already familiar, then that will be the cherry on top.

As always, this is about The State of Us.

## Instructions

Easiest setup ever!

First of all, make sure you have Status installed. The latest android builds can be found [here](http://artifacts.status.im:8081/artifactory/nightlies-local/). If you require an iOS TestFlight invite, please join our [chat](https://chat.status.im/) and ping me @cryptowanderer and I will add you to our list of testers.

Once installed, open the chat with `Console` and select the `@browse` suggestion just above the keyboard input. Naviagte to `https://andytudhope.github.io/StatusSeekers/` and play to your heart's content. 

We have not yet implemented the NFT collectible part yet, and are looking for help with rendering images in the frontend, on resource-restricted devices using js. There are essentially 2 approaches we can take, depending one ase and performance. 

1. Use [processingjs](http://processingjs.org/) to render the images on the frontend. Each new level corresponds to a new dimension or attribute to the virtual creature being created as you wonder through the physical structure. 

2. Use the seed drawn by the user that is used to construct the first 40 bits of the tokenID, and then put that through a program like DeepDream 12 times with certain features turned on/off depending on the info returned from the new tokenLevel. 

### Getting Set Up Locally

Once installed, open the chat with `Console` and select the `/debug` suggestion just above the keyboard input. Turn debugging on.

You will also need to make sure you have `status-dev-cli` installed, which you can clone from [here](https://github.com/status-im/status-dev-cli) and that you have either `testrpc` or `Ganache` installed. I happen to be using Ganache right now to illustrate more visually to my friends what is going on. You can get it [here](https://github.com/trufflesuite/ganache/releases).

Run `status-dev-cli scan` to ensure that the cli tool can talk to your device/emulator. It should return the device's IP address, which we'll need later.

Start Ganache once all of that is done (or `testrpc`, or just `truffle develop` depending on your preference).

Clone this repo and do the necessary node things: 

```
git clone https://github.com/andytudhope/StatusSeekers.git && cd StatusSeekers/
npm install
```

Make sure that the rpc port listed in `truffle.js` is pointing to the correct place. Currently it is set up to talk to port `7545` because that is where Ganache is listening. Change it if you need to.

```
truffle compile
truffle migrate
```

Now, we need to make sure that Status is listening to the network onto which we have just deployed our contract with the `migrate` command. If you're using an Android phone like me, you'll also require some `adb` magic. If you're on iOS or in an emulator, you can skip the last two steps below:

```
status-dev-cli switch-node "http://localhost:7545" --ip <DEVICE-IP>
adb reverse tcp:7545 tcp:7545
// The next line is required because this example is set up to serve the web frontend on port 3000
adb reverse tcp:3000 tcp:3000
```

We're finally ready to run the actual app and have it talk to our simple smart contract so that we can start seeking the words required to unlock the reward! Make sure that you pass in your device's IP as an environment variable, otherwise the start script will fail.

```
IP=<DEVICE-IP> npm run start
```

Happy hunting!

## Sketch of The Seeker Game

Step 1: Show up at the event and download Status.
Step 2: Draw a seed and take a photo of it using the Status Seekers DApp.
(Step 2a: This gets submitted to our NonFungibleCollectible contract and is used to set the first 40bits of your unique token)
Step 3: Explore and interact with the #ArtProject structure (a klein bottle!)
Step 4: Find QR codes hidden around it.
Step 5: Scan the codes you find
(Step 5a: First thing that happens is that you get a keyWord back directly from the StatusSeekers contract. Collect all 12 and you can use them to reconstruct a private key and get access to our reward account. Hints to the order are also in the structure.
Step 5b: Scanning the QR will also send a message to our server, where we handle off-chain signing and verification, as well a the gas costs involved there. Using this setup, we can return to the user the next "level" of their collectible and use the information contained in tht level to render another attribute/dimension.)
Step 6: Gaze in wonder at your 12-dimensional crypto-creature-creation after having a mind-blowing experience exploring the interwoven klein bottle bridge mapping Dogethereum transactions. Yes that is a valid sentence. What a time to be alive...


You'll notice that the StatusSeekers contract is fully reusable. Essentially the idea there is that the owner can add any 12 keyWords they like. We can then add the rewardKeyWords, which are hashed (with a 256-bit nonce), in the correct order and - when someone thinks they have the right order, they can submit it for verification to the contract. The #ArtProject is about a really cool bridge, sure, but the vision is definitely longer term and revolves around setting up a whole decentralized artistic community and we want to play this game all over the world, in all kinds of structures!

Please take a look through our unit tests for the NonFungibleCollectible contract and let us know what you think. We are also very keen to hear ideas about the best way to actually render images on the frontend in a slick and nevertheless artistic way.



