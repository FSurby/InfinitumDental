"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { Brand, Offer, ActionResult } from "@/lib/types";
import { saveOffer } from "@/app/admin/actions";
import { DRIVLINJER, SEGMENTS, TILBUDSTYPER } from "@/lib/utils/filters";
import {
  drivlinjeLabel,
  segmentLabel,
  tilbudstypeLabel,
} from "@/lib/utils/format";

const initial: ActionResult = { ok: false };

function labelCls() {
  return "mb-1 block text-sm font-medium";
}
function inputCls() {
  return "w-full rounded-xl border border-app bg-[rgb(var(--bg))] px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60";
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-accent disabled:opacity-60"
    >
      {pending ? "Lagrer…" : "Lagre tilbud"}
    </button>
  );
}

export function OfferForm({
  brands,
  offer,
  disabled,
}: {
  brands: Brand[];
  offer?: Offer;
  disabled?: boolean;
}) {
  const [state, formAction] = useFormState(saveOffer, initial);

  return (
    <form action={formAction} className="space-y-5">
      {offer && <input type="hidden" name="id" value={offer.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="modell" className={labelCls()}>
            Modell *
          </label>
          <input
            id="modell"
            name="modell"
            required
            defaultValue={offer?.modell}
            className={inputCls()}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="brand_id" className={labelCls()}>
            Merke *
          </label>
          <select
            id="brand_id"
            name="brand_id"
            required
            defaultValue={offer?.brand_id}
            className={inputCls()}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="tilbudstype" className={labelCls()}>
            Tilbudstype
          </label>
          <select
            id="tilbudstype"
            name="tilbudstype"
            defaultValue={offer?.tilbudstype ?? "leasing"}
            className={inputCls()}
            disabled={disabled}
          >
            {TILBUDSTYPER.map((t) => (
              <option key={t} value={t}>
                {tilbudstypeLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="segment" className={labelCls()}>
            Segment
          </label>
          <select
            id="segment"
            name="segment"
            defaultValue={offer?.segment ?? "suv"}
            className={inputCls()}
            disabled={disabled}
          >
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {segmentLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="drivlinje" className={labelCls()}>
            Drivlinje
          </label>
          <select
            id="drivlinje"
            name="drivlinje"
            defaultValue={offer?.drivlinje ?? "elbil"}
            className={inputCls()}
            disabled={disabled}
          >
            {DRIVLINJER.map((d) => (
              <option key={d} value={d}>
                {drivlinjeLabel(d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { name: "maanedspris", label: "Månedspris (kr)", val: offer?.maanedspris },
          { name: "startleie", label: "Startleie (kr)", val: offer?.startleie },
          {
            name: "bindingstid_mnd",
            label: "Bindingstid (mnd)",
            val: offer?.bindingstid_mnd ?? 36,
          },
          { name: "km_per_aar", label: "Km/år", val: offer?.km_per_aar ?? 15000 },
        ].map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className={labelCls()}>
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type="number"
              defaultValue={f.val}
              className={inputCls()}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="forhandler" className={labelCls()}>
            Forhandler
          </label>
          <input
            id="forhandler"
            name="forhandler"
            defaultValue={offer?.forhandler}
            className={inputCls()}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="forhandler_url" className={labelCls()}>
            Forhandler-URL
          </label>
          <input
            id="forhandler_url"
            name="forhandler_url"
            type="url"
            defaultValue={offer?.forhandler_url ?? ""}
            className={inputCls()}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={labelCls()}>
            Slug (valgfri – genereres automatisk)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={offer?.slug}
            className={inputCls()}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="popularitet" className={labelCls()}>
            Popularitet (0–100)
          </label>
          <input
            id="popularitet"
            name="popularitet"
            type="number"
            defaultValue={offer?.popularitet ?? 50}
            className={inputCls()}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bilde_urls" className={labelCls()}>
          Bilde-URLer (én per linje)
        </label>
        <textarea
          id="bilde_urls"
          name="bilde_urls"
          rows={3}
          defaultValue={offer?.bilde_urls?.join("\n")}
          className={inputCls()}
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="bilder" className={labelCls()}>
          Last opp bilder (Supabase Storage)
        </label>
        <input
          id="bilder"
          name="bilder"
          type="file"
          multiple
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-fg disabled:opacity-60"
          disabled={disabled}
        />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="aktiv"
          defaultChecked={offer ? offer.aktiv : true}
          className="h-5 w-5 rounded accent-[rgb(var(--accent))]"
          disabled={disabled}
        />
        Aktiv (synlig på nettsiden)
      </label>

      {state.error && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton disabled={disabled} />
        <Link href="/admin/tilbud" className="btn-ghost">
          Avbryt
        </Link>
      </div>
    </form>
  );
}
