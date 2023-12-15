import { FC, useEffect, useState } from "react";
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
}

const Modal: FC<ModalProps> = ({ isOpen, setModalIsOpen }) => {
  const { addTouchButton, editTouchButton } = useActions();
  const { freeArea, buttonEdit } = useAppSelector((store) => store.panel);
  const [color, setColor] = useState("#e2e2e2");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [action, setAction] = useState<number>(0);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setColor("#e2e2e2");
    setName("");
    setAction(0);
    if (buttonEdit.edit === true) {
      setName(buttonEdit.name);
      setAction(buttonEdit.actionCode);
      if (buttonEdit.color.length > 0) {
        setColor(`#${buttonEdit.color}`);
      }
    }
  }, [buttonEdit]);

  const {
    data: actions,
    isFetching: isFetchingActions,
    isError: isErrorActions,
  } = useGetActionsQuery("");
  let actionsLoaded = [] as Actions;
  if (!isFetchingActions && !isErrorActions && actions) {
    actionsLoaded = actions;
  }

  const options = actionsLoaded.map((option) => ({
    label: option.actionName,
    key: option.actionCode,
  }));
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
            {buttonEdit.edit ? "Редактирвоание клавиши" : "Создание клавиши"}
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
            options={options}
            fullWidth={true}
            getOptionKey={(option) => option.key}
            isOptionEqualToValue={(options, value) =>
              options.label === value.label
            }
            value={options.find((option) => option.key === action) || null}
            onChange={(
              event: any,
              newValue: { label: string; key: number } | null
            ) => {
              setAction(newValue?.key || 0);
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
              onClick={() =>
                buttonEdit.edit
                  ? editTouchButton({
                      action,
                      name,
                      color,
                      oldAction: buttonEdit.actionCode,
                    })
                  : addTouchButton({ action, name, color })
              }
              variant="contained"
              disabled={(freeArea.length > 0 ? false : true) || action === 0}
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
