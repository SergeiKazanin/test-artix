import { IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { FC, useEffect } from "react";
import { ActionPanelItem } from "../types/types";
import { DragPreviewImage, useDrag } from "react-dnd";
import { ItemTypes } from "../types/const";
import { arrowStretch } from "../assets/arrow-stretch";
import { useAppSelector } from "../hooks/redux";

interface StretchButtonProps {
  actionPanelItem: ActionPanelItem;
  display: string;
  setIsStretch: React.Dispatch<React.SetStateAction<boolean>>;
}

const StretchButton: FC<StretchButtonProps> = ({
  actionPanelItem,
  display,
  setIsStretch,
}) => {
  const { freeArea } = useAppSelector((store) => store.panel);
  let item = {
    col: actionPanelItem.column,
    row: actionPanelItem.row,
    stretch: true,
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
  useEffect(() => {
    isDragging && setIsStretch((prev) => (prev = true));

    return () => {
      setIsStretch((prev) => (prev = false));
    };
  }, [isDragging]);

  return (
    <>
      <DragPreviewImage connect={preview} src={arrowStretch} />
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          p: "5px",
          position: "absolute",
          bottom: "0px",
          right: "0px",
          display: display,
          cursor: "move",
        }}
        ref={drag}
      >
        <OpenInFullIcon sx={{ rotate: "90deg" }} />
      </IconButton>
    </>
  );
};

export default StretchButton;
