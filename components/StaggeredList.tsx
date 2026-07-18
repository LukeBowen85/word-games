"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type StaggeredListProps = {
  children: ReactNode;
  className?: string;
};

export function StaggeredList({
  children,
  className = "",
}: StaggeredListProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.07,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggeredItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggeredItem({
  children,
  className = "",
}: StaggeredItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 14,
              scale: 0.985,
            },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}