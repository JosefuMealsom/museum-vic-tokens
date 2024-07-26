## Token digital engagement tool prototype

Prototype that reads tokens under a webcam and curates a list of content to inspire people to take action.

### Setup

Client:

```bash
cd client
npm install
```

Websocket Server:

```bash
cd websocket_server
npm install
```

Token detection:

Requires conda/mamba to be installed.

```bash
cd token_detector
mamba env create -f environment.yaml
```

### Running the application

Simply run `run.bat` to set up the application. Then you can navigate to http://localhost:5173 to show the client UI.
Messages are passed from the token detector to this application via the websocket server, that dynamically update
what tokens are detected by the reader and shows a QR code that contains that content.

Note: the website linked to the QR code is currently hard coded to https://museum-vic-tokens.pages.dev.

### Webcam setup

Images were trained with the tokens on a green background. When setting up the webcam, make sure that you use a green
material that fills the full frame of the camera, and also position it so that there will be no shadows over it from
the environment (this may trigger camera refocusing on certain cameras).

### Model training

Was trained using a combination of google collab, with annotating of the data done via Roboflow. The detection itself is
done via ultralytics.

TODO: provide links to the collab project and Roboflow links.

### Windows proxy issues

You may be issues with running this on the command line on windows computers if you are using a proxy.
You will need to define the PATH variable `HTTP_PROXY` and `HTTPS_PROXY` in your command line environment to
whatever proxy server you are using.
