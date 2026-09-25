"use client";

export default function AboutWindow() {
  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#000", padding: 4 }}>
      {/* Profile header */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16, padding: 12, background: "#f0f0f0", border: "2px inset #808080" }}>
        <div style={{
          width: 72, height: 72, background: "#000080", flexShrink: 0,
          border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36
        }}>
          👤
        </div>
        <div>
          <div style={{ fontSize: 20, fontFamily: "'VT323', monospace", color: "#000080", marginBottom: 4 }}>
            ZANE TOUFAILI
          </div>
          <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>
            📍 Seattle, WA<br />
            📧 zane.toufaili@gmail.com<br />
            🔗 github.com/NotABot122
          </div>
        </div>
      </div>

      <Section title="ABOUT ME">
        <p style={{ lineHeight: 1.8 }}>
          Hi! I&apos;m Zane, a Computer Science student at the University of Washington&apos;s Allen School
          with hands-on experience across software development, applied AI research, accessibility-focused
          open source, and robotics/computer vision. I love building technically rigorous applications and
          contributing to impactful engineering teams. Currently seeking software engineering internship
          opportunities.
        </p>
      </Section>

      <Section title="EDUCATION">
        <ExpItem
          role="B.S. Computer Science — Paul G. Allen School"
          company="University of Washington · Seattle, WA"
          period="Sep 2025 – Dec 2028"
          description="Currently enrolled in the Allen School for Computer Science."
        />
        <ExpItem
          role="High School Diploma"
          company="Henry M. Jackson High School · Mill Creek, WA"
          period="Sep 2021 – Jun 2025"
          description="3.98 unweighted GPA. 15 AP courses, 3 College-in-the-High-School courses, and 1 Everett Community College course."
        />
      </Section>

      <Section title="CAREER GOALS">
        <p style={{ lineHeight: 1.8 }}>
          I&apos;m looking for a software engineering internship where I can build rigorous, real-world
          software and keep growing as an engineer. I&apos;m especially drawn to applied AI/ML, computer
          vision, and full-stack product work — and to teams that care about accessibility and building
          things that genuinely help people.
        </p>
      </Section>

      <Section title="SKILLS">
        <SkillGroup label="Languages" skills={["C", "C++", "Java", "Python", "TypeScript", "JavaScript"]} />
        <SkillGroup label="Web & App Dev" skills={["React", "React Native (Expo)", "Next.js", "Android Studio", "OpenGL"]} />
        <SkillGroup label="Backend & Data" skills={["Supabase", "Trigger.dev", "Hono", "Google Calendar API", "AsyncStorage"]} />
        <SkillGroup label="AI & Computer Vision" skills={["OpenCV", "MediaPipe", "AprilTag Pipelines", "Applied AI/ML"]} />
        <SkillGroup label="Tools" skills={["Git", "VS Code", "Kaggle"]} />
      </Section>

      <Section title="EXPERIENCE">
        <ExpItem
          role="Undergraduate Researcher — Summer REU, Artificial Intelligence"
          company="University of Washington"
          period="Jun 2026 – Present"
          description="Selected for a Summer Research Experience for Undergraduates in AI, working through a structured curriculum covering core machine learning and AI concepts. Authoring a comprehensive report synthesizing coursework and critically analyzing an AI research paper under development by the lab."
        />
        <ExpItem
          role="Undergraduate Contributor"
          company="Make4All Lab, University of Washington"
          period="Mar 2026 – Jun 2026"
          description="Developed improvements for open-source accessibility projects to expand usability for users with disabilities. Credited as a contributor on a formal experience report detailing contributions, methodology, and accessibility findings."
        />
        <ExpItem
          role="Committee Member"
          company="UW Budget Advisory Committee"
          period="Sep 2025 – Jun 2026"
          description="Reviewed multi-million-dollar operating budgets for auxiliary services, housing, dining, and facilities — evaluating debt constraints, inflation, and cost drivers alongside professional mentoring staff."
        />
        <ExpItem
          role="Software / Computer Vision — Team 2910"
          company="Jackson High School Robotics"
          period="Oct 2022 – Jun 2025"
          description="1st place at the FRC World Championship among 3,700+ teams. Built a Java AprilTag vision pipeline with PhotonVision and OpenCV for real-time robot localization (<3 in error), and created an Android app for scouting competing robots."
        />
        <ExpItem
          role="Software Engineering Intern"
          company="Remmie Inc."
          period="Aug 2023 – Sep 2023"
          description="Helped define, develop, and integrate an AI model into an Android application using Java."
        />
      </Section>

      <Section title="HIGHLIGHTS">
        <ul style={{ lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
          <li>🏆 FRC World Champion — 1st of 3,700+ teams</li>
          <li>🥇 FBLA: 1st in Web Design &amp; 1st in Marketing (Regionals, 2024 &amp; 2025); qualified for State &amp; Nationals twice; earned the chapter $2,000 in sponsorship</li>
          <li>🤖 TSA: 1st at State in Animatronics (2024 &amp; 2025), qualifying for Nationals</li>
          <li>💻 CS Honor Society Competition Director — organized hackathons and tutored members in Python</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        background: "#000080", color: "#fff", padding: "2px 8px",
        fontSize: 12, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1
      }}>
        ▌ {title}
      </div>
      <div style={{ paddingLeft: 8 }}>{children}</div>
    </div>
  );
}

function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: "#000080", fontWeight: "bold", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {skills.map(skill => (
          <span key={skill} style={{
            background: "#000080", color: "#fff", padding: "2px 8px",
            fontSize: 11, fontFamily: "'Share Tech Mono', monospace"
          }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExpItem({ role, company, period, description }: { role: string; company: string; period: string; description: string }) {
  return (
    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px dotted #ccc" }}>
      <div style={{ fontWeight: "bold", fontSize: 13 }}>{role}</div>
      <div style={{ color: "#000080", fontSize: 12 }}>{company} &nbsp;|&nbsp; <span style={{ color: "#666" }}>{period}</span></div>
      <div style={{ marginTop: 4, lineHeight: 1.7, color: "#333" }}>{description}</div>
    </div>
  );
}
