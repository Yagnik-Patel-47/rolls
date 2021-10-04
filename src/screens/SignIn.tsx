import { Button } from "@mui/material";
import { FC, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../utils/reduxHooks";
import { setUserInteracted } from "../redux/interacted";
import Head from "next/head";

const SignIn: FC = () => {
  const userInteracted = useAppSelector((store) => store.interacted);
  const dispatch = useAppDispatch();

  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  const signIn = () => {
    if (!userInteracted) {
      dispatch(setUserInteracted(true));
    }
    auth.signInWithPopup(googleProvider).then((data) => {
      db.collection("users")
        .doc(data.user?.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            db.collection("users").doc(data.user?.uid).set(
              {
                fullName: data.user?.displayName,
                photo: data.user?.photoURL,
                email: data.user?.email,
              },
              { merge: true }
            );
          }
        });
    });
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex justify-center items-center h-full p-4 bg-gray-800">
        <Button onClick={signIn} variant="contained" color="primary">
          Sign In
        </Button>
      </div>
    </>
  );
};

export default SignIn;
