"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const dialogs: HTMLElement[] = [];
let savedBodyOverflow = "";
const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, onClose, title, description, children, className }: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const panelRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) return;
    const rememberFocus = () => {
      if (document.activeElement instanceof HTMLElement && !panelRef.current?.contains(document.activeElement)) {
        restoreFocusRef.current = document.activeElement;
      }
    };
    rememberFocus();
    document.addEventListener("focusin", rememberFocus);
    return () => document.removeEventListener("focusin", rememberFocus);
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    if (!dialogs.length) {
      savedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialogs.push(panel);
    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter((node) => !node.matches(":disabled") && node.getClientRects().length > 0);
    const focusFirst = () => (getFocusable()[0] ?? panel).focus();
    const frame = requestAnimationFrame(() => {
      if (!panel.contains(document.activeElement)) focusFirst();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (dialogs.at(-1) !== panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const nodes = getFocusable();
      const first = nodes[0];
      const last = nodes.at(-1);
      if (!first) {
        event.preventDefault();
        panel.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (dialogs.at(-1) === panel && event.target instanceof Node && !panel.contains(event.target)) focusFirst();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocus);
      const index = dialogs.indexOf(panel);
      if (index >= 0) dialogs.splice(index, 1);
      if (!dialogs.length) document.body.style.overflow = savedBodyOverflow;
      const restore = restoreFocusRef.current;
      if (restore?.isConnected) restore.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={id + "-title"} aria-describedby={description ? id + "-description" : undefined} tabIndex={-1}
        className={cn("animate-arrive max-h-[90dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-[#626047] bg-[#191e16] p-5 shadow-2xl shadow-black/60 outline-none sm:p-7", className)}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">L’atelier DuoTier</p>
            <h2 id={id + "-title"} className="display-font text-3xl leading-tight">{title}</h2>
            {description && <p id={id + "-description"} className="mt-2 text-sm leading-6 text-slate-400">{description}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fermer"><X className="size-5" strokeWidth={1.5} /></Button>
        </div>
        {children}
      </section>
    </div>, document.body,
  );
}
