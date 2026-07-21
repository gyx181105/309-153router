import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DOCS_SLUGS, isDocsSlug, type DocsSlug } from '@/lib/docs/nav'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { DocsPageBody } from '../../content/docs-page-body'
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'
import jaMessages from '@/messages/ja.json'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

const MESSAGES = {
  zh: zhMessages,
  en: enMessages,
  ja: jaMessages,
} as const

function pageMeta(locale: Locale, slug: DocsSlug): { title: string; description: string } {
  const pages = (MESSAGES[locale] as { docsSite?: { pages?: Record<string, { title?: string; description?: string }> } })
    .docsSite?.pages
  const page = pages?.[slug]
  return {
    title: page?.title ? `${page.title} | OptRouter Docs` : 'OptRouter Docs',
    description: page?.description ?? 'OptRouter developer documentation',
  }
}

export async function generateStaticParams() {
  const locales = ['zh', 'en', 'ja']
  return locales.flatMap((locale) => DOCS_SLUGS.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale) || !isDocsSlug(slug)) {
    return { title: 'OptRouter Docs' }
  }
  const meta = pageMeta(locale, slug)
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://optrouter.com/${locale}/docs/${slug}`,
    },
  }
}

export default async function DocsSlugPage({ params }: Props) {
  const { slug } = await params
  if (!isDocsSlug(slug)) notFound()
  return <DocsPageBody slug={slug} />
}
