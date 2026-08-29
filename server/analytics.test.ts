import { describe, expect, it } from "vitest";
import { createDemoAnalyticsDashboard, createGuidedDemoReference, getAnalyticsWalkthrough } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("administrator analytics dashboard", () => {
  it("provides a complete, internally consistent baseline before live records exist", () => {
    const dashboard = createDemoAnalyticsDashboard();

    expect(dashboard.source).toBe("demo");
    expect(dashboard.summary.applications).toBe(2184);
    expect(dashboard.admissionsFunnel[0]?.value).toBe(dashboard.summary.applications);
    expect(dashboard.admissionsFunnel.at(-1)?.value).toBe(dashboard.summary.enrolledStudents);
    expect(dashboard.admissionsTrend).toHaveLength(6);
    expect(dashboard.facultyDemand).toHaveLength(4);
    expect(dashboard.liveActivity.length).toBeGreaterThan(0);
    expect(dashboard.programmeDemand).toHaveLength(4);
  });

  it("keeps the public walkthrough fixed and non-sensitive", () => {
    const walkthrough = getAnalyticsWalkthrough();
    const serialized = JSON.stringify(walkthrough);

    expect(walkthrough.source).toBe("demo");
    expect(walkthrough.liveActivity.every(activity => activity.detail.includes("demonstration event"))).toBe(true);
    expect(serialized).not.toMatch(/Yasmin|2026-001|AD-\d|EN-\d/);
  });

  it("creates only a generic reference for a guided demonstration intake", () => {
    expect(createGuidedDemoReference(1_725_000_000_000)).toMatch(/^GUIDED-[A-Z0-9]+$/);
  });

  it("prevents anonymous visitors from reading the production analytics endpoint", async () => {
    const context = {
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } as TrpcContext;

    const caller = appRouter.createCaller(context);
    await expect(caller.analytics.dashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.analytics.recordWalkthroughIntake()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
