import React, { useCallback, useEffect, useMemo, useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { initNetworkFunc, idFromHexString } from '../utilities/NetworkHelper';

export const Web3Context = React.createContext();

const Web3ContextProvider = ({ children }) => {

  const initModal = new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {},
  });

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  // NOTE (appleseed): loading eth mainnet as default rpc provider for a non-connected wallet
  const [provider, setProvider] = useState();
  const [networkId, setNetworkId] = useState(1);
  const [networkName, setNetworkName] = useState("");
  const [providerUri, setProviderUri] = useState("");
  const [providerInitialized, setProviderInitialized] = useState(false);

  const [web3Modal, setWeb3Modal] = useState(initModal);

  const hasCachedProvider = () => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (_chainId) => {    // _chainId will be like 0x1
        const newChainId = idFromHexString(_chainId);
        const networkHash = await initNetworkFunc({ provider });
        // console.log("chain change: ", newChainId, networkHash.networkId);

        if (newChainId !== networkHash.networkId) {
          // then provider is out of sync, reload per metamask recommendation
          setTimeout(() => window.location.reload(), 1);
        } else {
          setNetworkId(networkHash.networkId);
        }
      });
    },
    [provider],
  );

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    let rawProvider = await web3Modal.connect();

    // new _initListeners implementation matches Web3Modal Docs
    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, "any");
    setProvider(connectedProvider);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    setAddress(connectedAddress);
    
    let networkHash = await initNetworkFunc({ provider: connectedProvider });
    setNetworkId(networkHash.networkId);
    setNetworkName(networkHash.networkName);
    setProviderUri(networkHash.uri);
    setProviderInitialized(networkHash.initialized);
    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, []);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      web3Modal,
      networkId,
      networkName,
      providerUri,
      providerInitialized,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      web3Modal,
      networkId,
      networkName,
      providerUri,
      providerInitialized,
    ],
  );

  return <Web3Context.Provider value={ onChainProvider }>{children}</Web3Context.Provider>;
};

export default Web3ContextProvider;