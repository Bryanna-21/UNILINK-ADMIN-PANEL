# UniLink Admin Panel - Rebuild Documentation

## Overview
The admin panel has been completely rebuilt to implement a proper role hierarchy with superadmin capabilities, profile management, and perspective-switching functionality.

---

## 🎯 Key Changes

### 1. **Authentication & Authorization**

#### Auth Store (`src/store/auth.store.ts`)
- ✅ Added `superadmin` role type to `AuthUser` interface
- ✅ New `ViewAsSession` interface for tracking view-as sessions
- ✅ New store methods:
  - `startViewAs(role)` - Begin viewing as student/lecturer
  - `endViewAs()` - Return to original admin view
- ✅ Session persistence via localStorage

#### Login Page (`src/app/login/page.tsx`)
- ✅ Modified role check to accept both `admin` AND `superadmin`
- ✅ Non-admin/superadmin users redirected to `/unauthorized`

---

### 2. **UI Components**

#### New: Profile Menu (`src/components/common/profile-menu.tsx`)
Dropdown menu replacing static profile display with:
- User info summary
- Settings link
- View As option
- Logout button
- Click-outside detection for auto-close

#### New: View As Modal (`src/components/common/view-as-modal.tsx`)
Allows admin/superadmin to switch perspective:
- Choose between Student or Lecturer view
- Shows elapsed time in current perspective
- Return to Admin View button
- Non-destructive (doesn't affect actual data)

#### Updated Topbar (`src/components/layout/topbar.tsx`)
- Replaced static profile card with `<ProfileMenu />` component
- Added view-as indicator badge when active
- Integrated `<ViewAsModal />`
- Cleaner, more functional design

#### Updated Sidebar (`src/components/layout/sidebar.tsx`)
- Removed logout button (moved to profile menu)
- Added role-gated navigation
- Different menu structures for admin vs superadmin:
  - **Admin**: Dashboard, Students, Users, Universities, Analytics, Reports, Audit Logs, Notifications, System Health
  - **Superadmin**: Admin Management, Units, + all admin links
- Added "SUPER" badge indicator for superadmin
- "NEW" badges on new features for superadmin

---

### 3. **Superadmin-Exclusive Pages**

#### Admin Management (`src/app/admins/page.tsx`)
**Route**: `/admins`

Superadmin-only interface for managing administrator accounts:

**Features**:
- List all admins with: Name, Email, University, Status, Created Date
- Create new admin accounts
- Edit existing admin details
- Delete admin accounts
- Modal-based form UI
- Real-time mutations via React Query
- Endpoints called:
  - `GET /admin/admins` - List all
  - `POST /admin/admins` - Create
  - `PUT /admin/admins/:id` - Update
  - `DELETE /admin/admins/:id` - Delete

**Fields**:
- Name (required)
- Email (required)
- University ID (optional - constrains admin to specific university)

**Access Control**:
- Only superadmins can access
- Regular admins see "Access Denied" message

---

#### Units Management (`src/app/units/page.tsx`)
**Route**: `/units`

Superadmin-only interface for managing academic units/courses:

**Features**:
- List all units with: Code, Name, Credits, University, Status
- Create new units
- Edit existing units
- Delete units
- Rich form with code, name, description, credits, university
- Status indicator (active/inactive)
- Modal-based interface
- Endpoints called:
  - `GET /admin/units` - List all
  - `POST /admin/units` - Create
  - `PUT /admin/units/:id` - Update
  - `DELETE /admin/units/:id` - Delete

**Fields**:
- Code (required, e.g., "CS101")
- Name (required)
- Description (optional, textarea)
- Credits (1-6, default 3)
- University ID (optional)

**Access Control**:
- Only superadmins can access
- Regular admins see "Access Denied" message

---

#### Enhanced Universities (`src/app/universities/page.tsx`)
**Route**: `/universities`

Enhanced from original to support superadmin:

**New Features**:
- Superadmin can add new universities
- Modal form for adding universities
- Fields: Name, Email, Country
- Endpoints:
  - `GET /admin/universities` (existing)
  - `POST /admin/universities` (new for superadmin)
- All existing university verification features preserved

**Access Control**:
- Add University button only visible to superadmin
- Regular admins can still view/verify universities

---

## 🔄 View As Workflow

### How It Works

1. **Admin clicks profile menu** → "View As..." option
2. **Modal opens** with role selection:
   - View as Student
   - View as Lecturer
3. **Selected role triggers**:
   - `startViewAs(role)` in auth store
   - Session saved to localStorage with: `asRole`, `originalRole`, `startTime`
   - Modal closes
4. **Topbar shows badge**: "Viewing as student" (example)
5. **Return to Admin View button** in modal (if already viewing as):
   - `endViewAs()` in auth store
   - Session cleared
6. **Session persists** across page refreshes
7. **Logout automatically** clears view-as session

### Implementation Details

```typescript
// Auth store tracks both states
interface ViewAsSession {
  asRole: "student" | "lecturer" | null;
  originalRole: "admin" | "superadmin";
  startTime: number;
}

// Frontend can check current perspective
const viewAs = useAuthStore((state) => state.viewAs);
if (viewAs?.asRole === "student") {
  // Show student-specific UI
}
```

**Important**: This is purely UI-side perspective switching. The backend should respect the actual user's role for data access. This feature is for admins to understand the user experience.

---

## 🛠️ Backend Requirements

### Required API Endpoints

**Admin Management**:
```
POST   /admin/admins
GET    /admin/admins
PUT    /admin/admins/:id
DELETE /admin/admins/:id
```

**Units Management**:
```
POST   /admin/units
GET    /admin/units
PUT    /admin/units/:id
DELETE /admin/units/:id
```

**Universities Enhancement**:
```
POST   /admin/universities
```

### Expected Response Formats

**List Admins**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "universityId": "...",
      "university": "...",
      "status": "active",
      "createdAt": "2026-09-07T..."
    }
  ]
}
```

**List Units**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "...",
      "code": "CS101",
      "name": "...",
      "description": "...",
      "credits": 3,
      "universityId": "...",
      "university": "...",
      "status": "active",
      "createdAt": "2026-09-07T..."
    }
  ]
}
```

### Database Model Updates Needed

**Admin Collection** (if not already existing):
```javascript
{
  id: ObjectId,
  name: String,
  email: String,
  universityId: ObjectId,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

**Units Collection**:
```javascript
{
  id: ObjectId,
  code: String,
  name: String,
  description: String,
  credits: Number,
  universityId: ObjectId,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📋 Role Hierarchy

### Superadmin
- **Can do**: Everything an admin can do + manage other admins + manage units + add universities
- **Access to**:
  - Dashboard
  - Admin Management (NEW)
  - Units Management (NEW)
  - Universities (enhanced add capability)
  - Students
  - Users
  - Analytics
  - Reports
  - Audit Logs
  - Notifications
  - System Health
- **View As**: Can switch to student/lecturer perspective

### Admin
- **Can do**: Manage students, users, view analytics/reports, manage notifications
- **Access to**:
  - Dashboard
  - Students
  - Users
  - Universities (view/verify only)
  - Analytics
  - Reports
  - Audit Logs
  - Notifications
  - System Health
- **View As**: Can switch to student/lecturer perspective
- **Cannot**: Create/edit/delete other admins, create/manage units, add universities

---

## 🎨 Design Notes

### Color & Status Badges
- **Active**: Green badge (`bg-success/10 text-success`)
- **Inactive**: Orange badge (`bg-warning/10 text-warning`)
- **Superadmin indicator**: Accent color badge ("SUPER")
- **New features**: Accent "NEW" badge on sidebar

### Empty States
- Custom icons per page type (BookOpen for units, UserCog for admins, Building2 for universities)
- Helpful messaging directing superadmin to create content

### Loading & Error Handling
- Skeleton loaders for list views
- Error states with retry buttons
- Modal validation (buttons disabled until required fields filled)
- Mutation state handled in buttons ("Creating...", "Updating..." feedback)

### Accessibility
- Proper `aria-label` attributes on icon buttons
- Semantic HTML (tables with thead/tbody)
- Keyboard navigation for dropdowns
- Focus states on all interactive elements

---

## 🚀 Deployment Checklist

- [ ] Backend APIs implemented for `/admin/admins`, `/admin/units`, `/admin/universities` (POST)
- [ ] Database models created/updated
- [ ] CORS configured if admin panel on different domain
- [ ] Superadmin user role created in auth system
- [ ] Role checks implemented on backend (don't trust frontend role claims)
- [ ] Audit logging for admin/unit CRUD operations
- [ ] Error boundaries tested (network failures, permission errors)
- [ ] View As feature tested (session persistence, logout behavior)
- [ ] Dark mode tested across all new components
- [ ] Mobile responsiveness tested (sidebar, modals, tables)
- [ ] Build tested: `npm run build` produces no errors
- [ ] Environment variables set (NEXT_PUBLIC_API_URL)

---

## 🔐 Security Considerations

1. **Frontend role display is cosmetic** - Always validate roles on backend
2. **View As doesn't grant permissions** - It's purely for UX understanding
3. **Token refresh** - Ensure JWT refresh works correctly
4. **CORS** - If API on different domain, configure properly
5. **Audit logging** - Log all admin CRUD operations to `/admin/audit-logs`
6. **Permission guards** - Backend must verify user role before allowing admin/unit operations

---

## 📦 Files Modified/Created

### Created
- `src/components/common/profile-menu.tsx` - Profile dropdown
- `src/components/common/view-as-modal.tsx` - View as perspective switcher
- `src/app/admins/page.tsx` - Admin management (superadmin-only)
- `src/app/units/page.tsx` - Units management (superadmin-only)
- `REBUILD_NOTES.md` - This file

### Modified
- `src/store/auth.store.ts` - Added superadmin role + view-as session
- `src/app/login/page.tsx` - Accept superadmin role
- `src/components/layout/topbar.tsx` - Integrated profile menu + view-as
- `src/components/layout/sidebar.tsx` - Role-gated navigation
- `src/app/universities/page.tsx` - Added add university for superadmin

### Unchanged (Still Working)
- All existing pages (dashboard, students, users, analytics, reports, etc.)
- Authentication flow
- Socket.io integration
- Theme switching
- Notification system

---

## 🧪 Testing Recommendations

1. **Login as admin** - Verify dashboard loads, no admin/units pages visible
2. **Login as superadmin** - Verify all pages accessible including new ones
3. **Create admin** - Use admin management page, verify appears in list
4. **Create unit** - Use units page, verify appears in list
5. **View As Student** - Click profile menu → View As → Select Student → Check topbar badge
6. **Refresh while viewing as** - Session should persist
7. **Logout while viewing as** - Session should clear
8. **Delete via dropdown** - Test confirmation dialog
9. **Edit** - Change values, verify mutation works
10. **Search/Filter** - Verify search still works on universities
11. **Dark mode** - New components should follow theme
12. **Mobile** - Sidebar, modals, tables should be responsive
13. **Permissions** - Try accessing `/admins` as regular admin (should show access denied)
14. **Build** - `npm run build` should complete without errors

---

## ⚠️ Known Limitations & Future Work

1. **View As** is client-side only - Backend doesn't know about it
   - If your UX requires backend-aware role switching, additional API endpoint needed
2. **No password reset** in admin/units flows (noted in settings already)
3. **No bulk operations** yet (delete multiple, edit multiple)
4. **Units** don't have lecturer assignment yet
5. **No audit trail** for who made admin/unit changes (needs backend logging)
6. **CSV export** not implemented for lists (would need new endpoints)

---

## 🎓 How This Addresses Your Requirements

✅ **Rebuild admin panel** - Complete overhaul with proper structure  
✅ **View as feature** - Admin can switch to student/lecturer perspective  
✅ **Superadmin role** - New highest-privilege role  
✅ **Admin management** - Superadmin can create/edit/delete admins  
✅ **Units management** - Superadmin can manage academic units  
✅ **Universities** - Enhanced to allow superadmin to add universities  

---

## 📞 Questions/Issues

When adding the backend APIs:
1. Should non-assigned admins see all universities or only their assigned one?
2. Should units auto-assign to admins or is that manual via users page?
3. Do you want audit logging for who created/deleted admins/units?
4. Any fields missing from admin/units forms?

---

**Built with**: Next.js 15, React 18, Tailwind CSS 3, Zustand, React Query, Socket.io  
**Status**: Ready for backend API integration  
**Last updated**: 7 September 2026
