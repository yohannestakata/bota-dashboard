export type RequestStatus = "pending" | "approved" | "rejected";

export type ProposedPlace = {
  name?: string | null;
  description?: string | null;
  category_id?: number | null;
};

export type ProposedBranch = {
  name?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_main_branch?: boolean | null;
};

export type RequestRow = {
  id: string;
  created_at: string;
  status: RequestStatus;
  proposed_place?: unknown;
  proposed_branch?: unknown;
  profiles?: { full_name?: string | null; username?: string | null } | null;
};
