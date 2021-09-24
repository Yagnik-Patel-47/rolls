import { FC, useRef, useEffect, useState } from "react";
import { Avatar, ButtonBase, IconButton, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { db } from "../firebase";
import { Roll } from "../utils/interfaces";
import { useInView } from "react-intersection-observer";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "../utils/reduxHooks";
import { setModalState } from "../redux/modal";
import firebase from "../firebase";

interface Props {
  rollID: string;
}

const Video: FC<Props> = ({ rollID }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const dispatch = useAppDispatch();
  const profile = useAppSelector((store) => store.profile);

  const [rollData, setRollData] = useState<Roll>({
    roll: "",
    userID: "",
    likes: [],
    comments: [],
  });

  const [user, setUser] = useState<{
    name: string;
    photo: string;
  }>({
    name: "",
    photo: "",
  });

  // const videoOperations = () => {
  //   if (videoRef.current !== null && videoRef.current.paused) {
  //     videoRef.current.play();
  //   } else if (videoRef.current !== null && !videoRef.current.paused) {
  //     videoRef.current.pause();
  //   }
  // };

  const pauseVideo = () => {
    if (videoRef.current !== null) {
      videoRef.current.pause();
    }
  };

  const resumeVideo = () => {
    if (videoRef.current !== null) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    db.collection("posts")
      .doc(rollID)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let data: any = doc.data();
          setRollData(data);
        }
      });
  }, []);

  useEffect(() => {
    if (rollData.userID.length > 0) {
      db.collection("users")
        .doc(rollData.userID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let fullName: string = doc.data()?.fullName;
            let userPhoto: string = doc.data()?.photo;
            setUser({ name: fullName, photo: userPhoto });
          }
        });
    }
  }, [rollData.userID]);

  useEffect(() => {
    if (inView && videoRef.current !== null) {
      videoRef.current.play();
    } else if (!inView && videoRef.current !== null) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [inView]);

  const addToLiked = () => {
    db.collection("posts")
      .doc(rollID)
      .set(
        {
          likes: firebase.firestore.FieldValue.arrayUnion(profile.id),
        },
        { merge: true }
      );
  };

  const removeFromLiked = () => {
    db.collection("posts")
      .doc(rollID)
      .set(
        {
          likes: firebase.firestore.FieldValue.arrayRemove(profile.id),
        },
        { merge: true }
      );
  };

  return (
    <div
      className="flex w-full min-h-full bg-gray-800 relative"
      style={{ scrollSnapAlign: "start" }}
      ref={ref}
    >
      <video
        width="100%"
        height="100%"
        loop
        ref={videoRef}
        onMouseDown={pauseVideo}
        onMouseUp={resumeVideo}
        onTouchStart={pauseVideo}
        onTouchEnd={resumeVideo}
        autoPlay
        style={{ objectFit: "cover" }}
        src={rollData.roll}
        playsInline
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      ></video>
      <div className="flex flex-col p-2 space-y-2 absolute bottom-32 right-4">
        {rollData.likes.includes(profile.id) ? (
          <IconButton onClick={removeFromLiked}>
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={addToLiked}>
            <FavoriteBorderIcon />
          </IconButton>
        )}
        <ButtonBase
          style={{ color: "#fff" }}
          onClick={() => {
            dispatch(setModalState({ isOpen: true, tab: "likes" }));
          }}
        >
          {rollData.likes.length}
        </ButtonBase>
        <IconButton
          onClick={() => {
            dispatch(setModalState({ isOpen: true, tab: "comments" }));
          }}
        >
          <ChatOutlinedIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>
      <div className="flex px-6 absolute items-center space-x-4 text-white top-8">
        <Avatar alt="profile image" src={user.photo} />
        <Typography variant="subtitle1">{user.name}</Typography>
      </div>
      <Modal showModal={inView} rollData={rollData} rollID={rollID} />
    </div>
  );
};

export default Video;
