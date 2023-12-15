export interface ActionsPanelCode {
  code: number;
  contextCode: number;
  page: number;
  rowCount: number;
  columnCount: number;
  actionPanelItems: ActionPanelItem[];
}

export interface ActionPanelItem {
  code: number;
  actionCode: number;
  row: number;
  column: number;
  rowSpan: number;
  columnSpan: number;
  color: string;
  name: string;
}
export interface ActionPanelItemEdit extends ActionPanelItem {
  edit: boolean;
}

export type Actions = Action[];

export interface Action {
  actionCode: number;
  actionName: string;
}

export type Contexts = Context[];

export interface Context {
  contextCode: number;
  contextName: string;
}

export interface TouchButton {
  item: Item;
  col: number;
  row: number;
}
export interface Item {
  col: number;
  row: number;
  stretch: boolean;
  colSpan: number;
  rowSpan: number;
  freeArea: FreeArea[];
}
export interface FreeArea {
  col: number;
  row: number;
}

export interface AddTouchButton {
  action: number;
  name: string;
  color: string;
}
export interface AddTouchButtonEdit extends AddTouchButton {
  oldAction: number;
}
