import { NextPage } from "next";

export interface StyleProps {
  [key: string]: any;
}

export type MemberPage<Props> = NextPage<Props> & { isMember?: boolean };
export type AdminPage<Props> = NextPage<Props> & { isAdmin?: boolean };

export * from "./entities";
export * from "./stripe";
