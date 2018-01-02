# Status Seekers

This is an initial proof of concept for interacting with a very simple set of smart contracts as you explore an upcoming artwork by the Truebit team and an amazing artist named Jessica Angel.

The basic idea is to create a number of smaller installations - quite literally just QR codes - that people will need to find by exploring the much bigger piece being created by Angel et al. The whole idea is to bring into the physical world a tactile, interactive space which represents the radical shift now underway in the way we organize through decentralized networks incentivized by tokens. If we can get people to explore that space with deep attention to it's minute details, that will be a great success. We need better and bigger metaphors if we are to form properly the sorts of intentions that will make networks like Ethereum truly world-changing.

Moreover, we think that being able to illustrate that all it takes in order to interact with and benefit from using thse networks is a piece of technology that already exists in your pocket and with which a growing majority of the world is already familiar, then that will be the cherry on top.

As always, this is about The State of Us.

## Instructions

Easiest setup ever!

First of all, make sure you have Status installed. The latest android builds can be found [here](http://artifacts.status.im:8081/artifactory/nightlies-local/). If you require an iOS TestFlight invite, please join our [chat](https://chat.status.im/) and ping me @cryptowanderer and I will add you to our list of testers.

Once installed, open the chat with `Console` and select the `@browse` suggestion just above the keyboard input. Naviagte to `https://andytudhope.github.io/StatusSeekers/` and play to your heart's content.

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

You may look at the 'smart' contract and think, "No way! That's too simple-minded to ever work. All someone would need to do is figure out the address you had deployed the contract at and inspect it for themselves to figure out the words and swipe the reward before the game ever began."

Well, we can be cleverer than that. The 12 words are not necessarily stored in order in the smart contract (and we will only verify the source once the #ArtProject has begun), so we actually have `12!` 'hiding places' to put the reward. The only hints given to the actual order will be incorporated in the physical piece. 

Then, I plan on writing a simple bot that accepts 12 word long strings and either returns `No`, or the `password` required to unlock the Status account with the reward in it (for obvious reasons this code might have to stay private until after the #ArtProject has begun). Keep it simple; keep it fun!

Next up, we will also need to implement a basic DB so as to maintain app state for users as they run around the art work trying to find all the QR codes. In addition to that, I want to make sure that each time someone finds and scans a QR (which results to a `call()` to a smart contract on Ethereum) that some funky and cool lights show/sound/movement happens. To be worked on, hopefully quite closely with @Shrugs.

