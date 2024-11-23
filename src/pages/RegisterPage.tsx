import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCredentials } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/utils/auth";

export function RegisterPage() {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(credentials);
    if (success) navigate("/");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-left">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-left">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <div className="flex items-center">
                <span className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </span>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={(e) => {
                handleLogin(e);
              }}
            >
              Register
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account? <span className="underline">Sign in</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
