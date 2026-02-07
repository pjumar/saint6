"use client";

import { WorkflowStepCard } from "@/app/components/workflow-step-card/WorkflowStepCard";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import styles from "./ProductionWorkflow.module.css";

export interface WorkflowStep {
  id: string;
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

interface ProductionWorkflowProps {
  title?: string;
  description?: string;
  steps: WorkflowStep[];
}

export function ProductionWorkflow({
  title,
  description,
  steps,
}: ProductionWorkflowProps) {
  const headerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const desktopGridRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.1,
    delay: 0.15,
  });

  return (
    <div className={styles.workflowContent}>
      {title && description && (
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      )}

      {/* Mobile: Carousel */}
      <div className={styles.mobileCarousel}>
        {steps.map((step) => (
          <div key={step.id} className={styles.stepCard}>
            <WorkflowStepCard
              imageUrl={step.imageUrl}
              counter={step.counter}
              title={step.title}
              description={step.description}
              imageSizes="85vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div ref={desktopGridRef} className={styles.desktopGrid}>
        {steps.map((step) => (
          <div key={step.id} className={styles.stepCard}>
            <WorkflowStepCard
              imageUrl={step.imageUrl}
              counter={step.counter}
              title={step.title}
              description={step.description}
              imageSizes="(max-width: 768px) 100vw, 16vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
