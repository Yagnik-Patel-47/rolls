import Head from "next/head";
import { FC, useEffect } from "react";
import AppFooter from "../components/AppFooter";
import VideoContainer from "../components/VideoContainer";
import { initData } from "../redux/profile";
import { auth, db } from "../firebase";
import { initRolls } from "../redux/rolls";
import { useAppSelector, useAppDispatch } from "../utils/reduxHooks";
import { Button, Typography } from "@mui/material";
import { setUserInteracted } from "../redux/interacted";

const Home: FC = () => {
  const rolls = useAppSelector((store) => store.rolls);
  const userInteracted = useAppSelector((store) => store.interacted);

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {!userInteracted && (
        <div className="flex justify-center items-center h-full flex-col bg-gray-800 text-white space-y-4">
          <Typography variant="h6" align="center">
            Need your interaction to play audio on website.
          </Typography>
          <Button
            variant="contained"
            style={{ color: "white", background: "#1976d2" }}
            onClick={() => dispatch(setUserInteracted(true))}
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
