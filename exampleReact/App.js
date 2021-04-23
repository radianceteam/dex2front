import freeton from "freeton";
import { signerKeys, TonClient } from "@tonclient/core";
import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {HelloContract} from "./HelloContract";
const _ = {
  checkExtensionAvailability() {
    if (window.freeton === undefined) {
      throw 'Extension not available.';
    }
  },
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
};

TonClient.useBinaryLibrary(libWeb);

TonClient.defaultConfig = {
    network: {
        endpoints: ['net.ton.dev'],
    },
};

const client = new TonClient({network: { server_address: 'net.ton.dev' }});

function App() {
  async function clickMe() {
/*
    Extension provider example
*/
      console.log("start")
    // _.checkExtensionAvailability();
    const provider = _.getProvider();
    const version = await provider.getVersion();
    const network = await provider.getNetwork();
    console.log("provider",version,"network",network)

/*
    Work with TonClient example
*/
      let keys = await client.crypto.generate_random_sign_keys()
      console.log("keys",keys)
      let x = (await client.client.version()).version
      console.log("varsion", x)
      const helloAcc = new Account(HelloContract, {
          signer: signerKeys({public: "1378d7ca1c30fc4260c9bd4b138ed57216681162cd053ccc491936570abc3334", secret: "075e7ba4d53a9e47584122558699c7b0ce6ec5f75e711e3b1e11e44e1fcb6334"}),
      });
      console.log("helloAcc", helloAcc)
      let addr = await helloAcc.getAddress()
      console.log("addr", addr)
      // let depRes = await helloAcc.deploy().then(res=>console.log("resres",res)).catch(e=>console.log("depError",e))
      // console.log("depRes", depRes)
      // const touchResponse = await helloAcc.run("touch", {})
      // console.log("touchResponse",touchResponse)
      const getTimestampResponse = await helloAcc.runLocal("getTimestamp", {});
      console.log("getTimestampOutput", Number.parseInt(getTimestampResponse.decoded.output.value0 ?? 0).toString());
/*
     query_collection example
*/
      let result = (await client.net.query_collection({
          collection: "accounts",
          filter: {
              id: {
                  eq: "0:6b37011ead6f807117d5588b8c05c1f77e9923869b5c2bd15eea1913cb8c2d2d",
              },
          },
          result: "balance",
      })).result;

      console.log(`Account 1 balance is ${parseInt(result[0].balance)}\n`);
}
  return (
      <div className="App">
        <button
            style={{
          "width": "500px",
          "height": "200px",
             }}
                onClick={()=>clickMe()}>
          click me
        </button>
      </div>
  );
}

export default App;

