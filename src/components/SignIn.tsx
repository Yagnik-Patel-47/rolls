import { Button } from "@mui/material";
import { FC, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import { useRouter } from "next/router";

const SignIn: FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  const signIn = () => {
    auth.signInWithPopup(googleProvider).then((data) => {
      db.collection("users").doc(data.user?.uid).set(
        {
          fullName: data.user?.displayName,
          photo: data.user?.photoURL,
          rolls: [],
          email: data.user?.email,
        },
        { merge: true }
      );
    });
  };

  return (
    <div className="grid place-items-center h-full p-4 bg-gray-800">
      <div className="p-4 sm:px-4 flex w-full flex-col items-center md:w-1/2 bg-gray-700 text-white">
        <Button onClick={signIn} variant="contained" color="primary">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
