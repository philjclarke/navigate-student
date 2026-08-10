# Navigate Student Site — Structure & Component Audit
Captured from: login.navigate.uk.com (authenticated student view)

## 1. Global Shell (present on every page)

### Top bar
- Left: Navigate logo + "The Education Company" partner logo (links to Home)
- Right: user avatar (initials) + name, "Logout" link, both linking to /StudentProfile/Edit
- Far right: "Message my Tutor" mail icon — opens a flyout (see Flyouts below)

### Left sidebar (fixed, teal background, icon + label nav)
- Home — /StudentHome/Index
- Timeline — /StudentTimeline/Timeline
- Skills — /StudentSkillFocus/SkillsFocus
- Placements — /StudentPlacement/Placements
- Opportunities — /StudentOpportunities/AllOpportunities
- Targets — /StudentTarget/Targets
- My Future — /StudentFutures/Dashboard
- Profile — /StudentProfile/Edit
- Digital CV — /StudentDigitalCv/Dashboard
- Collapse-arrow toggle at bottom of sidebar
- Floating circular "+" button below nav — opens Accessibility widget (see below)

### Footer
- Simple text bar: "© 2014 - 2026 Navigation Learning"

### Persistent floating elements
- NavBot chat launcher (bottom-right circular icon) — opens small chat panel titled "NavBot / Ask a question about using Navigate," with message history area, text input, and mic icon
- Accessibility widget (bottom-left "+") — third-party-style overlay panel with Simple Mode/XL Size/Voice toggles, and sections for Reading (dyslexia font, text spacing, dictionary, focus mode, reading guide/mask), Vision (contrast, colour theme/overlay), etc. Likely a bundled plugin rather than custom-built — confirm with Navigate whether to re-embed same widget or rebuild.

## 2. Modals / Flyouts (shared pattern: right-side slide-in panel over dimmed backdrop, header with icon+title, close via X or "Close" button top-right)

- **Message my Tutor** flyout: Subject field, message textarea, "Send this message" button. Simplest flyout — good template for lightweight forms.
- **Add a New Activity** flyout (Timeline page): wider panel, contains a date field, hour/minute steppers with computed duration display, Yes/No toggle pair ("Did you find this activity useful?"), a select dropdown, and a rich-text editor toolbar (Format, bold, lists, indent/outdent, link, undo). This is the most complex flyout captured — good reference for any form needing rich text.
- **Edit Placement** page (not a flyout, but a similar detail-edit template at /StudentPlacement/Edit/{id}): read-only employer fields, editable dropdowns (Placement type, Location type, Submit for review to), a description textarea, and a calendar date-picker with a running list of selected dates/times each with a delete icon.

## 3. Recurring UI components
- Card pattern: white rounded-corner cards on pale teal page backgrounds
- Circular progress "ring" stat components (used for hours tracking)
- Status pill badges: Pending / Active / Viewed / Not viewed / Complete
- Two-button pattern: solid teal primary action + white/outline secondary action
- Custom (non-native) select/dropdown components, e.g. "Filter items" on My Future dashboard — options: All / Not viewed / Viewed / Targets
- Tabbed content panels (see Career detail page below)

## 4. Page-by-page site map

| Section | URL | Notes |
|---|---|---|
| Home | /StudentHome/Index | Welcome banner, "next destination," 4 activity-hour rings, promo card, My Opportunities table, My Timeline feed, plus My Skills/My Placements/My Targets summary cards below the fold |
| Timeline | /StudentTimeline/Timeline | Activity feed list; "Add Activity" opens flyout described above |
| Skills | /StudentSkillFocus/SkillsFocus | Skills-in-progress list, next-destination card, assessments table (Continue/Remove/View Results) |
| Placements | /StudentPlacement/Placements | Grouped: In Progress / Pending / Not Started, each a card with sub-task rows (details, checklist, journal, feedback); "Edit" opens detail form |
| Opportunities | /StudentOpportunities/AllOpportunities | Application-status summary tiles + list; detail page at /StudentOpportunities/Opportunity/{id} shows description, task list, sidebar of skills/dates/deadline |
| Targets | /StudentTarget/Targets | Card grid: Overdue / In Progress / Submitted for Review / Completed |
| My Future | /StudentFutures/Dashboard | See Section 5 below |
| Profile | /StudentProfile/Edit | Activity-hour rings repeated, details form (name/username), email/password change forms, "skills focus" tag list with add/remove |
| Digital CV | /StudentDigitalCv/Dashboard | 5-step progress tracker: Make a great first impression, My Skills, Work Experience, Tell your story, Share your Digital CV — each with own status/CTA |

## 5. /StudentFutures/ area — detailed breakdown

### Dashboard — /StudentFutures/Dashboard
- Intro banner with illustration and "Filter items" custom dropdown (All / Not viewed / Viewed / Targets)
- Grid of career-suggestion cards, each tagged with a status pill (Viewed / Not viewed / N Targets)
- Right sidebar: "Go to the Careers Bank" button + "Recommended for you" panel (image cards)

### Careers Bank — /StudentFutures/CareerBank
- Search bar + Search button (confirmed functional — re-renders grid client-side, e.g. searching "teacher" returns Dance Teacher, EFL Teacher, SEN Teacher, Headteacher, PE Teacher, etc.)
- Responsive 3-column card grid: photo, title, "Careers" tag/button, then qualification level / salary / competition / demand mini-stats
- "Go to My Future Dashboard" button top-right

### Career detail page — /StudentFutures/Content/{id}?type=CAREER
- Top bar: career title (with icon), "Back" and "Career on Dashboard" buttons
- Left column: photo, summary paragraph, stats box (Qualification level, Typical salary, Competition for places, Demand for this role)
- Right column: 4-tab panel —
  1. **Is it for me?** — "this could be the job for you if…" bullet list + "Things to consider" sub-sections
  2. **What training will I need?** — qualification callout box, minimum qualifications text, "Related interests" checklist, "Top tip" callout box
  3. **What can I expect?** — descriptive paragraphs plus Hours / Location / Type of work sub-sections, each with checklist tags
  4. **Explore further** — related-career cards (same mini-card format as Careers Bank) + "Useful links" block