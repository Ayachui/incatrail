"use client";

import { useCallback, useEffect, useState } from "react";

type AdminLot = {
  id: string;
  sourceBatchId: string;
  subtitle: string;
  productLabel: string;
  heroImageUrl?: string;
  availablePhotos?: Array<{ url: string; stage: string }>;
  initialKg: number | null;
  manualAllocatedKg: number;
  productionAllocatedKg: number;
  allocatedKg: number | null;
  availableKg: number | null;
  nftTokenId?: string;
};

type AdminInquiry = {
  id: string;
  type: string;
  batchId?: string;
  requestedKg?: number;
  company: string;
  contactName: string;
  email: string;
  message: string;
  status: "new" | "contacted" | "reserved" | "fulfilled" | "cancelled";
  createdAt: number;
};

const STORAGE_KEY = "itf_ecosystem_admin_token";

function consumeHashToken(): string {
  if (typeof window === "undefined") return "";
  const hash = window.location.hash || "";
  const m = /eco_token=([^&]+)/.exec(hash);
  if (!m?.[1]) return "";
  const tok = decodeURIComponent(m[1]).trim();
  window.sessionStorage.setItem(STORAGE_KEY, tok);
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  return tok;
}

function toHexUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export function ItfBaseAdminClient() {
  const [token, setToken] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lots, setLots] = useState<AdminLot[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { allocated: string; available: string }>>({});
  const [hasInjectedWallet, setHasInjectedWallet] = useState(true);

  const checkSession = useCallback(async (tok?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (tok) headers.Authorization = `Bearer ${tok}`;
      const res = await fetch("/api/ecosystem/session", { headers, credentials: "include" });
      const data = (await res.json()) as { sessionValid?: boolean; wallet?: string };
      if (data.sessionValid && data.wallet) {
        setWallet(data.wallet);
        return true;
      }
      setWallet("");
      return false;
    } catch {
      return false;
    }
  }, []);

  const loadData = useCallback(async (tok: string) => {
    const headers: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    const [invRes, inqRes] = await Promise.all([
      fetch("/api/itf/admin/inventory", { headers, credentials: "include" }),
      fetch("/api/itf/admin/inquiries", { headers, credentials: "include" }),
    ]);
    const [invJson, inqJson] = await Promise.all([invRes.json(), inqRes.json()]);
    if (invJson.ok) {
      const items = (invJson.items || []) as AdminLot[];
      setLots(items);
      const next: Record<string, { allocated: string; available: string }> = {};
      for (const it of items) {
        next[it.id] = {
          allocated: String(it.allocatedKg ?? 0),
          available: String(it.availableKg ?? 0),
        };
      }
      setDrafts(next);
    }
    if (inqJson.ok) setInquiries((inqJson.inquiries || []) as AdminInquiry[]);
  }, []);

  useEffect(() => {
    setHasInjectedWallet(
      typeof window !== "undefined" && Boolean((window as unknown as { ethereum?: unknown }).ethereum),
    );
    const fromHash = consumeHashToken();
    const saved =
      fromHash ||
      (typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) || "" : "");
    if (saved) setToken(saved);
    void checkSession(saved).then((ok) => {
      if (ok) void loadData(saved);
    });
  }, [checkSession, loadData]);

  const openBaseSso = () => {
    const ret = encodeURIComponent(`${window.location.origin}/admin`);
    window.location.href = `https://www.tzunki.com/base/ops?returnTo=${ret}`;
  };

  const handleWalletSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      const eth = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
      if (!eth) {
        openBaseSso();
        return;
      }
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const addr = accounts?.[0]?.toLowerCase();
      if (!addr) throw new Error("No wallet account selected");

      const issuedAt = Date.now();
      const message = `Tzunki Ecosystem Admin\nAction: admin session\nWallet: ${addr}\nIssued (ms): ${issuedAt}`;
      const signature = (await eth.request({
        method: "personal_sign",
        params: [toHexUtf8(message), addr],
      })) as string;

      const res = await fetch("/api/ecosystem/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address: addr, issuedAt, message, signature }),
      });
      const json = (await res.json()) as { ok?: boolean; token?: string; wallet?: string; error?: string };
      if (!res.ok || !json.ok || !json.token) {
        throw new Error(json.error || "Unauthorized wallet");
      }
      window.sessionStorage.setItem(STORAGE_KEY, json.token);
      setToken(json.token);
      setWallet(json.wallet || addr);
      await loadData(json.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveLot = async (lot: AdminLot) => {
    setError(null);
    setNotice(null);
    const d = drafts[lot.id];
    if (!d) return;
    try {
      const res = await fetch(`/api/itf/admin/inventory/${encodeURIComponent(lot.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ targetAllocatedKg: Number(d.allocated) }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to save");
      setNotice(`Saved ${lot.subtitle}`);
      await loadData(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const handleSaveHero = async (lot: AdminLot, heroImageUrl: string) => {
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/itf/admin/inventory/${encodeURIComponent(lot.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ heroImageUrl }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to update cover photo");
      setNotice(`Updated cover photo for ${lot.subtitle}`);
      await loadData(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const handleConfirmReserve = async (inq: AdminInquiry) => {
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/itf/admin/inquiries/${encodeURIComponent(inq.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ status: "reserved", applyReserveKg: true }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to confirm reserve");
      setNotice(`Confirmed reserve for ${inq.company}`);
      await loadData(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-28 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3b1c4a] pb-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#c39bd3]">
            Unified Base L2 Admin Auth
          </p>
          <h1 className="font-serif text-3xl mt-1">Inca Trail B2B Reserve Admin</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.tzunki.com/base/ops"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#6b21a8] text-xs uppercase tracking-wider text-[#c39bd3] hover:bg-[#6b21a8] hover:text-white transition"
          >
            Open Full Base Ops Console ↗
          </a>
          {wallet ? (
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(STORAGE_KEY);
                setToken("");
                setWallet("");
              }}
              className="px-4 py-2 border border-[#3b1c4a] text-xs text-neutral-300"
            >
              Sign out ({wallet.slice(0, 6)}…)
            </button>
          ) : null}
        </div>
      </div>

      {!wallet ? (
        <div className="max-w-md mx-auto border border-[#3b1c4a] bg-[#0a0612] p-8 text-center space-y-4">
          <p className="text-sm text-neutral-300 font-light">
            Sign in using the same Base L2 admin wallet authorized in Campo (`creador` / `administrador`).
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleWalletSignIn()}
            className="w-full py-3 bg-[#6b21a8] text-white text-xs uppercase tracking-widest hover:bg-[#7e22ce] disabled:opacity-50"
          >
            {busy
              ? "Waiting for signature…"
              : hasInjectedWallet
                ? "Connect & Sign with Base L2 Wallet"
                : "Connect via Base Account / WalletConnect ↗"}
          </button>
          {hasInjectedWallet ? (
            <button
              type="button"
              onClick={openBaseSso}
              className="w-full py-2.5 border border-[#3b1c4a] text-[#c39bd3] text-xs uppercase tracking-wider hover:border-[#6b21a8]"
            >
              Sign in via Base Account Passkey ↗
            </button>
          ) : null}
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </div>
      ) : (
        <div className="space-y-8">
          {notice ? <div className="border border-emerald-700 bg-emerald-950/40 p-3 text-sm text-emerald-200">{notice}</div> : null}
          {error ? <div className="border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

          <div className="grid gap-4 md:grid-cols-2">
            {lots.map((lot) => {
              const total = lot.initialKg ?? 0;
              const d = drafts[lot.id] || {
                allocated: String(lot.allocatedKg ?? 0),
                available: String(lot.availableKg ?? 0),
              };
              const photos = lot.availablePhotos || [];
              return (
                <div key={lot.id} className="border border-[#3b1c4a] bg-[#0a0612] p-5 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-mono text-xs text-[#c39bd3]">{lot.subtitle}</p>
                      <h2 className="font-serif text-xl">{lot.productLabel}</h2>
                    </div>
                    <span className="font-mono text-sm shrink-0">Total: {total} kg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <label>
                      Allocated (kg)
                      <input
                        type="number"
                        step="0.1"
                        min={lot.productionAllocatedKg}
                        max={total}
                        value={d.allocated}
                        onChange={(e) => {
                          const v = e.target.value;
                          const n = Number(v);
                          const avail = Number.isFinite(n) ? Math.max(0, Math.round((total - n) * 1000) / 1000) : 0;
                          setDrafts((p) => ({ ...p, [lot.id]: { allocated: v, available: String(avail) } }));
                        }}
                        className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 font-mono text-white"
                      />
                    </label>
                    <label>
                      Available (kg)
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={Math.max(0, total - lot.productionAllocatedKg)}
                        value={d.available}
                        onChange={(e) => {
                          const v = e.target.value;
                          const n = Number(v);
                          const alloc = Number.isFinite(n) ? Math.max(0, Math.round((total - n) * 1000) / 1000) : 0;
                          setDrafts((p) => ({ ...p, [lot.id]: { allocated: String(alloc), available: v } }));
                        }}
                        className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 font-mono text-white"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSaveLot(lot)}
                    className="px-4 py-2 bg-[#6b21a8] text-xs uppercase tracking-wider hover:bg-[#7e22ce]"
                  >
                    Save Balance
                  </button>

                  {photos.length > 0 ? (
                    <div className="pt-3 border-t border-[#3b1c4a]/70 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                        <span>COVER PHOTO (B2B SHOWCASE)</span>
                        <button
                          type="button"
                          onClick={() => void handleSaveHero(lot, "")}
                          className="text-[#c39bd3] hover:text-white underline"
                        >
                          Auto
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {photos.map((ph) => {
                          const isSelected = lot.heroImageUrl === ph.url;
                          return (
                            <button
                              key={ph.url}
                              type="button"
                              title={ph.stage}
                              onClick={() => void handleSaveHero(lot, ph.url)}
                              className={`relative w-14 h-14 overflow-hidden border transition ${
                                isSelected
                                  ? "border-[#c39bd3] ring-2 ring-[#c39bd3]"
                                  : "border-[#3b1c4a] opacity-75 hover:opacity-100"
                              }`}
                            >
                              <img src={ph.url} alt={ph.stage} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-mono text-neutral-200 px-1 truncate">
                                {ph.stage}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl">Recent B2B Inquiries</h2>
            {inquiries.map((inq) => (
              <div key={inq.id} className="border border-[#3b1c4a] bg-[#0a0612] p-4 flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-[#c39bd3]">
                    {inq.type.toUpperCase()} • {inq.status.toUpperCase()} {inq.batchId ? `• ${inq.batchId}` : ""}{" "}
                    {inq.requestedKg ? `(${inq.requestedKg} kg)` : ""}
                  </p>
                  <p className="font-semibold">
                    {inq.company} — {inq.contactName} ({inq.email})
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{inq.message}</p>
                </div>
                {inq.batchId && inq.requestedKg && inq.status !== "reserved" && inq.status !== "fulfilled" ? (
                  <button
                    type="button"
                    onClick={() => void handleConfirmReserve(inq)}
                    className="self-center px-4 py-2 bg-emerald-700 text-xs uppercase tracking-wider hover:bg-emerald-600"
                  >
                    Confirm Reserve ({inq.requestedKg} kg)
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
