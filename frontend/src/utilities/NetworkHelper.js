export const initNetworkFunc = async ({ provider }) => {
    try {
      let networkName;
      let uri;
      let supported = true;
      const id = await provider.getNetwork().then(network => network.chainId);
      // console.log("id:",id);
      switch (id) {
        case 3:
          networkName = "Ropsten Testnet";
          uri = process.env.REACT_APP_ROPSTEN_RPC;
          break;
        default:
          supported = false;
          networkName = "Unsupported Network";
          uri = "";
          break;
      }
  
      return {
        networkId: id,
        networkName: networkName,
        uri: uri,
        initialized: supported,
      };
    } catch (e) {
      // console.log(e);
      return {
        networkId: -1,
        networkName: "",
        uri: "",
        initialized: false,
      };
    }
};

export const idFromHexString = (hexString) => {
  return parseInt(hexString, 16);
};