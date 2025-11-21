import { auth } from "@/auth"

export default auth

export const config = {
  matcher: ["/kanban/:path*", "/settings/:path*", "/performance/:path*", "/schedule/:path*", "/timelogs/:path*"],
}
