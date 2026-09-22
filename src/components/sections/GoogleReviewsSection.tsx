import { useState, useEffect } from "react";
import { Star, ExternalLink, ShieldCheck, Quote } from "lucide-react";
import { GooglePlacesService, type PublicGoogleReviewsPayload } from "@/services/cms.server";

export function GoogleReviewsSection() {
  const [data, setData] = useState<PublicGoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const payload = await GooglePlacesService.getPublicReviews("default");
        setData(payload);
      } catch (err) {
        console.warn("Notice loading Google reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (loading || !data || !data.enabled || data.reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="eyebrow text-violet">GOOGLE VERIFIED REVIEWS</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-800 border border-emerald-200">
                <ShieldCheck className="size-3 text-emerald-600" /> Google Maps API
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              What Parents &amp; Students Say.
            </h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-base">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span>{data.rating}</span>
              </div>
              <span>• Based on {data.totalReviews} verified Google reviews</span>
            </div>
          </div>

          <a
            href={data.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border/90 bg-ivory px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-lavender/60 transition-colors shadow-2xs shrink-0"
          >
            <span>View All Reviews on Google</span>
            <ExternalLink className="size-3.5 text-violet" />
          </a>
        </div>

        {/* Review Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((rev, index) => (
            <div
              key={index}
              className="border border-border/80 bg-ivory/60 p-6 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 size-6 text-violet/10 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-ink/90 leading-relaxed font-normal italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-violet/10 text-violet font-semibold text-xs flex items-center justify-center border border-violet/20">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-ink leading-tight">
                      {rev.authorName}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">Google Reviewer</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground/80 font-medium">
                  {rev.relativeTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
