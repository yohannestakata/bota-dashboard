"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPicker } from "@/components/ui/map-picker";
import { useUpdateBranch } from "@/features/branches/data/hooks";

type Props = {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  website_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  price_range: number | null;
  is_main_branch: boolean;
  is_active: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  hideTrigger?: boolean;
};

export function EditBranchDialog({
  id,
  name,
  description,
  phone,
  website_url,
  address_line1,
  address_line2,
  city,
  state,
  postal_code,
  country,
  latitude,
  longitude,
  price_range,
  is_main_branch,
  is_active,
  open: controlledOpen,
  onOpenChange,
  hideTrigger,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open =
    typeof controlledOpen === "boolean" ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) =>
    onOpenChange ? onOpenChange(v) : setUncontrolledOpen(v);

  const [n, setN] = React.useState(name);
  const [d, setD] = React.useState(description ?? "");
  const [ph, setPh] = React.useState(phone ?? "");
  const [web, setWeb] = React.useState(website_url ?? "");
  const [a1, setA1] = React.useState(address_line1 ?? "");
  const [a2, setA2] = React.useState(address_line2 ?? "");
  const [c, setC] = React.useState(city ?? "");
  const [st, setSt] = React.useState(state ?? "");
  const [pc, setPc] = React.useState(postal_code ?? "");
  const [cty, setCty] = React.useState(country ?? "");
  const [lat, setLat] = React.useState<number | null>(latitude ?? null);
  const [lng, setLng] = React.useState<number | null>(longitude ?? null);
  const [price, setPrice] = React.useState<string>(
    price_range != null ? String(price_range) : ""
  );
  const [mainBranch, setMainBranch] = React.useState(!!is_main_branch);
  const [active, setActive] = React.useState(!!is_active);

  React.useEffect(() => {
    if (open) {
      setN(name);
      setD(description ?? "");
      setPh(phone ?? "");
      setWeb(website_url ?? "");
      setA1(address_line1 ?? "");
      setA2(address_line2 ?? "");
      setC(city ?? "");
      setSt(state ?? "");
      setPc(postal_code ?? "");
      setCty(country ?? "");
      setLat(latitude ?? null);
      setLng(longitude ?? null);
      setPrice(price_range != null ? String(price_range) : "");
      setMainBranch(!!is_main_branch);
      setActive(!!is_active);
    }
  }, [
    open,
    name,
    description,
    phone,
    website_url,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    latitude,
    longitude,
    price_range,
    is_main_branch,
    is_active,
  ]);

  const { mutate: update, isPending } = useUpdateBranch();
  const canSave = n.trim().length >= 2 && !isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </DialogTrigger>
      )}
      {/* Hidden trigger button to open programmatically from menu */}
      <DialogTrigger asChild>
        <button id={`edit-branch-${id}`} className="hidden" />
      </DialogTrigger>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit branch</DialogTitle>
          <DialogDescription>
            Update details and map location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-name">Name</Label>
              <Input
                id="edit-branch-name"
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-desc">Description</Label>
              <Input
                id="edit-branch-desc"
                value={d}
                onChange={(e) => setD(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-phone">Phone</Label>
                <Input
                  id="edit-branch-phone"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-web">Website</Label>
                <Input
                  id="edit-branch-web"
                  value={web}
                  onChange={(e) => setWeb(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-a1">Address Line 1</Label>
              <Input
                id="edit-branch-a1"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-a2">Address Line 2</Label>
              <Input
                id="edit-branch-a2"
                value={a2}
                onChange={(e) => setA2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-city">City</Label>
                <Input
                  id="edit-branch-city"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-state">State</Label>
                <Input
                  id="edit-branch-state"
                  value={st}
                  onChange={(e) => setSt(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-postal">Postal</Label>
                <Input
                  id="edit-branch-postal"
                  value={pc}
                  onChange={(e) => setPc(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-country">Country</Label>
                <Input
                  id="edit-branch-country"
                  value={cty}
                  onChange={(e) => setCty(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-price">Price (1-5)</Label>
                <Input
                  id="edit-branch-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-active">Active</Label>
                <Input
                  id="edit-branch-active"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-main">Main</Label>
                <Input
                  id="edit-branch-main"
                  type="checkbox"
                  checked={mainBranch}
                  onChange={(e) => setMainBranch(e.target.checked)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <MapPicker
              latitude={lat}
              longitude={lng}
              heightClass="h-[440px]"
              onChange={(la, lo) => {
                setLat(la);
                setLng(lo);
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-lat">Latitude</Label>
                <Input
                  id="edit-branch-lat"
                  value={lat ?? ""}
                  onChange={(e) =>
                    setLat(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-branch-lng">Longitude</Label>
                <Input
                  id="edit-branch-lng"
                  value={lng ?? ""}
                  onChange={(e) =>
                    setLng(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() =>
              update(
                {
                  id,
                  name: n,
                  description: d || null,
                  phone: ph || null,
                  website_url: web || null,
                  address_line1: a1 || null,
                  address_line2: a2 || null,
                  city: c || null,
                  state: st || null,
                  postal_code: pc || null,
                  country: cty || null,
                  latitude: lat,
                  longitude: lng,
                  price_range: price ? Number(price) : null,
                  is_main_branch: mainBranch,
                  is_active: active,
                },
                { onSuccess: () => setOpen(false) }
              )
            }
            disabled={!canSave}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
