/**
 * Civic Atelier system note: A public editorial procession transitions into a
 * focused academic workbench. Verdigris rules, editorial type, and document-like
 * metadata keep public and portal contexts recognizably part of one university.
 */
import { useState } from "react";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileText,
  Facebook,
  GraduationCap,
  Instagram,
  LayoutDashboard,
  Layers3,
  Linkedin,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";

type View = "public" | "login" | "workspace";
type Role = "student" | "lecturer" | "admin" | "applicant";

const brandMark = "/images/Ummah-quadrant-mark_c9843de3.png";
const heroCampus = "/images/Ummah-hero-campus_5fb96777.jpg";
const studioLearning = "/images/Ummah-studio-learning_b79ee70a.jpg";
const campusCommunity = "/images/Ummah-campus-community_25544302.jpg";
const chancellorPortrait = "/images/Ummah-chancellor-portrait_3255cfc4.jpg";

const programmes = [
  { code: "ENG", name: "Engineering & Built Environment", programmes: "18 programmes", tint: "amber" },
  { code: "SCI", name: "Computing & Natural Sciences", programmes: "22 programmes", tint: "teal" },
  { code: "HUM", name: "Humanities & Social Innovation", programmes: "16 programmes", tint: "blue" },
  { code: "BUS", name: "Management & Public Leadership", programmes: "14 programmes", tint: "clay" },
];

const courses = [
  ["CSC301", "Database Systems", "3", "Dr. S. Abdullahi"],
  ["CSC303", "Operating Systems", "3", "Dr. B. Tukur"],
  ["CSC305", "Computer Networks", "3", "Dr. H. Musa"],
  ["CSC307", "Software Engineering", "2", "Dr. F. Ibrahim"],
];

const results = [
  ["CSC301", "Database Systems", "78", "A", "3"],
  ["CSC303", "Operating Systems", "71", "A", "3"],
  ["CSC305", "Computer Networks", "64", "B", "3"],
  ["CSC307", "Software Engineering", "82", "A", "2"],
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionLabel({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand ${inverse ? "brand-inverse" : ""}`}>
      <img src={brandMark} alt="Ummah University" className="brand-mark" />
      <div className="brand-wordmark">
        <span>Ummah</span>
        <small>University</small>
      </div>
    </div>
  );
}

function PublicHeader({ open, setOpen, onPortal }: { open: boolean; setOpen: (value: boolean) => void; onPortal: () => void }) {
  const links = [
    ["About", "about"],
    ["Academics", "academics"],
    ["Faculties", "faculties"],
    ["Admissions", "admissions"],
    ["Campus life", "campus"],
    ["Leadership", "leadership"],
    ["News & events", "news"],
  ];

  return (
    <header className="public-header">
      <div className="header-shell">
        <button className="brand-button" onClick={() => scrollTo("top")} aria-label="Go to top">
          <Logo inverse />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="portal-link" onClick={onPortal}>My Ummah <ArrowRight size={15} /></button>
          <button className="header-apply" onClick={() => scrollTo("admissions")}>Apply now</button>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-nav">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => { scrollTo(id); setOpen(false); }}>{label}<ChevronRight size={17} /></button>
          ))}
          <button className="mobile-portal" onClick={() => { onPortal(); setOpen(false); }}>Enter My Ummah <ArrowRight size={17} /></button>
        </div>
      )}
    </header>
  );
}

function PublicExperience({ onPortal, onLogin, onOpenRole }: { onPortal: () => void; onLogin: () => void; onOpenRole: (role: Role, notice?: string, reference?: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [journeyActive, setJourneyActive] = useState(false);
  const guidedIntakeMutation = trpc.analytics.recordGuidedDemoIntake.useMutation({
    onSuccess: (result) => {
      setJourneyActive(true);
      onOpenRole("admin", `Guided intake ${result.reference} handed to the administrator analytics view.`, result.reference);
    },
  });
  const journeySteps: { role: Role; index: string; label: string; title: string; detail: string; icon: typeof GraduationCap }[] = [
    { role: "applicant", index: "01", label: "Applicant", title: "Begin with clarity", detail: "Guide a prospective student through a considered application flow.", icon: FileCheck2 },
    { role: "student", index: "02", label: "Student", title: "Continue with context", detail: "Bring courses, results, registration, and notices into one view.", icon: GraduationCap },
    { role: "lecturer", index: "03", label: "Lecturer", title: "Teach from one workbench", detail: "Keep rosters, attendance, material, and results close at hand.", icon: ClipboardCheck },
    { role: "admin", index: "04", label: "Administration", title: "Decide with the whole picture", detail: "Move from an incoming application to a decision-ready institutional view.", icon: ChartNoAxesCombined },
  ];

  return (
    <main id="top" className="public-experience">
      <PublicHeader open={menuOpen} setOpen={setMenuOpen} onPortal={onPortal} />

      <section className="hero-section">
        <img src={heroCampus} alt="Students on the Ummah University campus" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-kicker"><span /> Established for the questions ahead</p>
          <h1>Where capable minds become <em>useful</em> ones.</h1>
          <p className="hero-copy">An education grounded in inquiry, built for the wider world, and connected to a campus that knows where you are going.</p>
          <div className="hero-actions">
            <button className="button button-light" onClick={() => scrollTo("admissions")}>Explore admissions <ArrowRight size={17} /></button>
            <button className="button button-ghost" onClick={() => scrollTo("academics")}>Find your programme <ChevronDown size={17} /></button>
          </div>
        </div>
        <div className="hero-footnote">
          <div><span className="micro-label">2026/27</span><strong>Applications now open</strong></div>
          <button onClick={() => scrollTo("admissions")} aria-label="View admissions"><ArrowRight size={21} /></button>
        </div>
      </section>

      <section id="about" className="stat-band">
        <div className="stat-intro"><p className="eyebrow">Ummah at a glance</p><p>Built as a community of scholarship, practice, and public imagination.</p></div>
        <div className="stats-grid">
          <div><strong>13,800</strong><span>Students across<br />four schools</span></div>
          <div><strong>70<span className="stat-unit">+</span></strong><span>Undergraduate and<br />postgraduate pathways</span></div>
          <div><strong>91<span className="stat-unit">%</span></strong><span>Graduate progression<br />within six months</span></div>
        </div>
      </section>

      <section id="academics" className="programmes-section">
        <div className="programme-intro">
          <SectionLabel number="01" eyebrow="Study with intent" title="An education that stays in motion." />
          <p>Our programmes are designed to leave the classroom, enter the world, and return with better questions. Choose a discipline or begin from the challenge you want to solve.</p>
          <button className="text-link" onClick={onLogin}>Browse all programmes <ArrowRight size={17} /></button>
        </div>
        <div className="programme-list">
          {programmes.map((programme, index) => (
            <button key={programme.code} className={`programme-row programme-${programme.tint}`} onClick={onLogin}>
              <span className="programme-index">0{index + 1}</span>
              <span className="programme-code">{programme.code}</span>
              <span className="programme-name">{programme.name}</span>
              <span className="programme-count">{programme.programmes}</span>
              <ArrowRight className="programme-arrow" size={20} />
            </button>
          ))}
        </div>
      </section>

      <section id="faculties" className="faculties-section">
        <div className="faculties-heading">
          <SectionLabel number="02" eyebrow="Four academic schools" title="Find the faculty that moves your thinking." />
          <p>Each faculty gathers a distinct field of practice, a research culture, and a community prepared to make useful work in the world.</p>
        </div>
        <div className="academic-faculty-grid">
          {programmes.map((faculty, index) => (
            <article className={`academic-faculty-card faculty-${faculty.tint}`} key={faculty.code}>
              <div className="faculty-card-top"><span>0{index + 1} / {faculty.code}</span><span className="faculty-corner" /></div>
              <h3>{faculty.name}</h3>
              <span className="faculty-programme-total">{faculty.programmes}</span>
              <p>Rigorous undergraduate and postgraduate pathways, research studios, and professional communities.</p>
              <button className="faculty-button" onClick={onLogin}>Explore faculty <ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
      </section>

      <section id="admissions" className="admissions-section">
        <div className="admissions-image-wrap"><img src={studioLearning} alt="Students working together on an interdisciplinary project" /></div>
        <div className="admissions-content">
          <span className="chapter-tag">03 / Admissions 2026</span>
          <h2>Choose the path that makes the work worth doing.</h2>
          <p>Apply to Ummah with a clear view of your next steps. Track requirements, build an application, and understand your offer from one considered place.</p>
          <div className="admission-steps">
            <div><span>01</span><p><strong>Start your application</strong> Create a secure applicant profile.</p></div>
            <div><span>02</span><p><strong>Find your programme</strong> Compare entry routes and requirements.</p></div>
            <div><span>03</span><p><strong>Follow your progress</strong> See updates as your review advances.</p></div>
          </div>
          <button className="button button-ink" onClick={onPortal}>Begin an application <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-heading">
          <SectionLabel number="04" eyebrow="One university, connected" title="Every academic journey deserves a clearer interface." />
          <p>From the first prospectus page to the final result, Ummahâ€™s digital campus holds the essential work of university life together.</p>
        </div>
        <div className="service-cards">
          <article className="service-card service-card-main">
            <div className="service-icon"><GraduationCap size={24} /></div>
            <span className="card-index">A / Student</span>
            <h3>Your academic record, without the runaround.</h3>
            <p>Courses, results, fees, schedule, and every relevant university update in a single working view.</p>
            <button className="card-link" onClick={onPortal}>Enter student view <ArrowRight size={18} /></button>
          </article>
          <article className="service-card">
            <div className="service-icon"><ClipboardCheck size={23} /></div>
            <span className="card-index">B / Lecturer</span>
            <h3>Teach with the full class in view.</h3>
            <p>Course rosters, materials, attendance, and a deliberate result-entry flow for faculty.</p>
            <button className="card-link" onClick={onPortal}>Enter lecturer view <ArrowRight size={18} /></button>
          </article>
          <article className="service-card">
            <div className="service-icon"><ChartNoAxesCombined size={23} /></div>
            <span className="card-index">C / Administration</span>
            <h3>See the whole institution move.</h3>
            <p>Academic structures, admissions, people, and performance arranged into one decision-ready workspace.</p>
            <button className="card-link" onClick={onPortal}>Enter admin view <ArrowRight size={18} /></button>
          </article>
        </div>
      </section>

      <section id="journey" className="journey-section">
        <div className="journey-heading"><SectionLabel number="05" eyebrow="A connected product story" title="Follow one journey through the university." /><p>Use the guided demonstration to show clients how a single platform gives every university role a clearer next step.</p></div>
        <div className="journey-frame">
          <div className="journey-intro"><span className="chapter-tag">Guided platform journey</span><h3>From application<br />to institutional <em>insight.</em></h3><p>{journeyActive ? "A demonstration intake is now queued for the administrator walkthrough. Open each role to follow the connected experience." : "Start from the first application signal, then show how every next step becomes visible to the right person."}</p><button className="button button-light" onClick={() => guidedIntakeMutation.mutate()} disabled={guidedIntakeMutation.isPending}>{guidedIntakeMutation.isPending ? "Handing off intake" : journeyActive ? "Demonstration intake queued" : "Start the guided journey"} <ArrowRight size={16} /></button>{journeyActive && <button className="journey-admin-link" onClick={() => onOpenRole("admin")}>Open the administrator view <ArrowRight size={15} /></button>}</div>
          <div className="journey-steps">{journeySteps.map(({ role, index, label, title, detail, icon: Icon }) => <article className={`journey-step ${journeyActive && role === "admin" ? "handoff-ready" : ""}`} key={role}><div className="journey-step-index"><span>{index}</span><i /></div><div className="journey-step-content"><span>{label}</span><h4>{title}</h4><p>{detail}</p></div><button className="journey-open" onClick={() => onOpenRole(role)} aria-label={`Open ${label} demonstration`}><Icon size={17} /><ArrowRight size={16} /></button></article>)}</div>
        </div>
      </section>

      <section id="campus" className="campus-section">
        <div className="campus-copy">
          <p className="eyebrow">A campus with a point of view</p>
          <h2>Knowledge happens<br />in the space <em>between</em>.</h2>
          <p>Ummah is a place to make things, test ideas, and discover a network that stays useful long after graduation.</p>
          <div className="campus-notes">
            <span><MapPin size={16} /> Kawo, Kaduna State</span>
            <span><CalendarDays size={16} /> Open day Â· 14 October</span>
          </div>
          <button className="text-link text-link-light" onClick={() => scrollTo("news")}>Explore campus life <ArrowRight size={17} /></button>
        </div>
        <div className="campus-photo"><img src={campusCommunity} alt="Students walking through the university arcade" /><span className="photo-caption">People / Places / Possibility</span></div>
      </section>

      <section id="leadership" className="leadership-section">
        <div className="leadership-image-wrap"><img src={chancellorPortrait} alt="Professor Imani Adeyemi, Chancellor of Ummah University" /><span className="leadership-image-note">Office of the Chancellor / Ummah University</span></div>
        <div className="leadership-copy">
          <span className="chapter-tag">05 / Leadership</span>
          <h2>Lead with curiosity.<br /><em>Leave with responsibility.</em></h2>
          <blockquote>â€œA university earns its place by sending people into the world who can think clearly, act generously, and build what their communities need.â€</blockquote>
          <div className="leadership-signoff"><div><strong>Professor Imani Adeyemi</strong><span>Chancellor, Ummah University</span></div><button className="button button-outline-light" onClick={onPortal}>Meet our leadership <ArrowRight size={16} /></button></div>
        </div>
      </section>

      <section id="recognition" className="recognition-section">
        <div className="recognition-heading"><SectionLabel number="06" eyebrow="Awards & recognition" title="Recognition that can stand behind its evidence." /><p>A considered register for the achievements an institution is ready to verify, present, and keep in view.</p></div>
        <div className="recognition-register"><div className="recognition-register-head"><span>Recognition register / evidence-ready</span><span>Verified institutional milestones</span></div><div className="recognition-items"><article><span className="recognition-index">01</span><div><h3>Teaching & student success</h3><p>A dedicated place for verified teaching awards, graduate outcomes, and student achievement.</p></div><span className="recognition-state">Evidence pending</span></article><article><span className="recognition-index">02</span><div><h3>Research & innovation</h3><p>Present externally recognised research, innovation partnerships, and citations with context.</p></div><span className="recognition-state">Evidence pending</span></article><article><span className="recognition-index">03</span><div><h3>Public purpose & community</h3><p>Make community work, civic partnerships, and social impact legible to future students.</p></div><span className="recognition-state">Evidence pending</span></article></div></div>
      </section>

      <section id="news" className="journal-section">
        <div className="journal-heading"><SectionLabel number="07" eyebrow="The Ummah Journal" title="News from a university at work." /><button className="text-link" onClick={onLogin}>Visit the journal <ArrowRight size={17} /></button></div>
        <div className="journal-grid">
          <article className="journal-card journal-featured"><span className="journal-meta">Research Â· 12 August 2026</span><h3>Designing public spaces that help cities breathe.</h3><p>Ummah researchers turn climate data into tools for more liveable neighbourhoods.</p><button onClick={onLogin}>Read story <ArrowRight size={17} /></button></article>
          <article className="journal-card"><span className="journal-meta">Campus Â· 24 July 2026</span><h3>The new Applied Computing Studio opens its doors.</h3><button onClick={onLogin}>Read story <ArrowRight size={17} /></button></article>
          <article className="journal-card journal-event"><span className="journal-meta">Next event</span><strong>14<span>Oct</span></strong><h3>Future Fields: Ummah Open Day</h3><button onClick={onLogin}>Plan your visit <ArrowRight size={17} /></button></article>
        </div>
      </section>

      <section className="portal-cta">
        <div className="portal-cta-brand"><Logo inverse /><span className="chapter-tag">Digital Campus / Live Demo</span></div>
        <div><h2>The university experience,<br /><em>made coherent.</em></h2><p>Take a guided look inside the applicant, student, lecturer, and administrator workspaces.</p></div>
        <button className="button button-light" onClick={onPortal}>Open the live demo <ArrowRight size={17} /></button>
      </section>

      <footer className="footer">
        <div className="footer-top"><Logo /><p>Ummah University<br />Kawo, Kaduna State<br />Nigeria</p><a href="mailto:enquiries@Ummah.edu">enquiries@Ummah.edu</a><a href="tel:+2340000000000">+234 000 000 0000</a></div>
        <div className="footer-bottom"><span>Â© 2026 Ummah University</span><span>Study. Make. Matter.</span><div className="footer-utilities"><div className="footer-socials" aria-label="Official social profiles coming soon"><span title="LinkedIn profile coming soon" aria-label="LinkedIn profile coming soon"><Linkedin size={15} /></span><span title="Instagram profile coming soon" aria-label="Instagram profile coming soon"><Instagram size={15} /></span><span title="Facebook profile coming soon" aria-label="Facebook profile coming soon"><Facebook size={15} /></span><span title="YouTube profile coming soon" aria-label="YouTube profile coming soon"><Youtube size={16} /></span></div><button onClick={onPortal}>My Ummah <ArrowRight size={14} /></button></div></div>
      </footer>
    </main>
  );
}

function StatCard({ label, value, detail, tone = "teal" }: { label: string; value: string; detail: string; tone?: string }) {
  return <article className={`metric-card metric-${tone}`}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function StudentWorkspace({ section }: { section: string }) {
  if (section === "courses") return (
    <div className="workspace-content"><div className="page-intro"><div><p className="eyebrow">Academic record / 2025â€“2026</p><h1>My courses</h1><p>First semester Â· B.Sc. Computer Science Â· 300 Level</p></div><button className="action-button"><Download size={16} /> Download slip</button></div><section className="data-panel"><div className="data-panel-head"><div><h3>Registered modules</h3><span>11 credit units</span></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="table-wrap"><table><thead><tr><th>Course</th><th>Title</th><th>Units</th><th>Lecturer</th><th>Status</th></tr></thead><tbody>{courses.map((course) => <tr key={course[0]}><td><span className="course-code">{course[0]}</span></td><td>{course[1]}</td><td>{course[2]}</td><td>{course[3]}</td><td><span className="status-pill success">Registered</span></td></tr>)}</tbody></table></div></section></div>
  );
  if (section === "results") return (
    <div className="workspace-content"><div className="page-intro"><div><p className="eyebrow">Academic record / 2025â€“2026</p><h1>Results</h1><p>Review assessed work and your semester performance.</p></div><button className="select-button">2025 / 2026 <ChevronDown size={16} /></button></div><div className="result-summary"><div><span>First semester</span><strong>4.25</strong><p>Semester GPA</p></div><div><span>Cumulative record</span><strong>3.82<span>/5.00</span></strong><p>CGPA Â· Good standing</p></div><div className="result-note"><CircleCheck size={20} /><p><strong>All results published.</strong><br />This record was updated on 08 July 2026.</p></div></div><section className="data-panel"><div className="data-panel-head"><div><h3>Module outcomes</h3><span>First semester</span></div><button className="action-button"><Download size={15} /> Statement</button></div><div className="table-wrap"><table><thead><tr><th>Course</th><th>Title</th><th>Score</th><th>Grade</th><th>Units</th></tr></thead><tbody>{results.map((result) => <tr key={result[0]}><td><span className="course-code">{result[0]}</span></td><td>{result[1]}</td><td>{result[2]}</td><td><span className={`grade grade-${result[3].toLowerCase()}`}>{result[3]}</span></td><td>{result[4]}</td></tr>)}</tbody></table></div></section></div>
  );
  if (section === "profile") return (
    <div className="workspace-content"><div className="page-intro"><div><p className="eyebrow">Personal record</p><h1>My profile</h1><p>Your registered academic and contact information.</p></div><button className="action-button"><Settings size={16} /> Update details</button></div><section className="profile-panel"><div className="profile-hero"><div className="avatar avatar-large">AS</div><div><h2>Ahmad Sani</h2><p>AXU/2023/CSC/1148 Â· B.Sc. Computer Science</p><span className="status-pill success">Good standing</span></div></div><div className="profile-grid"><div><span>Faculty</span><strong>Computing & Natural Sciences</strong></div><div><span>Department</span><strong>Computer Science</strong></div><div><span>Current level</span><strong>300 Level</strong></div><div><span>University email</span><strong>ahmad.sani@students.Ummah.edu</strong></div><div><span>Phone</span><strong>+234 803 000 1148</strong></div><div><span>Programme duration</span><strong>4 years, full-time</strong></div></div></section></div>
  );
  return (
    <div className="workspace-content">
      <div className="workspace-welcome"><div><p className="eyebrow">Tuesday, 18 August 2026</p><h1>Good morning, Ahmad.</h1><p>Computer Science Â· 300 Level Â· First semester</p></div><div className="welcome-actions"><button className="notification-button"><Bell size={19} /><span>3</span></button><button className="avatar">AS</button></div></div>
      <div className="student-hero-card"><div><span className="student-card-tag">Academic standing</span><h2>On a steady course.</h2><p>Your results, course work, and registration are all in good order.</p><button>View results <ArrowRight size={16} /></button></div><div className="gpa-orbit"><span>CGPA</span><strong>3.82</strong><small>/ 5.00</small></div></div>
      <div className="metrics-grid"><StatCard label="Registered courses" value="04" detail="11 credit units this semester" /><StatCard label="Next class" value="09:00" detail="CSC305 Â· Engineering Block B" tone="ink" /><StatCard label="Fees balance" value="â‚¦0" detail="No payments currently due" tone="amber" /></div>
      <div className="split-row"><section className="data-panel notices-panel"><div className="data-panel-head"><div><h3>From the university</h3><span>Recent notices</span></div><button className="text-button">View all</button></div><div className="notice-list"><div><span className="notice-dot" /><p><strong>First semester examination timetable released.</strong><small>Academic Registry Â· 2 hours ago</small></p><ChevronRight size={18} /></div><div><span className="notice-dot gold" /><p><strong>Course registration closes this Friday.</strong><small>Student Services Â· Yesterday</small></p><ChevronRight size={18} /></div><div><span className="notice-dot blue" /><p><strong>Your CSC301 result has been published.</strong><small>Computing School Â· 07 July</small></p><ChevronRight size={18} /></div></div></section><section className="today-card"><span className="eyebrow">Todayâ€™s schedule</span><div className="timeline"><div><span>09:00</span><p><strong>CSC305 Â· Computer Networks</strong>Engineering Block B Â· Room 204</p></div><div><span>13:00</span><p><strong>CSC301 Â· Database Systems</strong>Computing Lab 2</p></div></div><button className="text-link">Open timetable <ArrowRight size={16} /></button></section></div>
    </div>
  );
}

function LecturerWorkspace({ section, onSubmit }: { section: string; onSubmit: () => void }) {
  if (section === "results") return <div className="workspace-content"><div className="page-intro"><div><p className="eyebrow">Assessment workspace / CSC301</p><h1>Result entry</h1><p>300 Level Â· First semester Â· Database Systems</p></div><button className="select-button">CSC301 <ChevronDown size={16} /></button></div><section className="data-panel"><div className="data-panel-head"><div><h3>Continuous assessment & examination</h3><span>3 of 42 grades still require review</span></div><span className="status-pill pending">Draft</span></div><div className="table-wrap"><table className="marks-table"><thead><tr><th>Student</th><th>CA / 30</th><th>Exam / 70</th><th>Total</th><th>Grade</th></tr></thead><tbody><tr><td><div className="student-cell"><div className="avatar mini">AS</div>Ahmad Sani</div></td><td><input defaultValue="28" aria-label="Ahmad CA score" /></td><td><input defaultValue="50" aria-label="Ahmad exam score" /></td><td><strong>78</strong></td><td><span className="grade grade-a">A</span></td></tr><tr><td><div className="student-cell"><div className="avatar mini">II</div>Ibrahim Idris</div></td><td><input defaultValue="24" aria-label="Ibrahim CA score" /></td><td><input defaultValue="43" aria-label="Ibrahim exam score" /></td><td><strong>67</strong></td><td><span className="grade grade-b">B</span></td></tr><tr><td><div className="student-cell"><div className="avatar mini">YU</div>Yusuf Umar</div></td><td><input defaultValue="18" aria-label="Yusuf CA score" /></td><td><input defaultValue="35" aria-label="Yusuf exam score" /></td><td><strong>53</strong></td><td><span className="grade grade-c">C</span></td></tr></tbody></table></div><div className="panel-footer"><p><ShieldCheck size={16} /> Submissions are routed to the academic registry for approval.</p><button className="button button-ink" onClick={onSubmit}>Submit results <FileCheck2 size={16} /></button></div></section></div>;
  return <div className="workspace-content"><div className="workspace-welcome"><div><p className="eyebrow">Faculty workbench / 18 August 2026</p><h1>Good morning, Dr. Mariam.</h1><p>Department of Computer Science Â· School of Computing</p></div><div className="welcome-actions"><button className="notification-button"><Bell size={19} /><span>2</span></button><button className="avatar">MA</button></div></div><div className="metrics-grid"><StatCard label="Assigned courses" value="03" detail="Across two academic levels" /><StatCard label="Students" value="126" detail="Enrolled this semester" tone="ink" /><StatCard label="Pending tasks" value="06" detail="Assessments and reviews" tone="amber" /></div><div className="lecturer-layout"><section className="data-panel course-focus"><div className="data-panel-head"><div><span className="eyebrow">Active course</span><h3>CSC301 â€” Database Systems</h3><p>300 Level Â· 42 enrolled students</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="course-progress"><div><span>Assessment status</span><strong>92% complete</strong></div><div className="progress-track"><span /></div></div><div className="course-actions"><button><UsersRound size={18} /> Student list</button><button><FileText size={18} /> Materials</button><button><ClipboardCheck size={18} /> Attendance</button><button onClick={onSubmit}><Award size={18} /> Enter results</button></div></section><section className="today-card lecturer-day"><span className="eyebrow">Todayâ€™s classes</span><div className="timeline"><div><span>10:00</span><p><strong>CSC301 Â· Database Systems</strong>Computing Lab 2 Â· 42 students</p></div><div><span>15:30</span><p><strong>CSC205 Â· Data Structures</strong>Engineering Block B Â· 67 students</p></div></div><button className="text-link">Open teaching schedule <ArrowRight size={16} /></button></section></div></div>;
}

function AdminAnalyticsDashboard({ onOpenAdmissions, guidedHandoffReference = "" }: { onOpenAdmissions: () => void; guidedHandoffReference?: string }) {
  const [focus, setFocus] = useState<"admissions" | "enrolment">("admissions");
  const [showProgrammeLedger, setShowProgrammeLedger] = useState(false);
  const { data: currentUser } = trpc.auth.me.useQuery();
  const isLiveAdmin = currentUser?.role === "admin";
  const walkthroughQuery = trpc.analytics.walkthrough.useQuery(undefined, {
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    enabled: !isLiveAdmin,
  });
  const liveDashboardQuery = trpc.analytics.dashboard.useQuery(undefined, {
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    enabled: isLiveAdmin,
  });
  const activeQuery = isLiveAdmin ? liveDashboardQuery : walkthroughQuery;
  const { data: dashboard, isLoading, isFetching, isError, refetch, dataUpdatedAt } = activeQuery;
  const { data: guidedHandoff } = trpc.analytics.guidedHandoff.useQuery({ reference: guidedHandoffReference }, { enabled: Boolean(guidedHandoffReference) });
  const intakeMutation = trpc.analytics.recordWalkthroughIntake.useMutation({
    onSuccess: () => { void liveDashboardQuery.refetch(); },
  });

  if (isLoading) return <div className="workspace-content analytics-loading"><div className="analytics-loading-rule" /><p className="eyebrow">Preparing institutional intelligence</p><h1>Reading the academic picture.</h1><div className="analytics-skeletons"><span /><span /><span /><span /></div></div>;
  if (isError || !dashboard) return <div className="workspace-content analytics-loading"><p className="eyebrow">Analytics connection</p><h1>Data needs a moment.</h1><p>The analytics service could not be reached. Use refresh to try again.</p><button className="button button-ink" onClick={() => { void refetch(); }}>Retry connection <RefreshCw size={16} /></button></div>;

  const maxApplications = Math.max(...dashboard.admissionsTrend.map(point => point.applications), 1);
  const maxEnrollment = Math.max(...dashboard.enrollmentByLevel.map(point => point.students), 1);
  const trendPoints = dashboard.admissionsTrend.map((point, index) => {
    const x = 26 + (index * 448) / Math.max(dashboard.admissionsTrend.length - 1, 1);
    const y = 171 - (point.applications / maxApplications) * 126;
    return `${x},${y}`;
  }).join(" ");
  const offerPoints = dashboard.admissionsTrend.map((point, index) => {
    const x = 26 + (index * 448) / Math.max(dashboard.admissionsTrend.length - 1, 1);
    const y = 171 - (point.offers / maxApplications) * 126;
    return `${x},${y}`;
  }).join(" ");
  const refreshedLabel = dataUpdatedAt ? `Refreshed ${new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Refreshing now";

  return <div className="workspace-content analytics-workspace">
    {guidedHandoff && <div className="guided-handoff-banner"><span><CircleCheck size={18} /></span><div><p className="eyebrow">Connected demonstration / registry handoff</p><strong>Applicant intake received by administrator analytics.</strong><small>{guidedHandoff.reference} Â· {guidedHandoff.status.replace("_", " ")} Â· no personal data stored</small></div><Activity size={18} /></div>}
    <div className="analytics-hero">
      <div><p className="eyebrow">Institutional intelligence / live dashboard</p><h1>Admissions, in motion.</h1><p>Track the health of the incoming class from first interest to confirmed enrolment.</p></div>
      <div className="analytics-hero-actions"><span className={`live-status ${dashboard.source === "live" ? "connected" : "demo"}`}><i />{dashboard.source === "live" ? "Live platform records" : "Demonstration dataset"}</span><button className="action-button refresh-button" onClick={() => { if (isLiveAdmin) intakeMutation.mutate(); else startLogin(); }} disabled={intakeMutation.isPending}><Plus size={16} /> {intakeMutation.isPending ? "Recording" : isLiveAdmin ? "Add live intake" : "Sign in to add intake"}</button><button className="action-button refresh-button" onClick={() => { void refetch(); }}><RefreshCw size={16} className={isFetching ? "spin" : ""} /> {isFetching ? "Refreshing" : "Refresh"}</button></div>
    </div>

    <div className="analytics-nav" role="tablist" aria-label="Analytics focus">
      <button role="tab" aria-selected={focus === "admissions"} className={focus === "admissions" ? "active" : ""} onClick={() => setFocus("admissions")}>Admissions cycle</button>
      <button role="tab" aria-selected={focus === "enrolment"} className={focus === "enrolment" ? "active" : ""} onClick={() => setFocus("enrolment")}>Enrolment picture</button>
      <span>{refreshedLabel}</span>
    </div>

    <div className="analytics-summary-grid">
      <article className="analytics-metric metric-teal"><span>Applications started</span><strong>{dashboard.summary.applications.toLocaleString()}</strong><p><b>+{dashboard.summary.applicationChange}%</b> against the last reporting view</p></article>
      <article className="analytics-metric metric-ink"><span>Submitted applications</span><strong>{dashboard.summary.submittedApplications.toLocaleString()}</strong><p>{Math.round((dashboard.summary.submittedApplications / Math.max(dashboard.summary.applications, 1)) * 100)}% of started applications complete</p></article>
      <article className="analytics-metric metric-ochre"><span>Offers issued</span><strong>{dashboard.summary.offersIssued.toLocaleString()}</strong><p>Current review and offer cycle</p></article>
      <article className="analytics-metric metric-blue"><span>Confirmed enrolments</span><strong>{dashboard.summary.enrolledStudents.toLocaleString()}</strong><p><b>{dashboard.summary.enrolmentConversion}%</b> offer-to-enrolment conversion</p></article>
    </div>

    <div className="analytics-layout">
      <section className="analytics-card trend-card">
        <div className="analytics-card-head"><div><span className="eyebrow">01 / Demand signal</span><h2>{focus === "admissions" ? "Applications & offers" : "Progression to enrolment"}</h2><p>Current admissions cycle Â· Monthly activity</p></div><div className="chart-legend"><span><i className="legend-applications" />Applications</span><span><i className="legend-offers" />Offers</span></div></div>
        <div className="trend-graphic">
          <svg viewBox="0 0 500 190" role="img" aria-label="Line chart showing monthly applications and offers">
            <defs><linearGradient id="admissionsFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#136c68" stopOpacity=".22" /><stop offset="1" stopColor="#136c68" stopOpacity="0" /></linearGradient></defs>
            {[45, 87, 129, 171].map(y => <line key={y} x1="26" x2="474" y1={y} y2={y} />)}
            <polygon points={`26,171 ${trendPoints} 474,171`} fill="url(#admissionsFill)" />
            <polyline points={trendPoints} className="applications-line" />
            <polyline points={offerPoints} className="offers-line" />
            {dashboard.admissionsTrend.map((point, index) => { const x = 26 + (index * 448) / Math.max(dashboard.admissionsTrend.length - 1, 1); const y = 171 - (point.applications / maxApplications) * 126; return <circle key={point.month} cx={x} cy={y} r="3.8" className="applications-dot" />; })}
          </svg>
          <div className="trend-labels">{dashboard.admissionsTrend.map(point => <span key={point.month}>{point.month}</span>)}</div>
        </div>
      </section>

      <section className="analytics-card funnel-card">
        <div className="analytics-card-head"><div><span className="eyebrow">02 / Conversion route</span><h2>Admissions funnel</h2><p>Current movement through the cycle</p></div><button className="text-button" onClick={onOpenAdmissions}>Review queue <ArrowRight size={15} /></button></div>
        <div className="funnel-list">{dashboard.admissionsFunnel.map((stage, index) => <div className="funnel-stage" key={stage.label}><div className="funnel-label"><span className={`funnel-index ${stage.accent}`}>0{index + 1}</span><strong>{stage.label}</strong><b>{stage.value.toLocaleString()}</b></div><div className="funnel-track"><span className={stage.accent} style={{ width: `${Math.max(8, (stage.value / Math.max(dashboard.summary.applications, 1)) * 100)}%` }} /></div></div>)}</div>
      </section>

      <section className="analytics-card faculty-card">
        <div className="analytics-card-head"><div><span className="eyebrow">03 / Faculty outlook</span><h2>Demand & capacity</h2><p>Where the incoming class is taking shape</p></div><button className="text-button" onClick={() => setShowProgrammeLedger(!showProgrammeLedger)}>{showProgrammeLedger ? "Close ledger" : "Programme ledger"} <ChevronDown size={15} /></button></div>
        <div className="faculty-demand-list">{dashboard.facultyDemand.map(faculty => <div className="faculty-demand-row" key={faculty.faculty}><div><strong>{faculty.faculty}</strong><span>{faculty.applications.toLocaleString()} applications Â· {faculty.capacity.toLocaleString()} capacity</span></div><div className="capacity-readout"><span>{faculty.fillRate}%</span><div><i style={{ width: `${faculty.fillRate}%` }} /></div></div></div>)}</div>
        {showProgrammeLedger && <div className="programme-ledger"><div className="ledger-heading"><span>Programme</span><span>Applications</span><span>Capacity</span><span>Fill rate</span></div>{dashboard.programmeDemand.map(programme => <div className="ledger-row" key={programme.programme}><strong>{programme.programme}<small>{programme.faculty}</small></strong><span>{programme.applications.toLocaleString()}</span><span>{programme.capacity.toLocaleString()}</span><b>{programme.fillRate}%</b></div>)}</div>}
      </section>

      <section className="analytics-card enrolment-card">
        <div className="analytics-card-head"><div><span className="eyebrow">04 / Academic load</span><h2>Enrolment by level</h2><p>Confirmed active students</p></div><span className="enrolment-total">{dashboard.summary.enrolledStudents.toLocaleString()}<small>active</small></span></div>
        <div className="level-bars">{dashboard.enrollmentByLevel.map(level => <div key={level.level}><div className="level-bar-shell"><span style={{ height: `${Math.max(6, (level.students / maxEnrollment) * 100)}%`, background: level.color }} /></div><b>{level.level}</b><small>{level.students.toLocaleString()}</small></div>)}</div>
      </section>

      <section className="analytics-card activity-card">
        <div className="analytics-card-head"><div><span className="eyebrow">Live ledger</span><h2>Recent admissions activity</h2></div><span className="activity-pulse"><Activity size={14} /> Updating</span></div>
        <div className="activity-stream">{dashboard.liveActivity.map(activity => <div key={activity.id}><span className={`activity-icon ${activity.tone}`}><Activity size={15} /></span><p><strong>{activity.label}</strong><small>{activity.detail} Â· {activity.id}</small></p><time>{activity.time}</time></div>)}</div>
      </section>
    </div>
  </div>;
}

function AdminWorkspace({ section, onApprove, onOpenAdmissions, guidedHandoffReference }: { section: string; onApprove: () => void; onOpenAdmissions: () => void; guidedHandoffReference?: string }) {
  if (section === "admissions") return <div className="workspace-content"><div className="page-intro"><div><p className="eyebrow">Admissions management / 2026â€“2027</p><h1>Application review</h1><p>2,184 applications currently active in the admissions process.</p></div><button className="action-button"><Download size={16} /> Export queue</button></div><section className="data-panel"><div className="data-panel-head"><div><h3>Applications requiring decision</h3><span>17 in the Computer Science review queue</span></div><div className="table-tools"><button className="icon-button"><Search size={18} /></button><button className="select-button">Under review <ChevronDown size={16} /></button></div></div><div className="table-wrap"><table><thead><tr><th>Application</th><th>Applicant</th><th>Programme</th><th>Submitted</th><th>Status</th><th /></tr></thead><tbody><tr><td><span className="course-code">2026-00124</span></td><td>Yasmin Lawal</td><td>Computer Science</td><td>15 Aug 2026</td><td><span className="status-pill pending">Under review</span></td><td><button className="table-action" onClick={onApprove}>Review <ChevronRight size={15} /></button></td></tr><tr><td><span className="course-code">2026-00131</span></td><td>David Okoye</td><td>Mechanical Engineering</td><td>15 Aug 2026</td><td><span className="status-pill pending">Under review</span></td><td><button className="table-action" onClick={onApprove}>Review <ChevronRight size={15} /></button></td></tr><tr><td><span className="course-code">2026-00138</span></td><td>Hauwa Mohammed</td><td>Economics</td><td>14 Aug 2026</td><td><span className="status-pill neutral">In progress</span></td><td><button className="table-action" onClick={onApprove}>Open <ChevronRight size={15} /></button></td></tr></tbody></table></div></section></div>;
  return <AdminAnalyticsDashboard onOpenAdmissions={onOpenAdmissions} guidedHandoffReference={guidedHandoffReference} />;
}

function ApplicantWorkspace({ onApply }: { onApply: () => void }) {
  return <div className="workspace-content applicant-workspace"><div className="page-intro"><div><p className="eyebrow">Admissions 2026â€“2027</p><h1>Your application, in view.</h1><p>Complete each section to prepare your Ummah application for review.</p></div><span className="status-pill pending">Draft application</span></div><section className="application-card"><div className="application-card-top"><div><span className="course-code">AXU/APP/2026/00124</span><h2>Computer Science</h2><p>B.Sc. Â· Full-time Â· 4 years</p></div><span className="application-completion"><strong>60%</strong> Complete</span></div><div className="application-progress"><span /></div><div className="application-steps"><button><span className="step-done"><Check size={15} /></span><div><strong>Personal details</strong><small>Completed</small></div><ChevronRight size={17} /></button><button><span className="step-done"><Check size={15} /></span><div><strong>Academic history</strong><small>Completed</small></div><ChevronRight size={17} /></button><button><span className="step-current">3</span><div><strong>Supporting documents</strong><small>2 documents needed</small></div><ChevronRight size={17} /></button><button><span className="step-next">4</span><div><strong>Review & submit</strong><small>Not started</small></div><ChevronRight size={17} /></button></div><div className="application-action"><div><UploadCloud size={20} /><p><strong>Next: add your documents.</strong><br />Upload your academic transcript and identity document.</p></div><button className="button button-ink" onClick={onApply}>Continue application <ArrowRight size={16} /></button></div></section><section className="application-help"><Sparkles size={20} /><div><strong>Need a hand with your application?</strong><p>Our admissions team is available Mondayâ€“Friday, 08:30â€“16:30.</p></div><button className="text-link">Contact admissions <ArrowRight size={16} /></button></section></div>;
}

function Workspace({ role, setRole, onExit, initialNotice = "", guidedHandoffReference = "" }: { role: Role; setRole: (role: Role) => void; onExit: () => void; initialNotice?: string; guidedHandoffReference?: string }) {
  const [section, setSection] = useState("dashboard");
  const [notice, setNotice] = useState(initialNotice);
  const roleConfig: Record<Role, { title: string; initials: string; person: string; roleLabel: string; nav: [string, string, typeof LayoutDashboard][] }> = {
    student: { title: "Student Portal", initials: "AS", person: "Ahmad Sani", roleLabel: "Student Â· 300 Level", nav: [["Dashboard", "dashboard", LayoutDashboard], ["My profile", "profile", UserRound], ["My courses", "courses", BookOpen], ["Results", "results", Award], ["Timetable", "timetable", CalendarDays], ["Fees", "fees", FileText], ["Notifications", "notifications", Bell]] },
    lecturer: { title: "Lecturer Portal", initials: "MA", person: "Dr. Mariam Abdullahi", roleLabel: "Computer Science", nav: [["Dashboard", "dashboard", LayoutDashboard], ["My courses", "courses", BookOpen], ["Students", "students", UsersRound], ["Attendance", "attendance", ClipboardCheck], ["Materials", "materials", FileText], ["Results", "results", Award], ["Notifications", "notifications", Bell]] },
    admin: { title: "Admin Console", initials: "AO", person: "Amina Okafor", roleLabel: "Academic Registry", nav: [["Live analytics", "dashboard", LayoutDashboard], ["Students", "students", UsersRound], ["Staff", "staff", UserRound], ["Academic structure", "academics", Layers3], ["Programmes", "programmes", BookOpen], ["Admissions", "admissions", FileCheck2], ["Results", "results", Award], ["Announcements", "announcements", Bell]] },
    applicant: { title: "Applicant Hub", initials: "YL", person: "Yasmin Lawal", roleLabel: "2026 applicant", nav: [["Application", "dashboard", FileText], ["Programme", "programme", BookOpen], ["Documents", "documents", UploadCloud], ["Updates", "updates", Bell]] },
  };
  const config = roleConfig[role];
  const switchRole = (nextRole: Role) => { setRole(nextRole); setSection("dashboard"); setNotice(""); };
  const actionNotice = role === "lecturer" ? "Results submitted Â· Sent to the Academic Registry for approval." : role === "admin" ? "Application #2026-00124 marked for decision review." : "Document upload is ready for the next step.";

  return <div className="workspace-shell"><aside className="workspace-sidebar"><div><button className="portal-brand" onClick={onExit}><Logo /><span className="live-chip">Demo</span></button><div className="portal-seal"><img src={brandMark} alt="" /><span>Academic operating system</span><b>2025â€“26</b></div><div className="portal-title"><span>{config.title}</span><button className="sidebar-collapse" aria-label="Collapse navigation"><PanelLeft size={17} /></button></div><nav className="portal-nav">{config.nav.map(([label, id, Icon]) => <button key={id} className={section === id || (id === "dashboard" && section === "dashboard") ? "active" : ""} onClick={() => setSection(id)}><Icon size={18} /> <span>{label}</span>{label === "Notifications" && <b>3</b>}</button>)}</nav></div><div className="sidebar-bottom"><div className="role-switcher"><button className="role-switcher-trigger"><div className="avatar mini">{config.initials}</div><div><strong>{config.person}</strong><span>{config.roleLabel}</span></div><ChevronDown size={15} /></button><div className="role-options"><span>View demo as</span>{(["student", "lecturer", "admin", "applicant"] as Role[]).map((roleOption) => <button key={roleOption} onClick={() => switchRole(roleOption)} className={role === roleOption ? "selected" : ""}>{roleOption === "admin" ? "Administrator" : roleOption[0].toUpperCase() + roleOption.slice(1)}</button>)}</div></div><button className="exit-button" onClick={onExit}><LogOut size={17} /> Public website</button></div></aside><section className={`workspace-main workspace-${role}`}><header className="workspace-mobile-head"><button onClick={onExit}><img src={brandMark} alt="" /> Ummah</button><span>{config.title}</span><button className="avatar mini">{config.initials}</button></header><div className="workspace-system-strip"><span className="system-rule" /><div><strong>{config.title}</strong><small>Ummah Academic OS / 2025â€“2026</small></div><div className="system-identity"><img src={brandMark} alt="" /><span>{role === "student" ? "Academic record" : role === "lecturer" ? "Teaching operations" : role === "admin" ? "Institutional intelligence" : "Admissions dossier"}</span></div></div>{notice && <div className="success-banner"><CircleCheck size={18} /><span>{notice}</span><button onClick={() => setNotice("")}><X size={16} /></button></div>}{role === "student" && <StudentWorkspace section={section} />}{role === "lecturer" && <LecturerWorkspace section={section} onSubmit={() => setNotice(actionNotice)} />}{role === "admin" && <AdminWorkspace section={section} onApprove={() => setNotice(actionNotice)} onOpenAdmissions={() => setSection("admissions")} guidedHandoffReference={guidedHandoffReference} />}{role === "applicant" && <ApplicantWorkspace onApply={() => setNotice(actionNotice)} />}</section></div>;
}

function Login({ setRole, onEnter, onExit }: { setRole: (role: Role) => void; onEnter: () => void; onExit: () => void }) {
  const [selectedRole, selectRole] = useState<Role>("student");
  const roles: { id: Role; label: string; description: string; icon: typeof GraduationCap }[] = [{ id: "student", label: "Student", description: "Courses, results, profile & notices", icon: GraduationCap }, { id: "lecturer", label: "Lecturer", description: "Classes, students & result entry", icon: ClipboardCheck }, { id: "admin", label: "Administrator", description: "Admissions & academic operations", icon: BarChart3 }, { id: "applicant", label: "Applicant", description: "Application progress & documents", icon: FileCheck2 }];
  return <div className="login-page"><div className="login-brand-panel"><button className="brand-button" onClick={onExit}><Logo inverse /></button><div className="login-brand-copy"><p className="hero-kicker"><span /> Ummah digital campus</p><h1>One place to move <em>forward</em>.</h1><p>A considered, connected interface for every university journey.</p></div><div className="login-panel-foot"><span>Ummah University</span><span>Study. Make. Matter.</span></div></div><main className="login-content"><button className="back-link" onClick={onExit}><ArrowRight size={17} className="back-icon" /> Return to Ummah</button><div className="login-form"><span className="chapter-tag">Live MVP walkthrough</span><h2>Choose your view.</h2><p>Take the five-minute platform journey from applicant to university administration.</p><div className="persona-grid">{roles.map(({ id, label, description, icon: Icon }) => <button key={id} className={`persona-option ${selectedRole === id ? "selected" : ""}`} onClick={() => selectRole(id)}><span className="persona-icon"><Icon size={20} /></span><span><strong>{label}</strong><small>{description}</small></span><span className="radio" /></button>)}</div><button className="button button-ink login-submit" onClick={() => { setRole(selectedRole); onEnter(); }}>Open {selectedRole === "admin" ? "administrator" : selectedRole} view <ArrowRight size={17} /></button><p className="demo-credentials"><ShieldCheck size={15} /> This interactive preview uses demonstration data only.</p></div></main></div>;
}

function viewFromUrl(): View {
  const requestedView = new URLSearchParams(window.location.search).get("view");
  return requestedView === "login" || requestedView === "workspace" ? requestedView : "public";
}

function roleFromUrl(): Role {
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  return requestedRole === "lecturer" || requestedRole === "admin" || requestedRole === "applicant" ? requestedRole : "student";
}

function guidedHandoffFromUrl() {
  const reference = new URLSearchParams(window.location.search).get("handoff") ?? "";
  return /^GUIDED-[A-Z0-9]+$/.test(reference) ? reference : "";
}

export default function Home() {
  const [view, setView] = useState<View>(viewFromUrl);
  const [role, setRole] = useState<Role>(roleFromUrl);
  const [workspaceNotice, setWorkspaceNotice] = useState("");
  const [guidedHandoffReference, setGuidedHandoffReference] = useState(guidedHandoffFromUrl);
  if (view === "login") return <Login setRole={setRole} onEnter={() => setView("workspace")} onExit={() => setView("public")} />;
  if (view === "workspace") return <Workspace role={role} setRole={setRole} onExit={() => setView("public")} initialNotice={workspaceNotice} guidedHandoffReference={guidedHandoffReference} />;
  return <PublicExperience onPortal={() => setView("login")} onLogin={() => setView("login")} onOpenRole={(nextRole, notice, reference) => { setRole(nextRole); setWorkspaceNotice(notice ?? ""); setGuidedHandoffReference(reference ?? ""); setView("workspace"); }} />;
}

