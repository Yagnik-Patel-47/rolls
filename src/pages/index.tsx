import Head from "next/head";
import { FC, useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import VideoContainer from "../components/VideoContainer";
import { initData } from "../redux/profile";
import { auth, db } from "../firebase";
import { initRolls } from "../redux/rolls";
import { useAppSelector, useAppDispatch } from "../utils/reduxHooks";
import { Button, Typography } from "@mui/material";

const Home: FC = () => {
  const rolls = useAppSelector((store) => store.rolls);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch(initData({ ...doc.data(), id: doc.id }));
        }
      });
    db.collection("posts")
      .get()
      .then((data) => {
        let docIDs: string[] = [];
        data.docs.forEach((doc) => {
          docIDs.unshift(doc.id);
        });
        dispatch(initRolls(docIDs));
      });
  }, []);

  return (
    <>
      <Head>
        <title>Rolls It</title>
      </Head>
      {!userInteracted && (
        <div className="flex justify-center items-center h-full flex-col bg-gray-800 text-white space-y-4">
          <Typography variant="h6" align="center">
            Need your interaction to play audio on website.
          </Typography>
          <Button
            variant="contained"
            style={{ color: "white", background: "#1976d2" }}
            onClick={() => setUserInteracted(true)}
          >
            Access Audio
          </Button>
        </div>
      )}
      {rolls && userInteracted && <VideoContainer />}
      <AppFooter />
    </>
  );
};

export default Home;
