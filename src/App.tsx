import { useEffect, useMemo, useState } from "react";
import Modal from "./components/Modal";
import { ReactComponent as Logo } from "./assets/artix_logo.svg";
import { useActions } from "./hooks/actions";
import { useAppSelector } from "./hooks/redux";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  CssBaseline,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { grey } from "@mui/material/colors";
import {
  useGetActionsPanelCodeQuery,
  useGetActionsQuery,
  useGetContextsQuery,
  useSaveActionsPanelCodeMutation,
} from "./store/api";
import { Actions, Contexts } from "./types/types";
import Drop from "./components/Drop";
import ButtonTouch from "./components/ButtonTouch";
import { optionColumnCount, optionRowCount } from "./types/const";
import * as Yup from "yup";
import { Formik, Form, Field, FieldProps } from "formik";

function App() {
  const {
    actionsPanelCodeAdd,
    setContext,
    setRowCount,
    setColumnCount,
    getFreeArea,
    clearActionsPanel,
  } = useActions();
  const { actionsPanelCode, freeArea } = useAppSelector((store) => store.panel);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [createButton, setCreateButton] = useState(false);

  const { data: contexts } = useGetContextsQuery("");
  const {
    data: actionsPanelCodeLoad,
    isError,
    isFetching,
  } = useGetActionsPanelCodeQuery("");

  let contextsLoaded = [] as Contexts;
  if (contexts) {
    contextsLoaded = contexts;
  }

  useEffect(() => {
    if (actionsPanelCodeLoad) {
      actionsPanelCodeAdd(actionsPanelCodeLoad);
    }
  }, [actionsPanelCodeLoad]);

  useMemo(() => getFreeArea(actionsPanelCode), [actionsPanelCode]);

  const {
    data: actions,
    isFetching: isFetchingActions,
    isError: isErrorActions,
  } = useGetActionsQuery("");
  let actionsLoaded = [] as Actions;
  if (!isFetchingActions && !isErrorActions && actions) {
    actionsLoaded = actions;
  }
  const [SaveActionsPanelCode] = useSaveActionsPanelCodeMutation();
  if (!isError && !isFetching && actionsPanelCodeLoad) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        overflow={modalIsOpen ? "hidden" : ""}
        height={modalIsOpen ? "100vh" : "auto"}
      >
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                width: "100%",
              }}
            >
              <IconButton>
                <MenuIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Тестовое задание
              </Typography>
            </Box>
            <Logo />
          </Toolbar>
        </AppBar>
        <Modal
          isOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          createButton={createButton}
        />
        <Box
          sx={{
            marginTop: 8,
            width: "848px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{ paddingTop: 5, paddingBottom: 4 }}
            variant="h4"
            noWrap
            component="div"
          >
            Редактирование панели
          </Typography>
          <Typography
            sx={{ paddingBottom: 3 }}
            variant="h5"
            noWrap
            component="div"
          >
            Основные настройки
          </Typography>
          <Formik
            initialValues={{
              cod: actionsPanelCodeLoad.code.toString(),
              page: actionsPanelCodeLoad.page.toString(),
            }}
            validationSchema={Yup.object({
              cod: Yup.number().required().positive().integer(),
              page: Yup.number().required().positive().integer(),
            })}
            onSubmit={(values) => {
              const newActionsPanelCode = {
                ...actionsPanelCode,
                code: Number(values.cod),
                page: Number(values.page),
              };
              SaveActionsPanelCode(newActionsPanelCode);
            }}
          >
            {() => (
              <Form>
                <Field name="cod">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <TextField
                        sx={{ paddingBottom: 3, width: "200px" }}
                        id="outlined-basic"
                        {...field}
                        label="Код"
                        variant="outlined"
                        size="small"
                        error={meta.touched && meta.error ? true : false}
                      />
                    </div>
                  )}
                </Field>
                <Field name="page">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <TextField
                        sx={{ paddingBottom: 3, width: "416px" }}
                        id="outlined-basic"
                        {...field}
                        label="Страница"
                        variant="outlined"
                        size="small"
                        error={meta.touched && meta.error ? true : false}
                      />
                    </div>
                  )}
                </Field>

                <Autocomplete
                  disablePortal
                  id="context"
                  value={
                    contextsLoaded.find(
                      (item) =>
                        actionsPanelCode?.contextCode === item.contextCode
                    )?.contextName || null
                  }
                  onChange={(event: any, newValue: string | null) => {
                    setContext(
                      contextsLoaded.find(
                        (item) => newValue === item.contextName
                      )?.contextCode || 0
                    );
                  }}
                  options={contextsLoaded.map((context) => context.contextName)}
                  sx={{ width: "416px" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Контекст" size="small" />
                  )}
                />
                <Typography
                  sx={{ paddingTop: 4, paddingBottom: 3 }}
                  variant="h5"
                  noWrap
                  component="div"
                >
                  Настройка панели
                </Typography>
                <Box sx={{ display: "flex", gap: 2, paddingBottom: 3 }}>
                  <Autocomplete
                    disablePortal
                    id="context"
                    options={optionRowCount}
                    value={actionsPanelCode?.rowCount?.toString() || null}
                    onChange={(event: any, newValue: string | null) => {
                      setRowCount(Number(newValue) || 1);
                    }}
                    sx={{ width: "200px" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Количество строк"
                        size="small"
                      />
                    )}
                  />
                  <Autocomplete
                    disablePortal
                    id="context"
                    options={optionColumnCount}
                    value={actionsPanelCode?.columnCount?.toString() || null}
                    onChange={(event: any, newValue: string | null) => {
                      setColumnCount(Number(newValue) || 1);
                    }}
                    sx={{ width: "200px" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Количество столбцов"
                        size="small"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => {
                      setModalIsOpen((prev) => (prev = true));
                      setCreateButton((prev) => (prev = true));
                    }}
                    variant="contained"
                    color="secondary"
                    disabled={freeArea.length > 0 ? false : true}
                  >
                    Добавить клавишу
                  </Button>
                  <Button
                    onClick={() => clearActionsPanel()}
                    variant="contained"
                    color="secondary"
                  >
                    Очистить панель
                  </Button>
                </Box>
                <Box sx={{ paddingTop: 2, paddingBottom: 7 }}>
                  <Box
                    sx={{
                      height: "427px",
                      padding: 2,
                      borderRadius: "4px",
                      borderColor: grey[400],
                      borderStyle: "solid",
                      borderWidth: "1px",
                      display: "grid",
                      gridTemplateColumns: `repeat(${actionsPanelCode?.columnCount}, 1fr)`,
                      gridTemplateRows: `repeat(${actionsPanelCode?.rowCount}, 1fr)`,
                      gap: 2,
                    }}
                  >
                    {actionsPanelCode.actionPanelItems?.map((item, i) => (
                      <ButtonTouch
                        key={
                          item.code * item.actionCode + item.column * item.row
                        }
                        actionPanelItem={item}
                        actions={actionsLoaded}
                      />
                    ))}
                    <Drop />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, paddingBottom: 5 }}>
                  <Button variant="contained" type="submit">
                    Сохранить
                  </Button>
                  <Button>Отменить</Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    );
  } else {
    return <></>;
  }
}

export default App;
