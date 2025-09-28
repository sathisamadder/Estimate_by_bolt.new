import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, Eye, EyeOff, User } from "lucide-react";
import { motion } from "framer-motion";

export function Login() {
  const [scale, setScale] = useState(1);
  const [showScaleControl, setShowScaleControl] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // tilt state for 3D card
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  const { login, register } = useAuth();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const max = 8; // degrees
    const newRy = (px - 0.5) * max * -1;
    const newRx = (py - 0.5) * max;
    setRx(newRx);
    setRy(newRy);
  };

  const handleLeave = () => {
    setRx(0);
    setRy(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh gpt5-gradient flex items-center justify-center p-6">
      <div
        className="login-3d-wrapper"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        aria-hidden={false}
      >
        <Card
          className="w-full max-w-md shadow-xl card-scale login-3d-card"
          style={{ "--card-scale": scale, "--rx": rx + "deg", "--ry": ry + "deg" } as React.CSSProperties}
        >
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4 relative">
              <div className="absolute right-4 top-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScaleControl((s) => !s)}
                  className="p-2"
                  aria-label="Adjust card size"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
              </div>

              <motion.div
                className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 login-avatar"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="flex items-center justify-center w-20 h-20 rounded-xl bg-white shadow-sm"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F60f84872b4b14093aa9e83d9ad74d969%2Fc1fba5ea5cf94244b8c69f5e5c441958?format=webp&width=800"
                    alt="ROY Construction Logo"
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-contain bg-transparent"
                    style={{ background: "transparent", backdropFilter: "none" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">ROY</CardTitle>
            <CardDescription>{isRegistering ? "Create your account" : "Sign in to your account"}</CardDescription>
          </CardHeader>

          <CardContent>
            {showScaleControl && (
              <div className="p-3">
                <Label>Card Scale</Label>
                <div className="flex items-center space-x-3">
                  <input
                    aria-label="Card scale"
                    type="range"
                    min={0.8}
                    max={1.2}
                    step={0.01}
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="w-12 text-sm text-right">{(scale * 100).toFixed(0)}%</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600" disabled={loading}>
                {loading ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" /> : null}
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>

              <div className="text-center space-y-2">
                <button type="button" className="text-sm text-brand-600 hover:text-brand-700" onClick={() => { setIsRegistering(!isRegistering); setError(""); }}>
                  {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
