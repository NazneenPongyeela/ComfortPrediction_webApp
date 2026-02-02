import LoginHero from "@/components/login/LoginHero";
import LoginForm from "@/components/login/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      <LoginHero />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
