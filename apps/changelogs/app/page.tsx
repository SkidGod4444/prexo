import { docs, meta } from "@/.source"
import { loader } from "fumadocs-core/source"
import { createMDXSource } from "fumadocs-mdx"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMemo } from "react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {socials} from '@prexo/utils/constants'

const source = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
})

interface ChangelogData {
  title: string
  date: string
  version?: string
  tags?: string[]
  body: React.ComponentType
}

interface ChangelogPage {
  url: string
  data: ChangelogData
}

// Utility to create a valid HTML id from a date string (YYYY-MM-DD)
function getDateId(date: string) {
  // Remove non-alphanumeric (except dash), just in case
  return date.replace(/[^a-zA-Z0-9-]/g, "")
}

export default function HomePage() {
  const sortedChangelogs = useMemo(() => {
    const allPages = source.getPages() as ChangelogPage[]
    return allPages.sort((a, b) => {
      const dateA = new Date(a.data.date).getTime()
      const dateB = new Date(b.data.date).getTime()
      return dateB - dateA
    })
  }, [])

  // Inject a script to scroll to the hash with offset for header spacing
  // This will scroll to the element with the id matching the hash (if present)
  // and offset the scroll position by 80px (adjust as needed for your header)
  const scrollToHashScript = `
    (function() {
      if (window.location.hash) {
        var id = window.location.hash.slice(1);
        var el = document.getElementById(id);
        if (el) {
          var y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    })();
  `

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="max-w-5xl mx-auto relative">
          <div className="p-3 flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">Changelogs</h1>
            <div className="flex gap-2">
            <Link href={socials.docs} target="_blank" rel="noopener noreferrer">
            <Button variant={"ghost"}>
              Documentation
            </Button>
            </Link>

            <Link href={socials.dashboard} target="_blank" rel="noopener noreferrer">
            <Button variant={"ghost"}>
              Dashboard
            </Button>
            </Link>

            <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Inject scroll-to-hash script with offset */}
      <script
        dangerouslySetInnerHTML={{ __html: scrollToHashScript }}
        suppressHydrationWarning
      />

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-10">
        <div className="relative">
          {sortedChangelogs.map((changelog) => {
            const MDX = changelog.data.body
            const date = new Date(changelog.data.date)
            const formattedDate = formatDate(date)
            const dateId = getDateId(changelog.data.date)

            // Place a visually hidden anchor for scroll target with spacing
            return (
              <div key={changelog.url} className="relative">
                {/* Anchor for scroll with offset */}
                <span
                  id={dateId}
                  style={{
                    display: "block",
                    position: "relative",
                    top: "-20px",
                    height: "1px",
                    visibility: "hidden",
                  }}
                  aria-hidden="true"
                />
                <div className="flex flex-col md:flex-row gap-y-6">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="md:sticky md:top-8 pb-10">
                      <time className="text-sm font-medium text-muted-foreground block mb-3">
                        {formattedDate}
                      </time>

                      {changelog.data.version && (
                        <Button variant={'outline'} size={'sm'}>
                          v-{changelog.data.version}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 md:pl-8 relative pb-10">
                    {/* Vertical timeline line */}
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      {/* Timeline dot */}
                      <div className="hidden md:block absolute -translate-x-1/2 size-3 bg-primary rounded-full z-10" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-balance">
                          {changelog.data.title}
                        </h2>

                        {/* Tags */}
                        {changelog.data.tags &&
                          changelog.data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {changelog.data.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="h-6 w-fit px-2 text-xs font-medium bg-muted text-muted-foreground rounded-full border flex items-center justify-center"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
                        <MDX />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
