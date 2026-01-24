import Image from "next/image";
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

export function ProductionWorkflow({ title, description, steps }: ProductionWorkflowProps) {
  return (
    <div className={styles.workflowContent}>
      {title && description && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      )}
      <div className={styles.stepsGrid}>
        {steps.map((step) => (
          <div key={step.id} className={styles.stepCard}>
            <div className={styles.imageContainer}>
              <Image
                src={step.imageUrl}
                alt={step.title}
                fill
                className={styles.stepImage}
              />
            </div>
            <div className={styles.stepContent}>
              <span className={styles.counter}>{step.counter}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
