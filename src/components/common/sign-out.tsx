import { LogOutIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const SignOut = () => {
  const { data: session } = authClient.useSession();
  return (
    <div className="flex flex-col space-y-4 text-sm font-medium">
      {/* Logout */}
      {session?.user && (
        <button
          className="mt-15 flex items-center gap-2 text-gray-500 hover:text-red-600"
          onClick={() => authClient.signOut()}
        >
          <LogOutIcon />
          Sair da conta
        </button>
      )}
    </div>
  );
};

export default SignOut;
