import { auth } from "@/auth"

export default auth((req) => {
    // Protect /add-item route - redirect to login if not authenticated
    if (!req.auth && req.nextUrl.pathname === "/add-item") {
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
    // Return undefined to allow the request to proceed
    return undefined
})

export const config = {
    matcher: ["/add-item"],
}

