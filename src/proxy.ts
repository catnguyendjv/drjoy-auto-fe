import { auth } from "@/auth"

export { auth as proxy }

export const config = {
  matcher: ["/kanban/:path*", "/settings/:path*", "/performance/:path*", "/schedule/:path*", "/timelogs/:path*"],
}
