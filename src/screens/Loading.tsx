import { CircularProgress } from "@mui/material";
import Head from "next/head";

const Loading = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="h-full flex justify-center items-center bg-gray-800">
        <CircularProgress size={60} />
      </div>
    </>
  );
};

export default Loading;
