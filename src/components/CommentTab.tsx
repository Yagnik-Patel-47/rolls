import { TextField, Button, Avatar, Typography } from "@mui/material";
import { FC, useState } from "react";
import { db, auth } from "../firebase";
import { Roll } from "../utils/interfaces";
import firebase from "../firebase";

interface Props {
  rollData: Roll;
  rollID: string;
}

const CommentTab: FC<Props> = ({ rollData, rollID }: Props) => {
  const [commentText, setCommentText] = useState<string>("");

  const postComment = () => {
    db.collection("posts")
      .doc(rollID)
      .set(
        {
          comments: firebase.firestore.FieldValue.arrayUnion({
            user: auth.currentUser?.uid,
            comment: commentText,
          }),
        },
        { merge: true }
      );

    setCommentText("");
  };

  return (
    <div className="flex flex-col space-y-6 mt-4 hide-scrollbar h-full overflow-y-scroll">
      <div className="flex justify-between items-center">
        <TextField
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          value={commentText}
          variant="filled"
          label="write comment..."
        />
        <Button onClick={postComment} color="inherit">
          Post
        </Button>
      </div>
      {rollData.comments.length === 0 && (
        <div className="flex h-full justify-center items-center">
          <Typography variant="h6">0 Comments!</Typography>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        {rollData.comments.map((comment, index) => (
          <UserComment
            comment={comment.comment}
            id={comment.user}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentTab;

interface UserCommentProps {
  id: string;
  comment: string;
}

const UserComment: FC<UserCommentProps> = ({
  id,
  comment,
}: UserCommentProps) => {
  const [commentedUser, setCommentedUser] = useState({
    name: "",
    photo: "",
  });
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        setCommentedUser({
          name: data.fullName,
          photo: data.photo,
        });
      }
    });
  return (
    <div className="flex space-x-2">
      <Avatar src={commentedUser.photo} alt="profile photo" />
      <Typography variant="subtitle1">
        <span className="font-medium mr-2">{commentedUser.name}</span>
        {comment}
      </Typography>
    </div>
  );
};
