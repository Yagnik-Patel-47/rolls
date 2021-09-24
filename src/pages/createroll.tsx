import { Typography, LinearProgress, Backdrop } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage, auth } from "../firebase";
import firebase from "../firebase";
import Head from "next/head";
import { useRouter } from "next/router";

const CreateRoll = () => {
  const [roll, setRoll] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = () => {
    setShowProgress(true);
    const id: string = uuidv4();
    const storageRef = storage.ref(id);
    storageRef.put(roll).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(Math.floor(percentage));
      },
      (e) => {
        console.log(e);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        db.collection("posts").doc(id).set({
          roll: url,
          userID: auth.currentUser?.uid,
          likes: [],
          comments: [],
        });
        db.collection("users")
          .doc(auth.currentUser?.uid)
          .set(
            {
              rolls: firebase.firestore.FieldValue.arrayUnion(id),
            },
            { merge: true }
          );
        setShowProgress(false);
        router.push("/");
      }
    );
  };

  return (
    <>
      <div className="flex bg-gray-800 h-full flex-col items-center p-6 space-y-8 text-white w-full">
        <Head>
          <title>Create Roll</title>
        </Head>
        <Typography variant="h6">Create Your Roll.</Typography>
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => {
            if (e.target?.files?.[0]) {
              setRoll(e.target.files[0]);
            } else {
              setRoll(null);
              setPreview(null);
            }
            const reader = new FileReader();
            reader.addEventListener("load", (e) => {
              setPreview(e.target?.result);
            });
            if (e.target?.files?.[0]) {
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
          className="bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        uppercase
        font-roboto
        space-x-6"
        />
        {preview && (
          <div className="h-96 w-52">
            <video
              style={{ objectFit: "fill", width: "100%", height: "100%" }}
              src={preview}
              muted
              autoPlay
              loop
            ></video>
          </div>
        )}
        {roll && (
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
        font-roboto"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
      {showProgress && (
        <Backdrop
          open={true}
          style={{ zIndex: 1000000000 }}
          className="text-white"
        >
          <div className="px-8 py-4 bg-gray-800 space-y-6 h-2/3 w-3/4 grid justify-center content-center">
            <Typography variant="h6">Posting Your Roll.</Typography>
            <LinearProgress
              variant="determinate"
              color="primary"
              value={progress}
            />
          </div>
        </Backdrop>
      )}
    </>
  );
};

export default CreateRoll;
