"use client";

import GoogleSignInButton from "@/components/common/googleSignInButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Criar uma conta</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Conecte-se à BEWEAR e aproveite uma experiência feita pra quem se
          veste com personalidade.
        </p>
        <GoogleSignInButton />
      </DialogContent>
    </Dialog>
  );
}