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
  const [expandedIndex, setExpandedIndex] = useState(defaultExpandedIndex);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className={styles.accordionContainer}>
      {items.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            type="button"
            className={styles.accordionButton}
            onClick={() => toggleItem(index)}
            aria-expanded={expandedIndex === index}
          >
            <span className={styles.question}>{item.question}</span>
            <span
              className={`${styles.icon} ${expandedIndex === index ? styles.iconExpanded : ""}`}
            >
              {expandedIndex === index ? "−" : "+"}
            </span>
          </button>
          <div
            className={`${styles.accordionContent} ${expandedIndex === index ? styles.contentExpanded : ""}`}
          >
            <div className={styles.answer}>{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
