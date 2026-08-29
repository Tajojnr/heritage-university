import { COOKIE_NAME } from "@shared/const";
import { getAnalyticsDashboard, getAnalyticsWalkthrough, getGuidedDemoHandoff, recordGuidedDemoIntake, recordWalkthroughIntake } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

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
  analytics: router({
    /**
     * Production analytics are strictly available to authenticated administrators.
     */
    dashboard: adminProcedure.query(() => getAnalyticsDashboard()),
    /** The visual walkthrough is deliberately fixed and contains no institutional records. */
    walkthrough: publicProcedure.query(() => getAnalyticsWalkthrough()),
    /** Public entry point for the no-PII product walkthrough handoff. */
    recordGuidedDemoIntake: publicProcedure.mutation(() => recordGuidedDemoIntake()),
    /** Read only the non-personal receipt that makes a guided handoff visible in the destination walkthrough. */
    guidedHandoff: publicProcedure.input(z.object({ reference: z.string().min(8).max(40) })).query(({ input }) => getGuidedDemoHandoff(input.reference)),
    /** Records a labelled sample intake event so signed-in administrators can prove live persistence. */
    recordWalkthroughIntake: adminProcedure.mutation(() => recordWalkthroughIntake()),
  }),
});

export type AppRouter = typeof appRouter;
