"use client";

import { HomeIcon, LogOutIcon, PackageIcon } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export function SidebarMenu() {
  const { data: session } = authClient.useSession();

  const categories = [
    { name: "Camisetas", slug: "camisetas" },
    { name: "Bermuda & Shorts", slug: "bermuda-shorts" },
    { name: "Calças", slug: "calcas" },
    { name: "Jaquetas & Moletons", slug: "jaquetas-moletons" },
    { name: "Tênis", slug: "tenis" },
    { name: "Acessórios", slug: "acessorios" },
  ];

  return (
    <div className="mt-5 flex flex-col space-y-4 text-sm font-medium">
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

      <hr className="my-4" />

      {categories.map((category) => {
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className={"hover:text-primary font-semibold text-black"}
          >
            {category.name}
          </Link>
        );
      })}

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
