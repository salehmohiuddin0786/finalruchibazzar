import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Scale, Clock, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export const metadata = {
  title: "Grievance Redressal Mechanism",
  description: "Official Grievance Redressal Mechanism for Ruchi Bazaar customers and partners pursuant to Consumer Protection (E-Commerce) Rules, 2020.",
};

export default function GrievancePage() {
  return (
    <LegalPageLayout
      title="Grievance Redressal Policy"
      subtitle="Dedicated institutional framework for escalations, customer complaints, and dispute resolution pursuant to Indian E-Commerce Rules."
      badge="CONSUMER PROTECTION"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Compliance Notice */}
        <section className="bg-red-50/70 border border-red-200 rounded-xl p-5 text-slate-800">
          <p className="font-semibold text-slate-900 mb-1">
            Statutory Compliance Under Consumer Protection (E-Commerce) Rules, 2020
          </p>
          <p className="text-xs sm:text-sm text-slate-700">
            Ruchi Bazaar is committed to fair business practices and consumer satisfaction. In accordance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020, 
            this document sets forth our transparent escalation procedure and official Grievance Officer details.
          </p>
        </section>

        {/* Multi-Level Escalation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Scale className="w-5 h-5 text-red-600" />
            <h2>Multi-Tier Dispute Escalation Matrix</h2>
          </div>

          <div className="space-y-3">
            {/* Level 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                L1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Level 1: 24/7 Customer Care Helpdesk</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  For active delivery delays, missing food items, payment deductions, or app queries. 
                  Contact our in-app chat or email <strong>support@ruchibazaar.in</strong> (Toll-Free: 1800-123-456).
                </p>
                <div className="mt-2 text-xs font-semibold text-emerald-700">
                  ⚡ Average Resolution Time: 2 to 4 hours (Acknowledge: Instant)
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                L2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Level 2: Grievance Officer Escalation</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  If your ticket is unresolved after 24 hours at Level 1, or if you are dissatisfied with the customer care outcome, you may escalate directly to the Grievance Officer.
                </p>
                <div className="mt-2 text-xs font-semibold text-orange-700">
                  ⚡ Statutory Acknowledgment: 48 hours | Resolution: within 15 days
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                L3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Level 3: Nodal Officer (Legal &amp; Regulatory)</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  For legal notices, statutory governmental inquiries, law enforcement coordination, or unresolved Level 2 disputes.
                </p>
                <div className="mt-2 text-xs font-semibold text-slate-700">
                  ⚡ Official Response: within 7 business days
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Designated Officers Details */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <FileText className="w-5 h-5 text-red-600" />
            <h2>Appointed Grievance &amp; Nodal Officers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>Grievance Officer</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 space-y-1.5">
                <p><strong>Name:</strong> Vikram Deshmukh</p>
                <p><strong>Designation:</strong> Head of Consumer Grievances</p>
                <p><strong>Email:</strong> grievance@ruchibazaar.in</p>
                <p><strong>Helpline:</strong> +91 22 6789 0123</p>
                <p><strong>Hours:</strong> Mon–Fri, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Address:</strong> Corporate Tower B, 4th Floor, BKC, Mumbai, Maharashtra 400051</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Scale className="w-5 h-5 text-orange-600" />
                <span>Nodal Officer</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 space-y-1.5">
                <p><strong>Name:</strong> Ananya Sengupta</p>
                <p><strong>Designation:</strong> Legal Counsel &amp; Nodal Head</p>
                <p><strong>Email:</strong> nodal@ruchibazaar.in</p>
                <p><strong>Helpline:</strong> +91 22 6789 0124</p>
                <p><strong>Hours:</strong> Mon–Fri, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Address:</strong> Corporate Tower B, 4th Floor, BKC, Mumbai, Maharashtra 400051</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to submit */}
        <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
          <h3 className="font-bold text-slate-900">How to File an Escalated Grievance</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Please include: (1) Your registered mobile number, (2) Order ID (if applicable), (3) Level 1 Customer Care Ticket number, 
            and (4) A brief summary of the unresolved issue. Your escalation will receive an automated tracking ticket within 48 hours.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
