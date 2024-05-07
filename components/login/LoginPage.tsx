"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Constants from "@/commons/environment";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        account: "",
        password: ""
    });
    const [error, setError] = useState("")
    const handleChange = async (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const { account, password } = formData;
        
        if(!account || !password){
            setError("Hãy nhập đủ dữ liệu!");
            return
        }

        try{
            const response = await fetch(Constants.URL_V1+"/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    account, password
                })
            });
            
            const data = await response.json();
            const message = data.message;
            if(response.ok){
                const token = data.data.token;
                document.cookie = await `token=${token}; path=/`;
                if(document.cookie){
                    router.push("/dashboard");
                }
            }else{
                setError(message);
            }
        }catch(error){
            setError("Đã có lỗi xảy ra!")
        }
    }

   return <div className="grid place-items-center h-screen">
    <div className="shadow-lg p-5 border-t-4 border-green-400 rounded-lg">
        <h1 className="text-xl font-bold my-4">Đăng nhập</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input onChange={handleChange} name="account" type="text" placeholder="Tài khoản" className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40"/>
            <input onChange={handleChange} name="password" type="password" placeholder="Mật khẩu" className="w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40"/>
            {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>
            )}
            <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 mt-4">Đăng nhập</button>
        </form>
    </div>
   </div> 
}