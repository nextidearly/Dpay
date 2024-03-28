import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    booted: undefined,
    isUnlocked: false,
    keyrings: {},
    vault: {},
    preVault: {},
    account: {},
    balance: 0,
    bitcoinTx: {
      txId: "",
      toAddress: "",
      toSatoshis: "",
      autoAdjust: "",
      feeRate: "",
    },
    inscriptions: {
      total: 0,
      list: [],
    },
    ltc20: { total: 0, list: [] },
    price: 71,
    utxos: [],
  },
};

export const wallet = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    booted: (state, action) => {
      state.value.booted = action.payload;
    },
    isUnlocked: (state, action) => {
      state.value.isUnlocked = action.payload;
    },
    vault: (state, action) => {
      state.value.vault = action.payload;
    },
    preVault: (state, action) => {
      state.value.preVault = action.payload;
    },
    account: (state, action) => {
      state.value.account = action.payload;
    },
    balance: (state, action) => {
      state.value.balance = action.payload;
    },
    bitcoinTx: (state, action) => {
      state.value.bitcoinTx = action.payload;
    },
    setCurrentKeyRing: (state, action) => {
      state.value.keyrings = action.payload;
    },
    updateBitcoinTx: (state, action) => {
      state.value.bitcoinTx.txId = action.payload;
    },
    updateInscriptions: (state, action) => {
      state.value.inscriptions = action.payload;
    },
    updatePrice: (state, action) => {
      state.value.price = action.payload;
    },
    updateBalance: (state, action) => {
      state.value.inscriptions = action.payload.inscriptions;
      state.value.ltc20 = action.payload.ltc20;
    },
    updateBalance2: (state, action) => {
      state.value.balance = action.payload.balance;
    },
  },
});

export const {
  booted,
  isUnlocked,
  vault,
  preVault,
  account,
  balance,
  bitcoinTx,
  setCurrentKeyRing,
  updateBitcoinTx,
  updateInscriptions,
  updatePrice,
  updateBalance,
  updateBalance2,
} = wallet.actions;
export default wallet.reducer;
