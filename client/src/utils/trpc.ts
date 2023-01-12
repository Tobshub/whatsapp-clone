import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/server";

const trpc = createTRPCReact<AppRouter>();
export default trpc;
