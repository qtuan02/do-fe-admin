"use client";
import Loading from "@/components/loading/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, []);
  return (
    <Loading />
  );
}
