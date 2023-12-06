import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ActionsPanelCode, Actions, Contexts } from "../types/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    saveActionsPanelCode: builder.mutation<ActionsPanelCode, ActionsPanelCode>({
      query: (ActionsPanelCode) => ({
        url: `/api/actions-panel/`,
        method: "PUT",
        body: ActionsPanelCode,
      }),
    }),

    getContexts: builder.query<Contexts, string>({
      query: () => `/api/contexts`,
    }),
    getActions: builder.query<Actions, string>({
      query: () => `/api/actions`,
    }),
    getActionsPanelCode: builder.query<ActionsPanelCode, string>({
      query: () => `/api/actions-panel/`,
    }),
  }),
});

export const {
  useGetActionsQuery,
  useGetContextsQuery,
  useGetActionsPanelCodeQuery,
  useSaveActionsPanelCodeMutation,
} = api;
