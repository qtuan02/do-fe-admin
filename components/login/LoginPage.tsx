"use client"
import { useState } from "react";
import Constants from "@/commons/environment";
import Loading from "../loading/loading";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        account: "huynhquoctuan200702@gmail.com",
        password: "Admin@123"
    });
    const [error, setError] = useState("")
    const handleChange = async (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        
        const { account, password } = formData;
        
        if(!account || !password){
            setError("Hãy nhập đủ dữ liệu!");
            return
        }
        
        setIsLoading(true);
        try{
            const response = await fetch(Constants.URL_V2+"/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    account, password
                })
            });
            
            const data = await response.json();
            setIsLoading(false);
            const message = data.message;
            if(response.ok){
                const token: any = data.data.token;
                const decoded: any = await jwtDecode(token);
                if(decoded.role === 'admin' || decoded.role === 'staff'){
                    Cookies.set('token', token, { expires: 7 });
                    Cookies.set('role', decoded.role, { expires: 7 });
                    window.location.replace('/dashboard');
                }else{
                    setError("Không có quyền truy cập!");
                }
            }else{
                setError(message);
            }
        }catch(error){
            setError("Đã có lỗi xảy ra!")
        }
        setIsLoading(false);
    }

   return <div className="grid place-items-center h-screen">
    <div className="shadow-lg p-5 border-t-4 border-green-400 rounded-lg">
        <h1 className="text-xl font-bold my-4">LOGIN ADMIN</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input onChange={handleChange} name="account" type="text" placeholder="Account" value="huynhquoctuan200702@gmail.com" className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40"/>
            <input onChange={handleChange} name="password" type="password" placeholder="Password" value="Admin@123" className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40"/>
            {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>
            )}
            <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 mt-4">LOGIN</button>
        </form>
    </div>
    {isLoading && <Loading />}
   </div> 
}