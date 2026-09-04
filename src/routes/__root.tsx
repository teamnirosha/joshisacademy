import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteShell } from "../components/site-shell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-ink">404</h1>
        <h2 className="mt-4 font-display text-2xl text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-violet px-6 py-3 text-xs uppercase font-bold tracking-wider text-ivory transition-colors hover:bg-violet/90"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          This page encountered an error
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something unexpected occurred while loading the page. You can try refreshing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-violet px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ivory transition-colors hover:bg-violet/90 cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-border bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-lavender/40"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Joshi’s Academy — Best Science Coaching Classes in Kharadi, Pune" },
      {
        name: "description",
        content:
          "Specialist CBSE & ICSE Science coaching for Classes 9 & 10 in Kharadi, Pune. Serving Chandan Nagar, Wagholi, Viman Nagar & Mundhwa. Concept-first teaching & 90%+ board results.",
      },
      { name: "author", content: "Joshi’s Academy" },
      { name: "keywords", content: "coaching classes in Kharadi, science tuition Kharadi, CBSE 10th science coaching, ICSE science classes Kharadi, tuition classes near Chandan Nagar, science tuition Wagholi, Viman Nagar coaching classes, Mundhwa science tuition" },
      { property: "og:title", content: "Joshi’s Academy — Best Science Coaching in Kharadi, Pune" },
      {
        property: "og:description",
        content:
          "Specialist CBSE & ICSE Science coaching for Classes 9 & 10 in Kharadi, Pune. Small batches, concept-first teaching, and verified 90%+ board results.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://joshisacademy.com/brand/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-MH" },
      { name: "geo.placename", content: "Kharadi, Pune" },
      { name: "geo.position", content: "18.5515;73.9468" },
      { name: "ICBM", content: "18.5515, 73.9468" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["EducationalOrganization", "LocalBusiness"],
          name: "Joshi’s Academy",
          alternateName: ["Gyan Ki Varsha", "Joshi's Coaching Classes Kharadi"],
          url: "https://joshisacademy.com",
          logo: "https://joshisacademy.com/brand/logo.png",
          image: "https://joshisacademy.com/brand/logo.png",
          description:
            "Specialist CBSE and ICSE Science coaching for Classes IX and X in Kharadi, Pune, serving Chandan Nagar, Wagholi, Viman Nagar, Mundhwa, Keshav Nagar, and Hadapsar.",
          telephone: "+917030554317",
          priceRange: "₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Kharadi",
            addressLocality: "Kharadi, Pune",
            addressRegion: "Maharashtra",
            postalCode: "411014",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 18.5515,
            longitude: 73.9468,
          },
          hasMap: "https://maps.google.com/maps?ftid=0xda91b9aaa8e08e7:0xa2245a5b43016f88",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "14:00",
              closes: "21:00",
            },
          ],
          areaServed: [
            { "@type": "AdministrativeArea", name: "Kharadi, Pune" },
            { "@type": "AdministrativeArea", name: "Chandan Nagar, Pune" },
            { "@type": "AdministrativeArea", name: "Wagholi, Pune" },
            { "@type": "AdministrativeArea", name: "Viman Nagar, Pune" },
            { "@type": "AdministrativeArea", name: "Mundhwa, Pune" },
            { "@type": "AdministrativeArea", name: "Keshav Nagar, Pune" },
            { "@type": "AdministrativeArea", name: "Hadapsar, Pune" },
            { "@type": "AdministrativeArea", name: "Vadgaon Sheri, Pune" },
            { "@type": "AdministrativeArea", name: "Kalyani Nagar, Pune" },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "48",
            bestRating: "5",
            worstRating: "1",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteShell>
        <Outlet />
      </SiteShell>
    </QueryClientProvider>
  );
}
