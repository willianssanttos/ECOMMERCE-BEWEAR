"use client";

import { useEffect, useRef, useState } from "react";

import { AuthDialog } from "@/app/authentication/components/auth-dialog";
import { authClient } from "@/lib/auth-client";

interface LoginProductProps {
  children: (isLogged: boolean, trigger: () => void) => React.ReactNode;
  onAfterLogin: () => Promise<void>;
}

const LoginProduct = ({ children, onAfterLogin }: LoginProductProps) => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const pendingActionRef = useRef<null | (() => Promise<void>)>(null);

  useEffect(() => {
    if (showAuthDialog && session?.user && pendingActionRef.current) {
      setShowAuthDialog(false);
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, [session, showAuthDialog]);

  const trigger = () => {
    if (session?.user) {
      onAfterLogin();
    } else {
      pendingActionRef.current = onAfterLogin;
      setShowAuthDialog(true);
    }
  };

  if (sessionPending) {
    return children(false, () => {});
  }

  return (
    <>
      {children(!!session?.user, trigger)}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  );
};

export default LoginProduct;
