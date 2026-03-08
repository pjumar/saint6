import type { KeyProjectData } from "@/app/components/key-project-section/KeyProjectSection";
import type { PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import type { TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";
import {
  getStrapiImageUrl,
  type StrapiKeyProject,
  type StrapiPortfolioItem,
  type StrapiServiceItem,
  type StrapiTestimonialItem,
} from "@/app/lib/strapi";
import { aspectRatioToCss } from "@/app/lib/utils";

/**
 * Transform Strapi workflow/service-step data into ServiceCard props.
 *
 * Workflow steps are text-primary items — they still make sense without an
 * image, so missing images are set to `null` rather than filtering the item.
 */
export function transformWorkflow(
  workflow: StrapiServiceItem[] | undefined,
): ServiceCard[] {
  if (!workflow || workflow.length === 0) return [];

  return workflow
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const imageUrl = getStrapiImageUrl(step.image);
      return {
        id: String(step.id),
        imageUrl: imageUrl || "",
        counter: `${String(step.order).padStart(2, "0")}.`,
        title: step.title,
        description: step.description || "",
      };
    });
}

/**
 * Transform Strapi portfolio items into PortfolioItem props.
 * Items without a valid image are skipped.
 */
export function transformPortfolio(
  items: StrapiPortfolioItem[] | undefined,
): PortfolioItem[] {
  if (!items || items.length === 0) return [];

  const result: PortfolioItem[] = [];

  const sorted = [...items].sort((a, b) => {
    const aOrder = a.order || null;
    const bOrder = b.order || null;
    // Items with order come first, sorted ascending
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder;
    if (aOrder !== null) return -1;
    if (bOrder !== null) return 1;
    // No order: sort by updatedAt or createdAt, newest first
    const aDate = a.updatedAt || a.createdAt || "";
    const bDate = b.updatedAt || b.createdAt || "";
    return bDate.localeCompare(aDate);
  });

  sorted.forEach((item) => {
    const imageUrl = getStrapiImageUrl(item.image);
    if (!imageUrl) {
      return;
    }
    result.push({
      id: String(item.id),
      imageUrl,
      category: item.category || "Campaign",
      title: item.title,
      aspectRatio: aspectRatioToCss(item.aspectRatio),
    });
  });

  return result;
}

/**
 * Transform Strapi testimonial data into TestimonialItem props.
 *
 * Testimonials are text-primary — missing brand logos are set to `null`
 * rather than filtering the entire item.
 */
export function transformTestimonials(
  testimonials: StrapiTestimonialItem[] | undefined,
): TestimonialItem[] {
  if (!testimonials || testimonials.length === 0) return [];

  return testimonials
    .sort((a, b) => a.order - b.order)
    .map((testimonial) => {
      const logoUrl = getStrapiImageUrl(testimonial.brand_logo);
      return {
        id: String(testimonial.id),
        logoUrl: logoUrl || "",
        logoAlt:
          testimonial.brand_logo?.alternativeText ||
          testimonial.brand_name ||
          "Brand",
        quote: testimonial.quote,
        authorName: testimonial.author_name,
        authorTitle: testimonial.author_title,
      };
    });
}

/**
 * Transform Strapi key project data into KeyProjectData props.
 * Projects without a valid main image are skipped.
 */
export function transformKeyProjects(
  projects: StrapiKeyProject[] | undefined,
): KeyProjectData[] {
  if (!projects || projects.length === 0) return [];

  const validProjects = projects.filter(
    (p) => getStrapiImageUrl(p.main_image) !== null,
  );
  const paddedTotal = String(validProjects.length).padStart(2, "0");

  return validProjects.map((project, index) => {
    // Safe: validProjects is already filtered to only include projects with valid main images
    const mainImageSrc = getStrapiImageUrl(project.main_image) as string;
    const paddedIndex = String(index + 1).padStart(2, "0");

    return {
      projectNumber: `${paddedIndex}/${paddedTotal}`,
      title: project.title,
      infoText: project.info_text || "",
      team: project.team || [],
      expertise: project.expertise || [],
      client: project.client,
      mainImage: {
        src: mainImageSrc,
        alt: project.main_image?.alternativeText || project.title,
        width: project.main_image?.width || 440,
        height: project.main_image?.height || 297,
      },
      testimonial: project.testimonial
        ? {
            quote: project.testimonial.quote,
            author: project.testimonial.author,
            role: project.testimonial.role,
          }
        : undefined,
      galleryImages:
        project.gallery_images
          ?.map((img) => {
            const src = getStrapiImageUrl(img.image);
            if (!src) return null;
            return {
              src,
              alt: img.alt || "",
              width: img.image?.width || 200,
              height: img.image?.height || 200,
            };
          })
          .filter(
            (
              img,
            ): img is {
              src: string;
              alt: string;
              width: number;
              height: number;
            } => img !== null,
          ) || [],
    };
  });
}
