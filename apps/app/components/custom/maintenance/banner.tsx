import { TriangleAlert } from "lucide-react"

export default function MaintenanceBanner() {
  return (
    <div className="w-full border-b px-8 py-3 bg-yellow-100 dark:bg-yellow-600 shadow-lg">
      <div className="flex items-center gap-3">
        <TriangleAlert
          className="shrink-0"
          size={25}
          aria-hidden="true"
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
          <span className="text-sm font-medium">
            The site is currently under <span className="font-bold underline">maintenance mode</span>. Some features may be unavailable or change unexpectedly.
          </span>
          <span className="text-xs mt-1 md:mt-0 md:ml-auto">
            We'll be back to normal operation as soon as possible. <br /> Check our <a href="https://status.example.com" className="underline font-semibold">status page</a> for updates.
          </span>
        </div>
      </div>
    </div>
  )
}
