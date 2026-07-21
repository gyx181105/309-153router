"use client"

import dynamic from "next/dynamic"
import { SectionSkeleton } from "./section-skeleton"

const CodeExample = dynamic(
  () => import("./code-example").then((m) => ({ default: m.CodeExample })),
  { loading: () => <SectionSkeleton className="h-72" /> }
)
const Features = dynamic(
  () => import("./features").then((m) => ({ default: m.Features })),
  { loading: () => <SectionSkeleton className="h-48" /> }
)
const ConsoleSection = dynamic(
  () => import("./console-section").then((m) => ({ default: m.ConsoleSection })),
  { loading: () => <SectionSkeleton className="h-48" /> }
)
const FAQ = dynamic(
  () => import("./faq").then((m) => ({ default: m.FAQ })),
  { loading: () => <SectionSkeleton className="h-56" /> }
)
const CTA = dynamic(
  () => import("./cta").then((m) => ({ default: m.CTA })),
  { loading: () => <SectionSkeleton className="h-36" /> }
)
const Footer = dynamic(
  () => import("@/components/footer").then((m) => ({ default: m.Footer })),
  { loading: () => <SectionSkeleton className="h-24" /> }
)

export function HomeDeferredSections() {
  return (
    <>
      <CodeExample />
      <Features />
      <ConsoleSection />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}
