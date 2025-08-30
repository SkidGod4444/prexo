import { Session } from "@prexo/auth";
import { UserType } from "@prexo/types";

export type Variables = {
    "x-ingest-key": string;
    "session": Session;
    "user": UserType;
  };