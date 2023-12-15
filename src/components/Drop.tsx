import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Item, TouchButton } from "../types/types";
import { useDrop } from "react-dnd";
import { useActions } from "../hooks/actions";
import { ItemTypes } from "../types/const";
import { useAppSelector } from "../hooks/redux";

interface DropAreaProps {
  col: number;
  row: number;
}
export interface SpanArea {
  col: number;
  row: number;
}
const DropArea: FC<DropAreaProps> = ({ col, row }) => {
  const { moveTouchButton } = useActions();

  const CanDropArea = (touchButton: TouchButton): boolean => {
    if (touchButton.item.stretch) {
      const spanArea = [] as SpanArea[];
      for (let i = touchButton.item.col; i <= touchButton.col; i++) {
        for (let j = touchButton.item.row; j <= touchButton.row; j++) {
          spanArea.push({ col: i, row: j });
        }
      }

      const newFreeArea = [...touchButton.item.freeArea];
      for (let i = 0; i < touchButton.item.colSpan; i++) {
        for (let j = 0; j < touchButton.item.rowSpan; j++) {
          newFreeArea.push({
            col: touchButton.item.col + i,
            row: touchButton.item.row + j,
          });
        }
      }
      if (
        touchButton.col < touchButton.item.col ||
        touchButton.row < touchButton.item.row
      ) {
        return false;
      }
      //console.log(spanArea, newFreeArea);
      for (let i = 0; i < spanArea.length; i++) {
        const find = newFreeArea.find(
          (item) => item.col === spanArea[i].col && item.row === spanArea[i].row
        );
        if (!find) {
          return false;
        }
      }
      return true;
    } else {
      const newFreeArea = [...touchButton.item.freeArea];
      for (let i = 0; i < touchButton.item.colSpan; i++) {
        for (let j = 0; j < touchButton.item.rowSpan; j++) {
          newFreeArea.push({
            col: touchButton.item.col + i,
            row: touchButton.item.row + j,
          });
        }
      }
      for (let i = 0; i < touchButton.item.rowSpan; i++) {
        for (let j = 0; j < touchButton.item.colSpan; j++) {
          const find = newFreeArea.find(
            (item) => item.col === col + j && item.row === row + i
          );
          if (!find) {
            return false;
          }
        }
      }
      return true;
    }
  };

  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: ItemTypes.BUTTON,
      drop: (item: Item) => moveTouchButton({ col, row, item }),
      canDrop: (item: Item) => CanDropArea({ col, row, item }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        item: monitor.getItem(),
      }),
    }),
    [col, row]
  );

  let colorDrop = "";
  isOver && !canDrop && (colorDrop = "#D0021B"); //red
  !isOver && canDrop && (colorDrop = "#F8E71C"); //yellow
  isOver && canDrop && (colorDrop = "#7ED321"); //green
  return (
    <Box
      ref={drop}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "4px",
        background: colorDrop,
        zIndex: "2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
      gridColumn={col}
      gridRow={row}
    >
      <Typography
        variant="inherit"
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        {col === item?.col && row === item?.row ? "Начальная позиция" : ""}
      </Typography>
    </Box>
  );
};
interface FreeArea {
  col: number;
  row: number;
}
const Drop: FC = () => {
  const { actionsPanelCode } = useAppSelector((store) => store.panel);
  const mapDrop = [] as FreeArea[];
  for (let i = 1; i <= actionsPanelCode.columnCount; i++) {
    for (let j = 1; j <= actionsPanelCode.rowCount; j++) {
      mapDrop.push({ col: i, row: j });
    }
  }
  return (
    <>
      {mapDrop.map((item, i) => (
        <DropArea key={i} col={item.col} row={item.row} />
      ))}
    </>
  );
};

export default Drop;
