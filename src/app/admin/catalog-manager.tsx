'use client';

/**
 * catalog-manager.tsx
 * -----------------------------------------------------------------------------
 * Authenticated catalog management: lists every storefront product, lets the
 * admin edit name/price/notes/items as DB overrides (which win over the static
 * catalog at runtime), reset overrides, and add brand-new custom products.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layers, Loader2, Plus, Save, Trash2, Tag, ArrowLeft, ExternalLink, Check } from 'lucide-react';
import { HAMPER_QUEEN_PRODUCTS, HamperQueenProduct } from '../../data/hamperQueenCatalog';

interface OverrideDto {
  _id: string;
  productId: string;
  fields: Record<string, unknown>;
  updatedAt: string;
  baseProduct: boolean;
}

type Editable = {
  name: string;
  nameHinglish: string;
  approxPrice: string;
  pricingNote: string;
  subtitle: string;
  subtitleHinglish: string;
  itemsIncluded: string[];
  categoryLabel: string;
};

function fieldBuilder(p: HamperQueenProduct | OverrideDto): Editable {
  const base =
    'name' in p
      ? {
          name: p.name,
          nameHinglish: p.nameHinglish,
          approxPrice: p.approxPrice,
          pricingNote: p.pricingNote ?? '',
          subtitle: p.subtitle,
          subtitleHinglish: p.subtitleHinglish,
          itemsIncluded: p.itemsIncluded,
          categoryLabel: p.categoryLabel ?? p.category,
        }
      : {
          name: HAMPER_QUEEN_PRODUCTS.find((x) => x.id === p.productId)?.name ?? p.productId,
          nameHinglish: '',
          approxPrice: '',
          pricingNote: '',
          subtitle: '',
          subtitleHinglish: '',
          itemsIncluded: [] as string[],
          categoryLabel: '',
        };
  const fields = 'fields' in p ? (p.fields as unknown as Partial<Editable>) : {};
  return {
    name: (fields.name as string) ?? base.name,
    nameHinglish: (fields.nameHinglish as string) ?? base.nameHinglish,
    approxPrice: (fields.approxPrice as string) ?? base.approxPrice,
    pricingNote: (fields.pricingNote as string) ?? base.pricingNote,
    subtitle: (fields.subtitle as string) ?? base.subtitle,
    subtitleHinglish: (fields.subtitleHinglish as string) ?? base.subtitleHinglish,
    itemsIncluded: Array.isArray(fields.itemsIncluded) ? (fields.itemsIncluded as string[]) : base.itemsIncluded,
    categoryLabel: (fields.categoryLabel as string) ?? base.categoryLabel,
  };
}

export function CatalogManager() {
  const [overrides, setOverrides] = useState<OverrideDto[]>([]);
  const [products, setProducts] = useState<HamperQueenProduct[]>(HAMPER_QUEEN_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Editable | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newItems, setNewItems] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ovRes, catRes] = await Promise.all([fetch('/api/admin/catalog'), fetch('/api/catalog')]);
      if (!ovRes.ok) throw new Error('Unauthorized.');
      const ov = await ovRes.json();
      setOverrides(ov.overrides as OverrideDto[]);
      if (catRes.ok) {
        const cat = await catRes.json();
        if (cat.products && cat.products.length) setProducts(cat.products as HamperQueenProduct[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const merged: Array<{ productId: string; product?: HamperQueenProduct; override?: OverrideDto; isCustom: boolean }> = [];
    for (const p of products) {
      merged.push({
        productId: p.id,
        product: p,
        override: overrides.find((o) => o.productId === p.id),
        isCustom: false,
      });
    }
    for (const o of overrides) {
      if (products.some((p) => p.id === o.productId)) continue;
      merged.push({ productId: o.productId, override: o, isCustom: true });
    }
    return merged;
  }, [products, overrides]);

  const openEdit = (row: (typeof rows)[number]) => {
    setEditingId(row.productId);
    setDraft(fieldBuilder(row.override ?? row.product!));
    setSavedId('');
  };

  const saveOverride = async (productId: string) => {
    if (!draft) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          fields: {
            name: draft.name,
            nameHinglish: draft.nameHinglish,
            approxPrice: draft.approxPrice,
            pricingNote: draft.pricingNote,
            subtitle: draft.subtitle,
            subtitleHinglish: draft.subtitleHinglish,
            itemsIncluded: draft.itemsIncluded,
            categoryLabel: draft.categoryLabel,
          },
        }),
      });
      if (!res.ok) throw new Error('Save failed.');
      setSavedId(productId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save override.');
    } finally {
      setSaving(false);
    }
  };

  const resetOverride = async (productId: string) => {
    if (!window.confirm(`Reset "${productId}" back to the base catalog? The override will be removed.`)) return;
    setError('');
    try {
      await fetch(`/api/admin/catalog/${encodeURIComponent(productId)}`, { method: 'DELETE' });
      await load();
    } catch {
      setError('Could not reset override.');
    }
  };

  const createNewProduct = async () => {
    const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!slug || !newName.trim()) {
      setError('Slug and product name are required for a new product.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: slug,
          fields: {
            name: newName.trim(),
            approxPrice: newPrice.trim() || 'INR 499',
            itemsIncluded: newItems.split(',').map((i) => i.trim()).filter(Boolean),
            categoryLabel: 'Custom Shop Product',
          },
        }),
      });
      if (!res.ok) throw new Error('Could not create product.');
      setNewOpen(false);
      setNewSlug('');
      setNewName('');
      setNewPrice('');
      setNewItems('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="sticky top-0 z-20 bg-[#141414] text-white border-b border-[#D4AF37]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Admin
            </a>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-cinzel text-sm font-bold tracking-wide">Catalog Overrides</h1>
                <p className="text-[10px] text-white/60">DB wins over the static catalog · preview via /api/catalog</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setNewOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DFBA54] hover:bg-[#C5A059] text-[#141414] text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Product</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
        )}

        {newOpen && (
          <div className="p-6 rounded-2xl bg-white border-2 border-[#D4AF37]/50 shadow-md space-y-4">
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">
              Add a Brand-New Custom Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="Slug / product id (e.g. summer-delight)"
                className="px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
              />
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price (e.g. INR 649)"
                className="px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Product name"
                className="px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B] md:col-span-2"
              />
              <textarea
                value={newItems}
                onChange={(e) => setNewItems(e.target.value)}
                placeholder="Items included, comma separated"
                rows={2}
                className="px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B] md:col-span-2"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setNewOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs font-semibold text-[#524B40] hover:bg-[#FAF9F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createNewProduct}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold cursor-pointer disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Product
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-[#6B6559]">
            <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
            <p className="text-xs font-semibold">Loading catalog…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => {
              const name = row.product?.name ?? (row.override?.fields.name as string) ?? row.productId;
              const price = (row.override?.fields.approxPrice as string | undefined) ?? row.product?.approxPrice ?? 'On request';
              const isEditing = editingId === row.productId;
              return (
                <div key={row.productId} className="rounded-2xl bg-white border border-[#EAE5D9] shadow-2xs overflow-hidden">
                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] flex items-center justify-center">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-cinzel text-sm font-bold text-[#141414] truncate">{name}</p>
                        <p className="text-[11px] text-[#A49B8A] font-mono">
                          {row.productId} · {price}
                          {row.override && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/50 text-[9px] font-bold text-[#8C6821] uppercase">
                              Override
                            </span>
                          )}
                          {row.isCustom && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[9px] font-bold text-sky-700 uppercase">
                              Custom
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <button
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold hover:bg-[#252525] transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Edit Fields
                        </button>
                      )}
                      {row.override && !isEditing && (
                        <button
                          onClick={() => resetOverride(row.productId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && draft && (
                    <div className="px-5 pb-5 space-y-4 border-t border-[#F0ECE1] pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Name</label>
                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Name (Hinglish)</label>
                          <input
                            type="text"
                            value={draft.nameHinglish}
                            onChange={(e) => setDraft({ ...draft, nameHinglish: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Price (approxPrice)</label>
                          <input
                            type="text"
                            value={draft.approxPrice}
                            onChange={(e) => setDraft({ ...draft, approxPrice: e.target.value })}
                            placeholder="e.g. INR 499"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Pricing Note</label>
                          <input
                            type="text"
                            value={draft.pricingNote}
                            onChange={(e) => setDraft({ ...draft, pricingNote: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Category Label</label>
                          <input
                            type="text"
                            value={draft.categoryLabel}
                            onChange={(e) => setDraft({ ...draft, categoryLabel: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1">Items Included (comma separated)</label>
                          <input
                            type="text"
                            value={draft.itemsIncluded.join(', ')}
                            onChange={(e) => setDraft({ ...draft, itemsIncluded: e.target.value.split(',').map((i) => i.trim()) })}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D6] text-xs font-semibold text-[#524B40] hover:bg-[#FAF9F5] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveOverride(row.productId)}
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold cursor-pointer disabled:opacity-60"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : savedId === row.productId ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {savedId === row.productId ? 'Saved' : 'Save Override'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-[#A49B8A] pt-2">
          <ExternalLink className="w-3.5 h-3.5" />
          Overrides are live immediately — prices shown on the storefront cart and checkout always recompute from the merged catalog.
        </div>
      </main>
    </div>
  );
}