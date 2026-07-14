import { API_BASE_URL } from "@/config";

export default async function sitemap() {
  const baseUrl = "https://workernear.com";

  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/workers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let workerPages = [];
  let seoPagesMap = new Map();

  try {
    const res = await fetch(`${API_BASE_URL}/workers?limit=1000`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.workers) {
        workerPages = data.workers.map((worker) => {
          // Generate SEO landing pages
          const serviceSlug = worker.profession.toLowerCase().replace(/\s+/g, '-');
          const citySlug = worker.city.toLowerCase().replace(/\s+/g, '-');
          
          let locationSlug = citySlug;
          if (worker.area) {
             const areaSlug = worker.area.toLowerCase().replace(/\s+/g, '-');
             locationSlug = `${areaSlug}-${citySlug}`;
          }

          const seoUrl = `${baseUrl}/${serviceSlug}-in-${locationSlug}`;
          if (!seoPagesMap.has(seoUrl)) {
             seoPagesMap.set(seoUrl, {
                url: seoUrl,
                lastModified: worker.updatedAt ? new Date(worker.updatedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
             });
          }
          
          const cityOnlySeoUrl = `${baseUrl}/${serviceSlug}-in-${citySlug}`;
          if (!seoPagesMap.has(cityOnlySeoUrl)) {
             seoPagesMap.set(cityOnlySeoUrl, {
                url: cityOnlySeoUrl,
                lastModified: worker.updatedAt ? new Date(worker.updatedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
             });
          }

          return {
            url: `${baseUrl}/worker/${worker.slug}`,
            lastModified: worker.updatedAt ? new Date(worker.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          };
        });
      }
    }
  } catch (err) {
    console.error("Error generating sitemap:", err);
  }

  const seoPages = Array.from(seoPagesMap.values());

  return [
    ...staticPages,
    ...seoPages,
    ...workerPages,
  ];
}
