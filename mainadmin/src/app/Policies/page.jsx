"use client";

import { ShieldCheck, FileText, Scale, CheckCircle2, AlertTriangle, Eye, ExternalLink } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";

export default function PlatformPolicies() {
  const policyRows = [
    {
      id: "POL-001",
      name: "Privacy Policy",
      scope: "Customer & General",
      version: "v2.4",
      lastAudit: "Sep 2026",
      status: "Active",
      compliance: "DPDP Act & GDPR Ready",
    },
    {
      id: "POL-002",
      name: "Terms & Conditions",
      scope: "Platform-wide",
      version: "v3.1",
      lastAudit: "Sep 2026",
      status: "Active",
      compliance: "IT Act 2000 & Contract Law",
    },
    {
      id: "POL-003",
      name: "Refund & Cancellation Policy",
      scope: "Orders & Billing",
      version: "v2.0",
      lastAudit: "Aug 2026",
      status: "Active",
      compliance: "Consumer Protection Rules 2020",
    },
    {
      id: "POL-004",
      name: "Delivery & Fulfillment Policy",
      scope: "Logistics Fleet",
      version: "v1.8",
      lastAudit: "Aug 2026",
      status: "Active",
      compliance: "Motor Vehicles & Labor Rules",
    },
    {
      id: "POL-005",
      name: "Food Safety & Quality Policy",
      scope: "Merchant Kitchens",
      version: "v2.2",
      lastAudit: "Sep 2026",
      status: "Active",
      compliance: "FSSAI Regulations 2006",
    },
    {
      id: "POL-006",
      name: "Grievance Redressal Policy",
      scope: "Consumer Disputes",
      version: "v2.1",
      lastAudit: "Sep 2026",
      status: "Active",
      compliance: "Rule 5(9) E-Commerce 2020",
    },
    {
      id: "POL-007",
      name: "Restaurant Partner Agreement",
      scope: "Merchants",
      version: "v3.0",
      lastAudit: "Jul 2026",
      status: "Active",
      compliance: "GST Section 52 & TCS",
    },
    {
      id: "POL-008",
      name: "Delivery Partner Code of Conduct",
      scope: "Riders",
      version: "v2.5",
      lastAudit: "Aug 2026",
      status: "Active",
      compliance: "Fleet Safety Standards",
    },
  ];

  return (
    <AdminFeaturePage
      title="Platform Policies &amp; Compliance"
      description="SuperAdmin oversight for legal terms, consumer protection rules, merchant contracts, and statutory compliance status."
      stats={[
        { label: "Active Policies", value: policyRows.length, icon: ShieldCheck },
        { label: "Compliance Score", value: "100%", icon: CheckCircle2 },
        { label: "Grievance TAT", value: "< 24 Hrs", icon: Scale },
        { label: "FSSAI Verified", value: "99.4%", icon: FileText },
      ]}
      rows={policyRows}
      filters={["All", "Customer & General", "Merchant Kitchens", "Logistics Fleet"]}
      columns={[
        { key: "id", label: "Policy ID" },
        { key: "name", label: "Policy Title" },
        { key: "scope", label: "Scope" },
        { key: "version", label: "Version" },
        { key: "compliance", label: "Statutory Grounding" },
        { key: "status", label: "Status" },
      ]}
      loading={false}
      error={null}
      onRefresh={() => {}}
    />
  );
}
