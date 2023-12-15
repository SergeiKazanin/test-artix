import { FC, useState } from "react";
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
}

const ButtonTouch: FC<ButtonProps> = ({ actionPanelItem, actions }) => {
  const { deleteTouchButton } = useActions();
  const { freeArea } = useAppSelector((store) => store.panel);
  const [displayButtons, setDisplayButtons] = useState("none");
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
        //border: isDragging ? 1 : "none",
        boxShadow: isDragging ? 3 : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        p: 2,
      }}
      gridColumn={
        actionPanelItem.columnSpan > 1
          ? `${actionPanelItem.column}/span ${actionPanelItem.columnSpan}`
          : actionPanelItem.column
      }
      gridRow={
        actionPanelItem.rowSpan > 1
          ? `${actionPanelItem.row}/span ${actionPanelItem.rowSpan}`
          : actionPanelItem.row
      }
      onMouseOver={() => setDisplayButtons((prev) => (prev = "box"))}
      onMouseOut={() => setDisplayButtons((prev) => (prev = "none"))}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        {
          actions.find(
            (action) => action.actionCode === actionPanelItem.actionCode
          )?.actionName
        }
      </Typography>
      <IconButton
        onClick={() => deleteTouchButton(item)}
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
      >
        <ZoomOutMapIcon sx={{ rotate: "45deg" }} />
      </IconButton>
      <StretchButton
        actionPanelItem={actionPanelItem}
        display={displayButtons}
      />
    </Box>
  );
};

export default ButtonTouch;
