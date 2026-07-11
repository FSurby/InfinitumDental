"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Brand, ActionResult } from "@/lib/types";
import { saveSalesStat } from "@/app/admin/actions";

const initial: ActionResult = { ok: false };
const labelCls = "mb-1 block text-sm font-medium";
const inputCls =
  "w-full rounded-xl border border-app bg-[rgb(var(--bg))] px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-accent disabled:opacity-60"
    >
      {pending ? "Lagrer…" : "Lagre statistikk"}
    </button>
  );
}

export function StatForm({
  brands,
  defaultMonth,
  disabled,
}: {
  brands: Brand[];
  defaultMonth: string;
  disabled?: boolean;
}) {
  const [state, formAction] = useFormState(saveSalesStat, initial);

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="brand_id" className={labelCls}>
            Merke *
          </label>
          <select
            id="brand_id"
            name="brand_id"
            required
            className={inputCls}
            disabled={disabled}
          >
            <option value="">Velg merke</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.navn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="maaned" className={labelCls}>
            Måned *
          </label>
          <input
            id="maaned"
            name="maaned"
            type="date"
            required
            defaultValue={defaultMonth}
            className={inputCls}
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-muted">Bruk den 1. i måneden.</p>
        </div>
      </div>

      <div>
        <label htmlFor="modell" className={labelCls}>
          Modell(er)
        </label>
        <input
          id="modell"
          name="modell"
          placeholder="f.eks. Model Y"
          className={inputCls}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="antall_registreringer" className={labelCls}>
            Antall registreringer
          </label>
          <input
            id="antall_registreringer"
            name="antall_registreringer"
            type="number"
            className={inputCls}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="plassering" className={labelCls}>
            Plassering
          </label>
          <input
            id="plassering"
            name="plassering"
            type="number"
            min={1}
            className={inputCls}
            disabled={disabled}
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm">
          Statistikk lagret.
        </p>
      )}

      <SubmitButton disabled={disabled} />
    </form>
  );
}
