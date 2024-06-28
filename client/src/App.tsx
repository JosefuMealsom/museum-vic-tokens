import { useEffect, useState } from "react";
import SocketIoService from "./services/socket-io.service";
import ScannedTokenComponent from "./components/ScannedTokenComponent";
import { isEqual } from "underscore";
import QRCode from "qrcode";
import copyData from "./data/copy.json";

function App() {
  const [socketService, _] = useState(new SocketIoService("127.0.0.1", 5000));
  const [streamData, setStreamData] = useState<string[]>([]);
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [qrCodeUrl, setQRCodeUrl] = useState("");

  function renderCallToAction() {
    if (tokenList.length > 0) return null;

    return (
      <div className="flex w-full h-screen justify-center items-center">
        <p className="font-source-sans text-4xl font-bold">
          Place your tokens in the tray generate your actions
        </p>
      </div>
    );
  }

  function renderYourScannedTokens() {
    if (tokenList.length === 0) return null;

    return (
      <div className="flex justify-center flex-col items-center h-screen">
        <div className="mb-1">{renderQRCode()}</div>
        <h4 className="text-lg mb-10 font-bold font-source-sans">
          Scan me for your personal page!
        </h4>
        <h1 className="font-source-sans text-2xl font-bold mb-4">
          Your scanned tokens
        </h1>
        <div className="flex justify-center w-[60rem]">{renderTokenList()}</div>
      </div>
    );
  }

  function renderQRCode() {
    return <img className="w-96" src={qrCodeUrl} />;
  }

  function renderTokenList() {
    if (tokenList.length === 0) {
      return null;
    }

    return tokenList.map((token) => (
      <div key={token} className="w-1/4 mx-1">
        {<ScannedTokenComponent tokenId={token} />}
      </div>
    ));
  }

  // May be better to put this into a hook or something?
  // At the moment closure prevents the variable from updating
  // so can't do the comparison
  useEffect(() => {
    // Need to be careful with the react lifecycle here,
    // may run this logic more than once
    socketService.connect();

    // This will trigger a rerender each frame!
    // Should rerender the
    socketService.on("tokens_detected:app", (data) => setStreamData(data));
  }, []);

  useEffect(() => {
    const arraysEqual = isEqual(streamData.sort(), tokenList.sort());

    if (!arraysEqual) {
      setTokenList(streamData);
    }
  }, [streamData]);

  useEffect(() => {
    const updateQrCode = async () => {
      const url = new URL(`https://m-prototypes.pages.dev/`);

      const ids = [];
      for (const t of tokenList) {
        ids.push(copyData.find((item) => t === item.id)?.externalId);
      }

      url.searchParams.append("ids", ids.join(","));

      const qrCode = await QRCode.toDataURL(url.href, {
        errorCorrectionLevel: "H",
      });
      setQRCodeUrl(qrCode);
    };

    updateQrCode();
  }, [tokenList]);

  return (
    <div>
      {renderCallToAction()}
      {renderYourScannedTokens()}
    </div>
  );
}

export default App;
