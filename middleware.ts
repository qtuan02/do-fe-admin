import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest){
    if(!req.cookies.has('token')){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const token: string = req.cookies.get("token")?.value as string;
    try{
        const decoded: any = jwtDecode(token);
        
        const currentDate = Math.floor(Date.now() / 1000);
        if(decoded.exp <= currentDate){
            return NextResponse.redirect(new URL("/login", req.url), {
                headers: {
                    "Set-Cookie": `token=; Max-Age=0; Path=/; HttpOnly`
                }
            });
        }

        if(decoded.role === "admin"){
            return NextResponse.next();
        }
    }catch(err){
        console.log(`Error: ${err}`);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: "/dashboard/:path*"
}