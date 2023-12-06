import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import {
  ActionsPanelCode,
  TouchButton,
  Item,
  AddTouchButton,
  ActionPanelItem,
  FreeArea,
} from "../types/types";

const slice = createSlice({
  name: "panel",
  initialState: {
    actionsPanelCode: {} as ActionsPanelCode,
    freeArea: [] as FreeArea[],
  },
  reducers: {
    actionsPanelCodeAdd(state, action: PayloadAction<ActionsPanelCode>) {
      state.actionsPanelCode = action.payload;
    },
    setCode(state, action: PayloadAction<number>) {
      state.actionsPanelCode.code = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.actionsPanelCode.page = action.payload;
    },
    setContext(state, action: PayloadAction<number>) {
      state.actionsPanelCode.contextCode = action.payload;
    },
    setRowCount(state, action: PayloadAction<number>) {
      state.actionsPanelCode.rowCount = action.payload;
    },
    setColumnCount(state, action: PayloadAction<number>) {
      state.actionsPanelCode.columnCount = action.payload;
    },
    moveTouchButton(state, action: PayloadAction<TouchButton>) {
      const actionsPanelCode = current(state.actionsPanelCode);
      if (action.payload.item.stretch) {
        const item = actionsPanelCode.actionPanelItems.find(
          (item) =>
            item.column === action.payload.item.col &&
            item.row === action.payload.item.row
        );
        const delAction = actionsPanelCode.actionPanelItems.filter(
          (item) =>
            item.column !== action.payload.item.col ||
            item.row !== action.payload.item.row
        );
        if (item) {
          delAction.push({
            ...item,
            columnSpan: 1 + action.payload.col - item.column,
            rowSpan: 1 + action.payload.row - item.row,
          });
        }
        state.actionsPanelCode.actionPanelItems = delAction;
      } else {
        const item = actionsPanelCode.actionPanelItems.find(
          (item) =>
            item.column === action.payload.item.col &&
            item.row === action.payload.item.row
        );
        const delAction = actionsPanelCode.actionPanelItems.filter(
          (item) =>
            item.column !== action.payload.item.col ||
            item.row !== action.payload.item.row
        );

        if (item) {
          delAction.push({
            ...item,
            column: action.payload.col,
            row: action.payload.row,
          });
        }
        state.actionsPanelCode.actionPanelItems = delAction;
      }
    },
    deleteTouchButton(state, action: PayloadAction<Item>) {
      const actionsPanelCode = current(state.actionsPanelCode);
      const delAction = actionsPanelCode.actionPanelItems.filter(
        (item) =>
          item.column !== action.payload.col || item.row !== action.payload.row
      );
      state.actionsPanelCode.actionPanelItems = delAction;
    },
    clearActionsPanel(state) {
      state.actionsPanelCode.actionPanelItems = [] as ActionPanelItem[];
    },
    addTouchButton(state, action: PayloadAction<AddTouchButton>) {
      const actionsPanelCode = current(state.actionsPanelCode);

      if (state.freeArea.length === 0) return;

      const newTouchButton: ActionPanelItem = {
        code: actionsPanelCode.code,
        actionCode: action.payload.action,
        row: state.freeArea[0].row,
        column: state.freeArea[0].col,
        rowSpan: 1,
        columnSpan: 1,
        color: action.payload.color.slice(1),
        name: action.payload.name,
      };
      state.actionsPanelCode.actionPanelItems.push(newTouchButton);
    },
    getFreeArea(state, action: PayloadAction<ActionsPanelCode>) {
      const actionsPanelCode = current(state.actionsPanelCode);
      state.freeArea = [];
      const areaSpan = [] as FreeArea[];

      actionsPanelCode.actionPanelItems?.forEach((item) => {
        for (let i = 0; i < item.rowSpan; i++) {
          for (let j = 0; j < item.columnSpan; j++) {
            areaSpan.push({ col: item.column + j, row: item.row + i });
          }
        }
      });
      for (let i = 1; i <= actionsPanelCode.columnCount; i++) {
        for (let j = 1; j <= actionsPanelCode.rowCount; j++) {
          const find = areaSpan.find(
            (item) => item.col === i && item.row === j
          );
          if (!find) {
            state.freeArea.push({ col: i, row: j });
          }
        }
      }
    },
  },
});

export const actionsPosts = slice.actions;
export const sliceReducer = slice.reducer;
