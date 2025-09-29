"use client";

import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateBranch, usePlacesLite } from "@/features/branches/data/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddBranchDialog() {
  const [open, setOpen] = React.useState(false);
  const [placeId, setPlaceId] = React.useState<string>("all");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [priceRange, setPriceRange] = React.useState<string>("");
  const [isMain, setIsMain] = React.useState(false);

  const { data: places = [] } = usePlacesLite();
  const { mutate: create, isPending } = useCreateBranch();

  const reset = React.useCallback(() => {
    setPlaceId("all");
    setName("");
    setPhone("");
    setWebsite("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setPostal("");
    setCountry("");
    setLatitude(null);
    setLongitude(null);
    setPriceRange("");
    setIsMain(false);
  }, []);

  const canSave = name.trim().length >= 2 && placeId !== "all" && !isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : (setOpen(false), reset()))}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Add Branch
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Add a new branch</DialogTitle>
          <DialogDescription>
            Provide details and pick a map location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Place</Label>
              <Select value={placeId} onValueChange={(v) => setPlaceId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Place" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select a place</SelectItem>
                  {places.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branch-name">Name</Label>
              <Input
                id="branch-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="branch-phone">Phone</Label>
                <Input
                  id="branch-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch-website">Website</Label>
                <Input
                  id="branch-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branch-address1">Address Line 1</Label>
              <Input
                id="branch-address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branch-address2">Address Line 2</Label>
              <Input
                id="branch-address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="branch-city">City</Label>
                <Input
                  id="branch-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch-state">State</Label>
                <Input
                  id="branch-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch-postal">Postal Code</Label>
                <Input
                  id="branch-postal"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="branch-country">Country</Label>
                <Input
                  id="branch-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch-price">Price Range (1-5)</Label>
                <Input
                  id="branch-price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branch-main">Is Main Branch</Label>
              <Input
                id="branch-main"
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Location</Label>
            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
            <div className="text-muted-foreground text-sm">
              {latitude != null && longitude != null
                ? `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
                : "Click on map to set location"}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={() =>
              create(
                {
                  place_id: placeId,
                  name,
                  phone: phone || null,
                  website_url: website || null,
                  address_line1: address1 || null,
                  address_line2: address2 || null,
                  city: city || null,
                  state: state || null,
                  postal_code: postal || null,
                  country: country || null,
                  latitude,
                  longitude,
                  price_range: priceRange ? Number(priceRange) : null,
                  is_main_branch: isMain,
                  is_active: true,
                },
                { onSuccess: () => (reset(), setOpen(false)) }
              )
            }
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
