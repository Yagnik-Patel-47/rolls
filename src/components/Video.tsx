import React, { FC, useRef, useEffect, useState, MouseEvent } from "react";
import {
  Avatar,
  ButtonBase,
  IconButton,
  Typography,
  Popover,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { auth, db, storage } from "../firebase";
import { Roll } from "../utils/interfaces";
import { useInView } from "react-intersection-observer";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "../utils/reduxHooks";
import { setModalState } from "../redux/modal";
import firebase from "../firebase";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickPopOver = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const deleteRoll = () => {
    db.collection("posts").doc(rollID).delete();
    storage.ref(rollID).delete();
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
      {rollData.roll && (
        <video
          width="100%"
          height="100%"
          loop
          ref={videoRef}
          onMouseDown={pauseVideo}
          onMouseUp={resumeVideo}
          onTouchStart={pauseVideo}
          onTouchEnd={resumeVideo}
          autoPlay={inView}
          style={{ objectFit: "cover" }}
          src={rollData.roll}
          playsInline
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
        ></video>
      )}
      <div className="flex flex-col p-2 space-y-2 absolute bottom-48 right-4">
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
        {rollData.userID === auth.currentUser?.uid && (
          <IconButton aria-describedby={id} onClick={handleClickPopOver}>
            <MoreVertIcon />
          </IconButton>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopOver}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          marginThreshold={24}
        >
          <Button
            style={{ outline: "none", color: "#fff" }}
            startIcon={<DeleteForeverIcon />}
            color="primary"
            variant="contained"
            onClick={deleteRoll}
          >
            Delete Post
          </Button>
        </Popover>
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
