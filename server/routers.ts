import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createUploadSignature, deleteCloudinaryAsset } from "./cloudinary";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  cloudinary: router({
    signature: protectedProcedure.input(z.object({ folder: z.string().optional() })).query(({ input }) => createUploadSignature(input.folder)),
    deleteAsset: protectedProcedure.input(z.object({ publicId: z.string().min(1), resourceType: z.enum(["image", "video"]).default("image") })).mutation(async ({ input }) => { await deleteCloudinaryAsset(input.publicId, input.resourceType); return { success: true } as const; }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
