# swift-client

Live demo: https://polco.github.io/swift-client/

## What is this project about ?
I often end up in a situation when I have a piece of information (usually a link) and I want to open it on another screen in front of me which is not mine. So I can only hope that the screen is connected to a device where someone I know is logged in to any kind of social platform (which i'm part of).

So this project solves that problem by letting you just open a webpage on both devices and scan a QR code / enter a session ID to start sharing data among devices.


## Technologies / Libraries

- **Network**:

The devices are connected in peer 2 peer mode thanks to **WebRTC**. The initial handshake between devices is done through **Websockets** on a (very small) signaling server: https://github.com/polco/swift-server.

- **Data management**:

I investigated Operational Transformation a few years ago, when i was wondering how Google handles collaborative text editing on Google doc. On this project, since I aim at a full live collaborative mode, I am using a library that implements **Conflict-free replicated data type**: https://github.com/dominictarr/crdt.

- **Web clients**:

The UI is build and updated with **React.js**. The client data / updates are managed with **MobX**. I made a custom system to bind the *CRDT* library with *MobX*.

There is a desktop and a mobile version, which share many components.

- **Languages**:

The code is written using **Typescript** in the strictest mode. The style is written with **Less**.

- **Continuous Integration & auto deployment**:

The project uses Circle CI to run automated tests (only Typescript and Less linting at the moment). To deploy, one just needs to push to the master branch. Circle CI will do the rest.

- **Hosting**:

The signaling server is a simple Node.js Heroku app. The clients are hosted by Github pages.


## Platform support

- desktop: I tested and it works on Chrome, Safari and Firefox in their latest versions. It should work on Edge too.
- mobile: Chrome for Android is working fine. It works on Mobile Safari (you need to have at least iOS 11 to have WebRTC support) but the QR code scanner didn't seem to start. And since I don't own an iPhone it is not easy to debug it :)


## Next

This idea is to provide a shared environnement between devices. I only implemented a quick chat functionality to allow transfering text. The next steps are:
- implementing actual file transfer. When possible, the client generates and transfer a small thumbnail of the file he puts on the shared environment. Then other devices can download the real file. (using https://github.com/nodeca/pica for thumbnails for example)
- gathering more information on links to display them differently: thumbnail, video player, title, description.. (using: https://github.com/itteco/iframely for example)
- the session will be displayed with different layouts: a chat, a list of objects (text / assets / links), a *Pinterest* like view, etc..
