import { ReactNode } from "react";

// Todo: maybe delete this interface
export interface UserData {
    id: number;
    name: string;
    description: string;
    profilePicURL: string;
    mainSkill: string;
}

export interface LayoutProps {
  children: ReactNode;
  style?: any;
  justifyContent?: string;
}