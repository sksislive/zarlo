"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { hydrateAuth } from "../redux/slices/authSlice";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate auth from local storage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      store.dispatch(hydrateAuth(JSON.parse(userInfo)));
    } else {
      store.dispatch(hydrateAuth(null));
    }
  }, []);

  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      {children}
    </Provider>
  );
}
