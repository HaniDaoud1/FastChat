"use client";

import Login from "./login/page";
import Chat from "./chat/chat";
 import { useDispatch,useSelector } from "react-redux";
 import { RootState } from "@/app/store/store"; // adapte le chemin selon ton arborescence
 import { useEffect } from "react";
import { setUser } from "./store/state";
const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);
        const user = useSelector((state: RootState) => state.user.userInfo);
  return (<>
 {user  ? <Chat /> : <Login />}

    </>
  );
};

export default Page;
