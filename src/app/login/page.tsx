 import Login from "@/containers/login-contaner";
import { FunctionComponent } from "react";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  return (
    <div>
      <Login/>
    </div>
  );
};

export default LoginPage;
