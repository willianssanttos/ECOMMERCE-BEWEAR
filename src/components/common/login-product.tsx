"use client";

import { useEffect, useState } from "react";

import { AuthDialog } from "@/app/authentication/components/auth-dialog";
import { authClient } from "@/lib/auth-client";

interface LoginProductProps {
  children: (isLogged: boolean, trigger: () => void) => React.ReactNode;
  onAfterLogin: () => Promise<void>;
}

const LoginProduct = ({ children, onAfterLogin }: LoginProductProps) => {
  const { data: session } = authClient.useSession();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (pending && session?.user.id) {
      setPending(false);
      onAfterLogin();
    }
  }, [pending, session?.user, onAfterLogin]);

  const trigger = () => {
    if (!session?.user.id) {
      setShowAuthDialog(true);
      setPending(true);
      return;
    }
    onAfterLogin();
  };

  const handleLoginSuccess = () => {
    setShowAuthDialog(false);
    // O restante do fluxo será chamado pelo useEffect
  };

  return (
    <>
      {children(!!session?.user.id, trigger)}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default LoginProduct;
