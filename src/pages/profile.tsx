import { FC } from "react";
import Head from "next/head";
import AppFooter from "../components/AppFooter";
import { Button, Avatar, Typography } from "@mui/material";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { initData } from "../redux/profile";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../utils/reduxHooks";

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((store) => store.profile);

  useEffect(() => {
    if (!profile.email) {
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            dispatch(initData(doc.data()));
          }
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Profile - Rolls It</title>
      </Head>
      <div className="flex bg-gray-800 h-full flex-col items-center p-6 space-y-8 text-white w-full">
        <Avatar
          style={{ width: 120, height: 120 }}
          src={profile.photo}
          alt="profile image"
        />
        <Typography variant="h6">{profile.fullName}</Typography>
        <div className="flex space-x-4 justify-around w-full">
          <Link href="/createroll">
            <button
              className="bg-blue-500
              hover:bg-blue-700
              text-white
              font-bold
              py-2
              px-4
              rounded
              focus:outline-none focus:shadow-outline
              uppercase
              font-roboto shadow-lg"
            >
              Post New Roll
            </button>
          </Link>
          <Button
            onClick={() => {
              auth.signOut();
            }}
            variant="contained"
            color="error"
          >
            Logout
          </Button>
        </div>
        <AppFooter />
      </div>
    </>
  );
};

export default ProfilePage;
