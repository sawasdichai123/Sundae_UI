# SUNDAE UI — Figma SVG Wireframes

> **32 SVG files** covering every screen of the SUNDAE Admin Dashboard prototype,
> organized by user role. Each SVG is 1440×900 (desktop viewport).

---

## Color Palette (from `index.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#fffdf0` | Highlight bg |
| `brand-100` | `#fff9cc` | Avatar bg, owner badge |
| `brand-200` | `#fff199` | Chip borders |
| `brand-400` | `#ffd100` | **Primary CTA**, active nav, brand icon |
| `brand-500` | `#e6bc00` | Hover state |
| `brand-700` | `#997d00` | Avatar text, owner text |
| `steel-50` | `#f6f6f7` | Input bg, page bg |
| `steel-100` | `#e8e8ea` | Borders, inactive tabs |
| `steel-200` | `#d1d1d4` | Input stroke |
| `steel-300` | `#a9aaad` | Inactive nav icons |
| `steel-400` | `#7e7f82` | Muted text |
| `steel-500` | `#6a6b6e` | Secondary text |
| `steel-600` | `#545659` | Body text |
| `steel-800` | `#333436` | Card bg dark, headings |
| `steel-900` | `#242527` | Sidebar bg, primary text |

**Font:** Inter + Noto Sans Thai

---

## Folder Structure

```
figma-svg/
├── 00-Public/           ← Auth pages (no login required)
│   ├── Login-SignIn.svg
│   ├── Login-SignUp.svg
│   ├── ForgotPassword-Form.svg
│   ├── ForgotPassword-Sent.svg
│   ├── ResetPassword-Form.svg
│   └── ResetPassword-Expired.svg
│
├── 01-Admin/            ← admin@sundae.local (ณัฐพล วงศ์สุวรรณ)
│   ├── Dashboard.svg
│   ├── KnowledgeBase.svg
│   ├── Bots-List.svg
│   ├── Bots-Edit.svg
│   ├── Inbox.svg
│   ├── Integration.svg
│   ├── Organization.svg
│   ├── Approvals.svg
│   ├── WebChat.svg
│   └── Profile.svg
│
├── 02-Support/          ← support@sundae.local (พิมพ์ใจ ศรีสุข)
│   ├── Dashboard.svg
│   ├── Approvals.svg
│   ├── WebChat.svg
│   ├── Organization.svg
│   └── Profile.svg
│
├── 03-UserOwner/        ← owner@sundae.local (ธนกร เจริญธรรม)
│   ├── Dashboard.svg
│   ├── KnowledgeBase.svg
│   ├── Bots-List.svg
│   ├── Inbox.svg
│   ├── Integration.svg
│   ├── Organization.svg
│   ├── WebChat.svg
│   └── Profile.svg
│
├── 04-UserMember/       ← user@sundae.local (สมชาย ใจดี)
│   ├── WebChat.svg
│   └── Profile.svg
│
├── 05-Pending/          ← pending@sundae.local (วิภาวี รักษ์ดี)
│   └── Lockout.svg
│
└── 06-ApprovedNoOrg/    ← approved@sundae.local (ปิยะ วิชัยดิษฐ)
    ├── CreateOrg-WithInvitation.svg
    └── CreateOrg-WaitingInvitation.svg
```

---

## How to Import into Figma

### Method A — Drag & Drop (fastest)
1. Open Figma → create a new page per role folder
2. Drag-and-drop each `.svg` file onto the Figma canvas
3. Each SVG imports as a frame at 1440×900

### Method B — File > Place Image
1. `File → Place Image` (Ctrl+Shift+K / Cmd+Shift+K)
2. Select multiple SVG files at once
3. Click to place each one on the canvas

### Method C — Copy-Paste SVG Code
1. Open the `.svg` file in a text editor
2. Select all → Copy
3. In Figma, press Ctrl+V / Cmd+V → pastes as editable vectors

### Post-Import Tips
- **Ungroup** the imported SVG to access individual elements
- **Replace fonts**: Figma may not have Inter/Noto Sans Thai — install them or map to similar fonts
- **Convert text**: Thai text may need manual font linking if Noto Sans Thai isn't installed
- **Organize**: Move each imported frame to its own Figma page matching the folder name

---

## Role → Sidebar Nav Mapping

| Role | Nav Items |
|------|-----------|
| **Admin** | Dashboard, Knowledge Base, Bots, Inbox, Integration, Organization, Approvals, Web Chat, Profile |
| **Support** | Approvals, Web Chat, Organization, Profile |
| **User Owner** | Dashboard, Knowledge Base, Bots, Inbox, Integration, Organization, Web Chat, Profile |
| **User Member** | Web Chat, Profile |
| **Pending** | *(no nav — lockout screen)* |
| **Approved No-Org** | *(no dashboard — create-org/invitation screen)* |

---

## Key UI Patterns

- **Sidebar**: 256px wide, `steel-900` (#242527) background
- **Header**: 64px tall, white with bottom border
- **Active nav**: `brand-400/20%` background, `brand-400` text + icon
- **Cards**: 16px border-radius, `#fff` fill, 1px `steel-100` border
- **Buttons**: 12px border-radius, `brand-400` fill for primary CTA
- **Inputs**: 12px border-radius, `steel-50` fill, 1px `steel-200` border
- **Role badges**: pill-shaped (9px radius), color-coded per role
  - Admin: `brand-400` bg / `steel-900` text
  - Support: `#ede9fe` bg / `#7c3aed` text
  - Owner: `brand-100` bg / `brand-700` text
  - Member: `#ecfdf5` bg / `#059669` text
  - Pending: `#fffbeb` bg / `#d97706` text


*Generated from SUNDAE prototype source code analysis — March 2026*
