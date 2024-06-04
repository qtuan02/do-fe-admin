import LoginPage from "@/components/login/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
};

export default function Login() {
  return (
    <LoginPage />
  );
}
