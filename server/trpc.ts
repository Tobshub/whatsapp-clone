import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();

const tRouter = t.router;
const tProcedure = t.procedure;
const tError = TRPCError;
const tMerge = t.mergeRouters;

export { tRouter, tProcedure, tError, tMerge };
