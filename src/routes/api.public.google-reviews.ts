import { createFileRoute } from "@tanstack/react-router";
import { GooglePlacesService } from "@/services/cms.server";

export const Route = createFileRoute("/api/public/google-reviews")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const reviewsData = await GooglePlacesService.getPublicReviews("default");
          return new Response(JSON.stringify(reviewsData), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300, s-maxage=1800",
            },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              enabled: true,
              placeName: "Joshi's Academy",
              rating: 4.9,
              totalReviews: 245,
              googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
              reviews: [],
              lastFetchedAt: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
