"use client";

import { WorkflowStepCard } from "@/app/components/workflow-step-card/WorkflowStepCard";
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
  return (
    <div className={styles.workflowContent}>
      {title && description && (
        <div className={styles.header}>
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
      <div className={styles.desktopGrid}>
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
