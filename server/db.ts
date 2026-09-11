import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { admissionApplications, enrollmentRecords, guidedDemoIntakes, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type AnalyticsDashboard = {
  source: "demo" | "live";
  refreshedAt: Date;
  summary: {
    applications: number;
    submittedApplications: number;
    offersIssued: number;
    enrolledStudents: number;
    enrolmentConversion: number;
    applicationChange: number;
  };
  admissionsTrend: Array<{ month: string; applications: number; offers: number }>;
  admissionsFunnel: Array<{ label: string; value: number; accent: "teal" | "ink" | "ochre" | "blue" }>;
  facultyDemand: Array<{ faculty: string; applications: number; capacity: number; fillRate: number }>;
  programmeDemand: Array<{ programme: string; faculty: string; applications: number; capacity: number; fillRate: number }>;
  enrollmentByLevel: Array<{ level: string; students: number; color: string }>;
  liveActivity: Array<{ id: string; label: string; detail: string; time: string; tone: "teal" | "ochre" | "blue" }>;
};

/**
 * A stable initial dashboard keeps the experience useful before staff load the
 * platform with institutional records. It is never written to the database.
 */
export function createDemoAnalyticsDashboard(): AnalyticsDashboard {
  return {
    source: "demo",
    refreshedAt: new Date(),
    summary: {
      applications: 2184,
      submittedApplications: 1736,
      offersIssued: 642,
      enrolledStudents: 386,
      enrolmentConversion: 60.1,
      applicationChange: 12.8,
    },
    admissionsTrend: [
      { month: "Mar", applications: 168, offers: 0 },
      { month: "Apr", applications: 236, offers: 0 },
      { month: "May", applications: 344, offers: 24 },
      { month: "Jun", applications: 411, offers: 108 },
      { month: "Jul", applications: 492, offers: 215 },
      { month: "Aug", applications: 533, offers: 295 },
    ],
    admissionsFunnel: [
      { label: "Started", value: 2184, accent: "teal" },
      { label: "Submitted", value: 1736, accent: "ink" },
      { label: "Under review", value: 828, accent: "blue" },
      { label: "Offers issued", value: 642, accent: "ochre" },
      { label: "Enrolled", value: 386, accent: "teal" },
    ],
    facultyDemand: [
      { faculty: "Computing & Natural Sciences", applications: 714, capacity: 260, fillRate: 94 },
      { faculty: "Engineering & Built Environment", applications: 563, capacity: 220, fillRate: 86 },
      { faculty: "Management & Public Leadership", applications: 487, capacity: 210, fillRate: 78 },
      { faculty: "Humanities & Social Innovation", applications: 420, capacity: 180, fillRate: 73 },
    ],
    programmeDemand: [
      { programme: "Computer Science", faculty: "Computing & Natural Sciences", applications: 246, capacity: 100, fillRate: 97 },
      { programme: "Architecture", faculty: "Engineering & Built Environment", applications: 182, capacity: 72, fillRate: 92 },
      { programme: "Business Administration", faculty: "Management & Public Leadership", applications: 168, capacity: 80, fillRate: 81 },
      { programme: "Economics", faculty: "Humanities & Social Innovation", applications: 149, capacity: 62, fillRate: 76 },
    ],
    enrollmentByLevel: [
      { level: "100", students: 386, color: "#136c68" },
      { level: "200", students: 3912, color: "#5f9f95" },
      { level: "300", students: 3628, color: "#9bc7ba" },
      { level: "400", students: 2916, color: "#d3a64d" },
    ],
    liveActivity: [
      { id: "Intake update", label: "A new application reached review", detail: "Computing programme · demonstration event", time: "2 min ago", tone: "teal" },
      { id: "Offer movement", label: "An offer advanced to enrolment", detail: "Engineering programme · demonstration event", time: "8 min ago", tone: "ochre" },
      { id: "Faculty review", label: "An application entered faculty review", detail: "Built environment programme · demonstration event", time: "16 min ago", tone: "blue" },
      { id: "Registration update", label: "An enrolment record was completed", detail: "Social innovation programme · demonstration event", time: "24 min ago", tone: "teal" },
    ],
  };
}

/**
 * Adds a clearly marked non-sensitive walkthrough record. This lets the product
 * demo prove that an incoming platform event changes the persisted analytics view.
 */
export async function recordWalkthroughIntake(): Promise<{ persisted: boolean; reference: string }> {
  const reference = `AXU-DEMO-${Date.now().toString().slice(-8)}`;
  const db = await getDb();
  if (!db) return { persisted: false, reference };

  const now = new Date();
  await db.insert(admissionApplications).values({
    reference,
    applicantName: "Incoming Ummah Applicant",
    programme: "Computer Science",
    faculty: "Computing & Natural Sciences",
    status: "under_review",
    submittedAt: now,
  });
  await db.insert(enrollmentRecords).values({
    studentNumber: `DEMO-${reference.slice(-6)}`,
    academicSession: "2026–2027",
    faculty: "Computing & Natural Sciences",
    programme: "Computer Science",
    level: "100",
    status: "active",
    enrolledAt: now,
  });

  return { persisted: true, reference };
}

/** A public preview never surfaces institutional records or personally identifying activity. */
export function getAnalyticsWalkthrough(): AnalyticsDashboard {
  return createDemoAnalyticsDashboard();
}

export function createGuidedDemoReference(seed = Date.now()) {
  return `GUIDED-${seed.toString(36).toUpperCase()}`;
}

/** Stores only a generic journey signal: no name, email, academic history, or applicant profile. */
export async function recordGuidedDemoIntake(): Promise<{ persisted: boolean; reference: string }> {
  const reference = createGuidedDemoReference();
  const db = await getDb();
  if (!db) return { persisted: false, reference };

  await db.insert(guidedDemoIntakes).values({ reference, status: "queued" });
  return { persisted: true, reference };
}

/** Returns the small generic receipt required to show a walkthrough handoff, with no applicant information. */
export async function getGuidedDemoHandoff(reference: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({ reference: guidedDemoIntakes.reference, status: guidedDemoIntakes.status, createdAt: guidedDemoIntakes.createdAt })
    .from(guidedDemoIntakes)
    .where(eq(guidedDemoIntakes.reference, reference))
    .limit(1);
  return result[0] ?? null;
}

const formatMonth = (date: Date) => new Intl.DateTimeFormat("en", { month: "short" }).format(date);

const relativeTime = (date: Date) => {
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60_000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
};

/** Aggregates stored operational records into the administrator analytics contract. */
export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
  const db = await getDb();
  if (!db) return createDemoAnalyticsDashboard();

  const [applications, enrollments, guidedIntakes] = await Promise.all([
    db.select().from(admissionApplications).orderBy(desc(admissionApplications.updatedAt)),
    db.select().from(enrollmentRecords).orderBy(desc(enrollmentRecords.updatedAt)),
    db.select().from(guidedDemoIntakes).orderBy(desc(guidedDemoIntakes.createdAt)).limit(4),
  ]);

  if (applications.length === 0 && enrollments.length === 0 && guidedIntakes.length === 0) return createDemoAnalyticsDashboard();

  /**
   * The walkthrough begins with a labelled baseline so the dashboard remains
   * presentation-ready. Persisted events are layered into the visible totals and
   * live ledger immediately; a populated institution uses only its stored rows.
   */
  if (applications.length < 20 && enrollments.length < 20) {
    const baseline = createDemoAnalyticsDashboard();
    const activeEnrolments = enrollments.filter(enrollment => enrollment.status === "active").length;
    const submitted = applications.filter(application => application.status !== "draft").length;
    const approved = applications.filter(application => application.status === "approved").length;
    const latestActivity = applications.slice(0, 2).map((application, index) => ({
      id: application.reference,
      label: "New application recorded in the live ledger",
      detail: `${application.programme} · ${application.reference}`,
      time: relativeTime(application.updatedAt),
      tone: (["teal", "blue"] as const)[index],
    }));
    const guidedActivity = guidedIntakes.map((intake, index) => ({
      id: intake.reference,
      label: "Guided applicant journey handed to registry",
      detail: "Applicant intake → administrator analytics · demonstration event",
      time: relativeTime(intake.createdAt),
      tone: (["ochre", "teal", "blue", "teal"] as const)[index % 4],
    }));
    const offersIssued = baseline.summary.offersIssued + approved;
    const enrolledStudents = baseline.summary.enrolledStudents + activeEnrolments;
    return {
      ...baseline,
      source: "live",
      refreshedAt: new Date(),
      summary: {
        applications: baseline.summary.applications + applications.length + guidedIntakes.length,
        submittedApplications: baseline.summary.submittedApplications + submitted + guidedIntakes.length,
        offersIssued,
        enrolledStudents,
        enrolmentConversion: Number(((enrolledStudents / Math.max(offersIssued, 1)) * 100).toFixed(1)),
        applicationChange: baseline.summary.applicationChange,
      },
      admissionsFunnel: baseline.admissionsFunnel.map((stage, index) => ({
        ...stage,
        value: stage.value + ([applications.length + guidedIntakes.length, submitted + guidedIntakes.length, applications.filter(application => application.status === "under_review").length + guidedIntakes.length, approved, activeEnrolments][index] ?? 0),
      })),
      programmeDemand: baseline.programmeDemand,
      liveActivity: [...guidedActivity, ...latestActivity, ...baseline.liveActivity].slice(0, 4),
    };
  }

  const sourceDate = new Date();
  const countByStatus = (status: string) => applications.filter(application => application.status === status).length;
  const submittedApplications = applications.filter(application => application.status !== "draft").length;
  const offersIssued = countByStatus("approved");
  const enrolledStudents = enrollments.filter(enrollment => enrollment.status === "active").length;
  const totalApplications = applications.length;
  const funnel = [
    { label: "Started", value: totalApplications, accent: "teal" as const },
    { label: "Submitted", value: submittedApplications, accent: "ink" as const },
    { label: "Under review", value: countByStatus("under_review"), accent: "blue" as const },
    { label: "Offers issued", value: offersIssued, accent: "ochre" as const },
    { label: "Enrolled", value: enrolledStudents, accent: "teal" as const },
  ];
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(sourceDate.getFullYear(), sourceDate.getMonth() - 5 + index, 1);
    const next = new Date(sourceDate.getFullYear(), sourceDate.getMonth() - 4 + index, 1);
    const inMonth = applications.filter(application => application.createdAt >= date && application.createdAt < next);
    return {
      month: formatMonth(date),
      applications: inMonth.length,
      offers: inMonth.filter(application => application.status === "approved").length,
    };
  });
  const facultyNames = Array.from(new Set([...applications.map(application => application.faculty), ...enrollments.map(enrollment => enrollment.faculty)])).slice(0, 4);
  const facultyDemand = facultyNames.map(faculty => {
    const facultyApplications = applications.filter(application => application.faculty === faculty).length;
    const activeEnrolments = enrollments.filter(enrollment => enrollment.faculty === faculty && enrollment.status === "active").length;
    const capacity = Math.max(activeEnrolments, Math.ceil(facultyApplications * 0.38), 1);
    return { faculty, applications: facultyApplications, capacity, fillRate: Math.min(100, Math.round((activeEnrolments / capacity) * 100)) };
  });
  const programmeNames = Array.from(new Set([...applications.map(application => application.programme), ...enrollments.map(enrollment => enrollment.programme)])).slice(0, 8);
  const programmeDemand = programmeNames.map(programme => {
    const programmeApplications = applications.filter(application => application.programme === programme);
    const activeEnrolments = enrollments.filter(enrollment => enrollment.programme === programme && enrollment.status === "active").length;
    const faculty = programmeApplications[0]?.faculty ?? enrollments.find(enrollment => enrollment.programme === programme)?.faculty ?? "Academic programmes";
    const capacity = Math.max(activeEnrolments, Math.ceil(programmeApplications.length * 0.38), 1);
    return { programme, faculty, applications: programmeApplications.length, capacity, fillRate: Math.min(100, Math.round((activeEnrolments / capacity) * 100)) };
  });
  const levelPalette = ["#136c68", "#5f9f95", "#9bc7ba", "#d3a64d"];
  const enrollmentByLevel = Array.from(new Set(enrollments.map(enrollment => enrollment.level))).map((level, index) => ({
    level,
    students: enrollments.filter(enrollment => enrollment.level === level && enrollment.status === "active").length,
    color: levelPalette[index % levelPalette.length],
  }));
  const liveActivity = applications.slice(0, 4).map((application, index) => ({
    id: application.reference,
    label: application.status === "approved" ? "Offer issued for acceptance" : application.status === "under_review" ? "Application routed to faculty review" : "New application record received",
    detail: `${application.programme} · ${application.reference}`,
    time: relativeTime(application.updatedAt),
    tone: (["teal", "ochre", "blue", "teal"] as const)[index % 4],
  }));

  return {
    source: "live",
    refreshedAt: sourceDate,
    summary: {
      applications: totalApplications,
      submittedApplications,
      offersIssued,
      enrolledStudents,
      enrolmentConversion: offersIssued ? Number(((enrolledStudents / offersIssued) * 100).toFixed(1)) : 0,
      applicationChange: 0,
    },
    admissionsTrend: months,
    admissionsFunnel: funnel,
    facultyDemand,
    programmeDemand,
    enrollmentByLevel,
    liveActivity,
  };
}
