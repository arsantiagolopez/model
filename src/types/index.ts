import { NextPage } from "next";

export interface StyleProps {
  [key: string]: any;
}

export type AdminPage<Props> = NextPage<Props> & { isAdmin?: boolean };

export * from "./match";
export * from "./player";
export * from "./user";
