import { Drawer, IconButton, Tabs, Tab } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../utils/reduxHooks";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { setModalState } from "../redux/modal";
import { BaseSyntheticEvent, FC } from "react";
import { Roll } from "../utils/interfaces";
import CommentTab from "../components/CommentTab";
import LikesTab from "./LikesTab";

interface Props {
  rollData: Roll;
  rollID: string;
  showModal: boolean;
}

const Modal: FC<Props> = ({ rollData, rollID, showModal }: Props) => {
  const modalState = useAppSelector((store) => store.modalState);
  const dispatch = useAppDispatch();

  const tabChange = (e: BaseSyntheticEvent, newValue: "likes" | "comments") => {
    dispatch(setModalState({ isOpen: true, tab: newValue }));
  };

  return (
    <Drawer
      variant="persistent"
      open={modalState.isOpen}
      anchor="bottom"
      classes={{ paper: "drawer-styles" }}
      hidden={!showModal}
    >
      <div className="flex justify-between items-center">
        <Tabs value={modalState.tab} aria-label="tabs" onChange={tabChange}>
          <Tab value="likes" label="Likes" />
          <Tab value="comments" label="Comments" />
        </Tabs>
        <IconButton
          onClick={() => {
            dispatch(setModalState({ isOpen: false, tab: modalState.tab }));
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </div>
      <TabPanel value={modalState.tab} tabName="likes">
        <LikesTab rollData={rollData} />
      </TabPanel>
      <TabPanel value={modalState.tab} tabName="comments">
        <CommentTab rollID={rollID} rollData={rollData} />
      </TabPanel>
    </Drawer>
  );
};

export default Modal;

// Extra Esential Component

interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string;
  value: string;
}

const TabPanel: FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, tabName, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== tabName}
      id={`tabpanel-${tabName}`}
      aria-labelledby={`tab-${tabName}`}
      {...other}
    >
      {value === tabName && <>{children}</>}
    </div>
  );
};
