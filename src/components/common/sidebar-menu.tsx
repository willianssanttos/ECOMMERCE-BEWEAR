import {
  HomeIcon,
  LogOutIcon,
  PackageIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export function SidebarMenu() {
    const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col space-y-4 text-sm font-medium">
      {/* Top Items */}
      <Link href="/" className="flex items-center gap-2 hover:text-black">
        <HomeIcon className="h-4 w-4" />
        Início
      </Link>

      <Link
        href="/my-orders"
        className="flex items-center gap-2 hover:text-black"
      >
        <PackageIcon className="h-4 w-4" />
        Meus Pedidos
      </Link>

      <Link href="/cart" className="flex items-center gap-2 hover:text-black">
        <ShoppingBagIcon className="h-4 w-4" />
        Sacola
      </Link>

      <hr className="my-4" />

      {/* Categorias */}

      <Link href="category/camisetas" className="hover:text-black">
        Camisetas
      </Link>
      <Link href="/bermudas" className="hover:text-black">
        Bermuda & Shorts
      </Link>
      <Link href="/calcas" className="hover:text-black">
        Calças
      </Link>
      <Link href="/jaquetas" className="hover:text-black">
        Jaquetas & Moletons
      </Link>
      <Link href="/tenis" className="hover:text-black">
        Tênis
      </Link>
      <Link href="/acessorios" className="hover:text-black">
        Acessórios
      </Link>

      <hr className="my-4" />

      {/* Logout */}
      {session?.user && (
        <button
        className="flex items-center gap-2 text-gray-500 hover:text-red-600"
        onClick={() => authClient.signOut()}
      >
        <LogOutIcon />
        Sair da conta
      </button>
      )}
    </div>
  );
}
export default SidebarMenu;
