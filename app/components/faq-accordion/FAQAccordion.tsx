"use client";

import { useState } from "react";
import styles from "./FAQAccordion.module.css";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  defaultExpandedIndex?: number;
}

export function FAQAccordion({
  items,
  defaultExpandedIndex = -1,
}: FAQAccordionProps) {
  // Track expanded state by question string instead of index
  const defaultExpanded =
    defaultExpandedIndex >= 0 && defaultExpandedIndex < items.length
      ? items[defaultExpandedIndex].question
      : null;
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    defaultExpanded,
  );

  const toggleItem = (question: string) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <div className={styles.accordionContainer}>
      {items.map((item) => {
        const isExpanded = expandedQuestion === item.question;
        return (
          <div key={item.question} className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionButton}
              onClick={() => toggleItem(item.question)}
              aria-expanded={isExpanded}
            >
              <span
                className={`${styles.question} ${isExpanded ? styles.questionExpanded : ""}`}
              >
                {item.question}
              </span>
              <span
                className={`${styles.icon} ${isExpanded ? styles.iconExpanded : ""}`}
              >
                {isExpanded ? "−" : "+"}
              </span>
            </button>
            <div
              className={`${styles.accordionContent} ${isExpanded ? styles.contentExpanded : ""}`}
            >
              <div className={styles.answer}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
