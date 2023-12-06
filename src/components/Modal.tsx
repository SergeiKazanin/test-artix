import { FC, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  Typography,
  Drawer,
  Box,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { useGetActionsQuery } from "../store/api";
import { Actions } from "../types/types";
import { SketchPicker } from "react-color";
import { useActions } from "../hooks/actions";
import { useAppSelector } from "../hooks/redux";

interface ModalProps {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  createButton: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  setModalIsOpen,
  createButton = false,
}) => {
  const { addTouchButton } = useActions();
  const { freeArea } = useAppSelector((store) => store.panel);
  const [color, setColor] = useState("#e2e2e2");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [action, setAction] = useState<number>(0);
  const [name, setName] = useState<string>("");

  const {
    data: actions,
    isFetching: isFetchingActions,
    isError: isErrorActions,
  } = useGetActionsQuery("");
  let actionsLoaded = [] as Actions;
  if (!isFetchingActions && !isErrorActions && actions) {
    actionsLoaded = actions;
  }

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          opacity: "0.5",
          backgroundColor: "black",
          zIndex: "1200",
        }}
        display={isOpen ? "block" : "none"}
        onClick={() => setModalIsOpen(false)}
      ></Box>
      <Drawer
        sx={{
          width: "480px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "480px",
            boxSizing: "border-box",
            opacity: "1",
            zIndex: "1210",
          },
        }}
        variant="persistent"
        anchor="right"
        open={isOpen}
      >
        <Box sx={{ paddingTop: 5, px: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton onClick={() => setModalIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography
            sx={{ paddingBottom: 3 }}
            variant="h5"
            noWrap
            component="div"
          >
            {createButton ? "Создание клавиши" : "Редактирвоание клавиши"}
          </Typography>
          <TextField
            sx={{ paddingBottom: 3 }}
            size="small"
            label="Название"
            variant="outlined"
            fullWidth={true}
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
          <Autocomplete
            disablePortal
            id="context"
            options={actionsLoaded.map((action) => action.actionName)}
            fullWidth={true}
            value={
              actionsLoaded.find((item) => action === item?.actionCode)
                ?.actionName || null
            }
            onChange={(event: any, newValue: string | null) => {
              setAction(
                actionsLoaded.find((item) => newValue === item?.actionName)
                  ?.actionCode || 0
              );
            }}
            sx={{ paddingBottom: 3 }}
            renderInput={(params) => (
              <TextField {...params} label="Действие" size="small" />
            )}
          />
          <Box sx={{ paddingBottom: 3 }}>
            <Box
              sx={{
                backgroundColor: `${color}`,
                width: "220px",
                height: "40px",
                borderRadius: "4px",
                px: 2,
              }}
              onClick={() => setDisplayColorPicker((prev) => !prev)}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
                variant="body1"
                noWrap
                component="div"
              >
                Цвет
              </Typography>
            </Box>
          </Box>

          {displayColorPicker && (
            <SketchPicker
              color={color}
              onChange={(color) => setColor(color.hex)}
            />
          )}
          <Box sx={{ display: "flex", gap: 2, paddingTop: 7 }}>
            <Button
              onClick={() => addTouchButton({ action, name, color })}
              variant="contained"
              disabled={freeArea.length > 0 ? false : true}
            >
              Сохранить
            </Button>
            <Button onClick={() => setModalIsOpen(false)}>Отменить</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
export default Modal;
