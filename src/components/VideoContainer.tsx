import { Typography } from "@mui/material";
import { useAppSelector } from "../utils/reduxHooks";
import Video from "./Video";

const VideoContainer = () => {
  const rolls = useAppSelector((store) => store.rolls);

  return (
    <div
      className="h-full flex flex-col overflow-scroll hide-scrollbar bg-gray-800"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {rolls.map((roll) => (
        <Video rollID={roll} key={roll} />
      ))}
      {rolls.length === 0 && (
        <div className="text-white h-full w-full flex justify-center items-center">
          <Typography variant="h6">No Rolls Now!!!</Typography>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
