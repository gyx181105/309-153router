"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "OptRouter 与直接调用 OpenAI API 有什么区别？",
    answer:
      "OptRouter 完全兼容 OpenAI API 格式，您只需更改 baseURL 即可无缝切换。除此之外，OptRouter 提供智能路由（自动选择最优模型）、自动 fallback（故障自动切换）、统一计费、用量统计等增值功能，帮助您降低成本、提升稳定性。",
  },
  {
    question: "支持哪些 AI 模型？",
    answer:
      "目前支持 OpenAI（GPT-4o、GPT-4 Turbo 等）、Anthropic（Claude 3.5 Sonnet 等）、Google（Gemini Pro）、DeepSeek、Qwen 等主流模型。我们会持续接入更多供应商和模型。",
  },
  {
    question: "如何开始使用？",
    answer:
      "注册账号后，系统会自动为您分配 API Key。将代码中的 baseURL 替换为 OptRouter 的地址，即可开始使用。整个过程不到 30 s 。",
  },
  {
    question: "计费方式是怎样的？",
    answer:
      "按实际使用量计费，不同模型价格不同。您可以在仪表板中查看详细的用量统计和费用明细。注册即送免费额度，无需信用卡。",
  },
  {
    question: "数据安全有保障吗？",
    answer:
      "我们不会存储您的对话内容，所有请求通过加密通道透传到上游模型供应商。API Key 采用哈希存储，支持企业级权限管理和数据隔离。",
  },
  {
    question: "智能路由是如何工作的？",
    answer:
      "OptRouter 的网关会根据模型可用性、延迟、成本等因素自动选择最优的供应商和模型。当某个供应商故障时，会自动 fallback 到备选供应商，确保服务不中断。",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="border-t py-24"
      style={{
        borderColor: 'var(--color-border-default)',
        paddingTop: 'var(--layout-section-spacing)',
        paddingBottom: 'var(--layout-section-spacing)',
      }}
    >
      <div className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            常见问题
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-text-body)',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            关于 OptRouter 的常见问题解答
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: 'var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)',
              }}
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors"
                style={{
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                }}
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </button>
              {openIndex === index && (
                <div
                  className="px-6 pb-4"
                  style={{ color: 'var(--color-text-body)' }}
                >
                  <p className="text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
