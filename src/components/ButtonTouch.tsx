import { FC, useEffect, useState } from "react";
import { ActionPanelItem, Actions } from "../types/types";
import { Box, IconButton, Typography } from "@mui/material";
import { useDrag, DragPreviewImage } from "react-dnd";
import { ItemTypes } from "../types/const";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { useActions } from "../hooks/actions";
import { arrowDown } from "../assets/arrow-down";
import StretchButton from "./StretchButton";
import { useAppSelector } from "../hooks/redux";
interface ButtonProps {
  actionPanelItem: ActionPanelItem;
  actions: Actions;
  setModalIsOpen: (isOpen: boolean) => void;
}

const ButtonTouch: FC<ButtonProps> = ({
  actionPanelItem,
  actions,
  setModalIsOpen,
}) => {
  const { deleteTouchButton, setButtonEdit } = useActions();
  const { freeArea } = useAppSelector((store) => store.panel);
  const [displayButtons, setDisplayButtons] = useState("none");
  const [isStretch, setIsStretch] = useState(false);
  let item = {
    col: actionPanelItem.column,
    row: actionPanelItem.row,
    stretch: false,
    colSpan: actionPanelItem.columnSpan,
    rowSpan: actionPanelItem.rowSpan,
    freeArea: freeArea,
  };
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BUTTON,
      item: () => item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [item]
  );

  return (
    <Box
      sx={{
        zIndex: "10",
        width: "100%",
        height: "100%",
        borderRadius: "4px",
        background: `#${
          actionPanelItem.color.length > 0
            ? `${actionPanelItem.color}`
            : "e2e2e2"
        }`,
        display: isStretch || isDragging ? "none" : "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
        p: 2,
      }}
      gridColumn={
        isStretch
          ? actionPanelItem.column
          : actionPanelItem.columnSpan > 1
          ? `${actionPanelItem.column}/span ${actionPanelItem.columnSpan}`
          : actionPanelItem.column
      }
      gridRow={
        isStretch
          ? actionPanelItem.row
          : actionPanelItem.rowSpan > 1
          ? `${actionPanelItem.row}/span ${actionPanelItem.rowSpan}`
          : actionPanelItem.row
      }
      onMouseOver={() => setDisplayButtons((prev) => (prev = ""))}
      onMouseOut={() => setDisplayButtons((prev) => (prev = "none"))}
      onClick={() => {
        setModalIsOpen(true);
        setButtonEdit({ ...actionPanelItem, edit: true });
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        {actionPanelItem.name.length > 0
          ? actionPanelItem.name
          : actions.find(
              (action) => action.actionCode === actionPanelItem.actionCode
            )?.actionName}
      </Typography>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          deleteTouchButton(item);
        }}
        sx={{
          p: "5px",
          position: "absolute",
          bottom: "0px",
          left: "0px",
          display: displayButtons,
        }}
      >
        <DeleteIcon />
      </IconButton>

      <DragPreviewImage connect={preview} src={arrowDown} />
      <IconButton
        ref={drag}
        sx={{
          p: "5px",
          position: "absolute",
          top: "0px",
          left: "0px",
          cursor: "move",
          display: displayButtons,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ZoomOutMapIcon sx={{ rotate: "45deg" }} />
      </IconButton>
      <StretchButton
        actionPanelItem={actionPanelItem}
        display={displayButtons}
        setIsStretch={setIsStretch}
      />
    </Box>
  );
};

export default ButtonTouch;
