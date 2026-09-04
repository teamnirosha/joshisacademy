# Graph Report - joshisacademy  (2026-09-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 678 nodes · 1124 edges · 86 communities (31 shown, 50 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45a7e574`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- cn
- routeTree.gen.ts
- devDependencies
- compilerOptions
- seoMeta
- types.ts
- utils.ts
- button.tsx
- components.json
- package.json
- server.ts
- Button
- site.ts
- command.tsx
- menubar.tsx
- form.tsx
- carousel.tsx
- dependencies
- __root.tsx
- chart.tsx
- context-menu.tsx
- table.tsx
- breadcrumb.tsx
- navigation-menu.tsx
- toggle-group.tsx
- page-transition.tsx
- alert.tsx
- input-otp.tsx
- faq.tsx
- gallery.tsx
- avatar.tsx
- results.tsx
- sonner.tsx
- class-variance-authority
- clsx
- date-fns
- embla-carousel-react
- @hookform/resolvers
- input-otp
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-avatar
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- @radix-ui/react-label
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react
- react-day-picker
- react-dom
- react-resizable-panels
- recharts
- sonner
- @supabase/supabase-js
- tailwind-merge
- tailwindcss
- @tailwindcss/vite
- @tanstack/react-query
- @tanstack/react-router
- @tanstack/react-start
- @tanstack/router-plugin
- tw-animate-css
- vaul
- vite-tsconfig-paths
- zod

## God Nodes (most connected - your core abstractions)
1. `cn()` - 220 edges
2. `compilerOptions` - 22 edges
3. `seoMeta()` - 21 edges
4. `FileRoutesByPath` - 18 edges
5. `Button` - 17 edges
6. `PageHero()` - 11 edges
7. `buttonVariants` - 9 edges
8. `scripts` - 7 edges
9. `renderErrorPage()` - 6 edges
10. `site` - 6 edges

## Surprising Connections (you probably didn't know these)
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `AlertDescription` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert.tsx → src/lib/utils.ts
- `AlertTitle` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert.tsx → src/lib/utils.ts
- `AlertDialogContent` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogDescription` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (86 total, 50 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.06
Nodes (40): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+32 more)

### Community 1 - "cn"
Cohesion: 0.08
Nodes (37): AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, CardDescription, CardFooter, CardHeader (+29 more)

### Community 2 - "routeTree.gen.ts"
Cohesion: 0.06
Nodes (38): getRouter(), Route, Route, Route, Route, Route, Route, AboutRoute (+30 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (35): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @lovable.dev/vite-tanstack-config (+27 more)

### Community 4 - "compilerOptions"
Cohesion: 0.06
Nodes (31): DOM, DOM.Iterable, ES2022, eslint.config.js, src/**/*.ts, src/**/*.tsx, vite/client, vite.config.ts (+23 more)

### Community 5 - "seoMeta"
Cohesion: 0.12
Nodes (11): Crumbs(), PageHero(), seoMeta(), facultyStandards, Route, Route, Route, categories (+3 more)

### Community 6 - "types.ts"
Cohesion: 0.10
Nodes (23): attachSupabaseAuth, createSupabaseFetch(), isNewSupabaseApiKey(), requireSupabaseAuth, createSupabaseClient(), createSupabaseFetch(), isNewSupabaseApiKey(), createSupabaseAdminClient() (+15 more)

### Community 7 - "utils.ts"
Cohesion: 0.08
Nodes (14): Badge(), BadgeProps, badgeVariants, Checkbox, HoverCardContent, PopoverContent, Progress, RadioGroup (+6 more)

### Community 8 - "button.tsx"
Cohesion: 0.12
Nodes (20): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+12 more)

### Community 9 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 10 - "package.json"
Cohesion: 0.11
Nodes (18): @oxc-parser/binding-win32-x64-msvc, name, optionalDependencies, @oxc-parser/binding-win32-x64-msvc, @rolldown/binding-win32-x64-msvc, overrides, rolldown, private (+10 more)

### Community 11 - "server.ts"
Cohesion: 0.18
Nodes (13): consumeLastCapturedError(), describeError(), describeStatus(), originalConsoleError, safeStringify(), renderErrorPage(), fetch(), getServerEntry() (+5 more)

### Community 12 - "Button"
Cohesion: 0.15
Nodes (9): BrandLoader(), EnquiryDialog(), FormData, initialForm, navItems, Button, announcement, site (+1 more)

### Community 13 - "site.ts"
Cohesion: 0.20
Nodes (12): approach, articles, CourseItem, courses, galleryItems, methodology, results, scienceDisciplines (+4 more)

### Community 14 - "command.tsx"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 15 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 16 - "form.tsx"
Cohesion: 0.19
Nodes (12): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+4 more)

### Community 17 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 18 - "dependencies"
Cohesion: 0.15
Nodes (13): cmdk, lucide-react, dependencies, cmdk, lucide-react, @radix-ui/react-checkbox, @radix-ui/react-progress, @radix-ui/react-slot (+5 more)

### Community 19 - "__root.tsx"
Cohesion: 0.22
Nodes (6): SiteShell(), LovableErrorOptions, LovableEvents, reportLovableError(), Window, ErrorComponent()

### Community 20 - "chart.tsx"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 21 - "context-menu.tsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 22 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 23 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 24 - "navigation-menu.tsx"
Cohesion: 0.29
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 25 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 26 - "page-transition.tsx"
Cohesion: 0.40
Nodes (3): DualRingSpinner(), DualRingSpinnerProps, Phase

### Community 27 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 28 - "input-otp.tsx"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 30 - "gallery.tsx"
Cohesion: 0.40
Nodes (3): GalleryItem, items, Route

### Community 31 - "avatar.tsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **203 isolated node(s):** `SheetContentProps`, `SidebarContextProps`, `ServerEntry`, `FormData`, `CourseItem` (+198 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 247 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `sidebar.tsx`, `utils.ts`, `button.tsx`, `Button`, `command.tsx`, `menubar.tsx`, `form.tsx`, `carousel.tsx`, `chart.tsx`, `context-menu.tsx`, `table.tsx`, `breadcrumb.tsx`, `navigation-menu.tsx`, `toggle-group.tsx`, `alert.tsx`, `input-otp.tsx`, `avatar.tsx`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **Why does `Button` connect `Button` to `sidebar.tsx`, `cn`, `results.tsx`, `seoMeta`, `button.tsx`, `site.ts`, `carousel.tsx`, `faq.tsx`, `gallery.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`, `class-variance-authority`, `clsx`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `input-otp`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-label`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-dom`, `react-resizable-panels`, `recharts`, `sonner`, `@supabase/supabase-js`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `@tanstack/react-query`, `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`, `tw-animate-css`, `vaul`, `vite-tsconfig-paths`, `zod`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `SheetContentProps`, `SidebarContextProps`, `ServerEntry` to the rest of the system?**
  _203 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05735430157261795 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._
- **Should `routeTree.gen.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0627177700348432 - nodes in this community are weakly interconnected._