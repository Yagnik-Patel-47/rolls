import { Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Link from "next/link";

const AppFooter = () => {
  return (
    <footer className="flex w-full justify-between text-white p-4 bottom-0 fixed z-10 items-center bg-blur">
      <Typography variant="h6">Rolls It</Typography>
      <div className="space-x-4">
        <Link href="/">
          <IconButton>
            <HomeOutlinedIcon />
          </IconButton>
        </Link>
        <Link href="/profile">
          <IconButton>
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Link>
      </div>
    </footer>
  );
};

export default AppFooter;
