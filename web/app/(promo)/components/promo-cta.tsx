"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift, ArrowRight } from "lucide-react"

interface PromoCtaProps {
  registerHref: string
}

export function PromoCta({ registerHref }: PromoCtaProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="mb-4"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
          }}
        >
          现在就开始邀请好友
        </h2>
        <p
          className="mb-8 text-sm"
          style={{ color: "var(--color-text-body)" }}
        >
          注册只需 30 秒，邀请一位好友就能赚 ¥20，何乐而不为？
        </p>

        <Link href={registerHref}>
          <Button className="ds-btn-primary h-12 px-8 text-base">
            <Gift className="mr-2 h-5 w-5" />
            免费注册，开始邀请
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
