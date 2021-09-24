import { FC, useState, useEffect } from "react";
import { Typography, Avatar, Stack } from "@mui/material";
import { db } from "../firebase";
import { Roll } from "../utils/interfaces";

interface Props {
  rollData: Roll;
}

const LikesTab: FC<Props> = ({ rollData }: Props) => {
  return (
    <div className="h-full flex flex-col space-y-6">
      {rollData.likes.length === 0 && (
        <div className="h-full flex justify-center items-center">
          <Typography variant="h6">0 Likes!</Typography>
        </div>
      )}
      <div className="flex flex-col mt-4 hide-scrollbar overflow-y-scroll space-y-3">
        {rollData.likes.map((likedUserID) => (
          <LikedUser id={likedUserID} key={likedUserID} />
        ))}
      </div>
    </div>
  );
};

export default LikesTab;

const LikedUser: FC<{ id: string }> = ({ id }: { id: string }) => {
  const [likedUser, setLikedUser] = useState({
    name: "",
    photo: "",
    isLoading: true,
  });
  useEffect(() => {
    return function cleanUp() {
      setLikedUser({
        name: "",
        photo: "",
        isLoading: true,
      });
    };
  }, []);
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        setLikedUser({
          name: data.fullName,
          photo: data.photo,
          isLoading: false,
        });
      }
    });
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={likedUser.photo} alt="profile image" />
      <Typography>{likedUser.name}</Typography>
    </Stack>
  );
};
