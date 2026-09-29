"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Bike,
  ShieldCheck,
  CreditCard,
  FileText,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Chrome,
  Upload,
  Gift,
  GraduationCap,
  Briefcase,
  HeartHandshake,
} from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const saveDeliverySession = (data) => {
  localStorage.setItem("deliveryToken", data.token);
  localStorage.setItem("deliveryUser", JSON.stringify(data.user));
  if (data.partner) {
    localStorage.setItem("deliveryPartner", JSON.stringify(data.partner));
  }

  document.cookie = `deliveryToken=${data.token}; path=/; max-age=86400; SameSite=Lax`;
};

export default function DeliveryPartnerSignup() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSection, setCurrentSection] = useState("basic");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState("");

  const [formData, setFormData] = useState({
    // Login / Basic
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
    preferredZone: "",

    // KYC
    aadhaarNumber: "",
    panNumber: "",
    voterId: "",

    // Vehicle
    vehicleType: "bike",
    drivingLicenseNumber: "",
    drivingLicenseExpiry: "",
    vehicleRegistrationNumber: "",
    vehicleInsurance: "",
    pucCertificate: "",

    // Bank
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    upiId: "",

    // Other
    referralCode: "",
    educationQualification: "",
    experience: "",
    emergencyContact: "",

    // Auth
    password: "",
    confirmPassword: "",

    // Files
    profilePhoto: null,
    aadhaarFront: null,
    aadhaarBack: null,
    drivingLicensePhoto: null,
    cancelledCheque: null,
  });

  const sections = [
    { id: "basic", title: "Basic Info", icon: User },
    { id: "kyc", title: "KYC Details", icon: ShieldCheck },
    { id: "vehicle", title: "Vehicle", icon: Bike },
    { id: "bank", title: "Bank", icon: CreditCard },
    { id: "other", title: "Other", icon: FileText },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setError("");
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      setIsGoogleLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const firebaseResult = await signInWithPopup(auth, provider);
      const verifiedIdToken = await firebaseResult.user.getIdToken();
      const googleUser = firebaseResult.user;

      setFirebaseIdToken(verifiedIdToken);
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || googleUser.displayName || "",
        email: googleUser.email || prev.email,
      }));
    } catch (err) {
      console.error("Delivery Google signup error:", err);
      setError(err.message || "Google signup failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return setError("Full name is required"), false;
    if (!/^[0-9]{10}$/.test(formData.phone)) return setError("Enter valid 10-digit mobile number"), false;
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Enter valid email address"), false;
    }
    if (!formData.dob) return setError("Date of birth is required"), false;
    if (!formData.age || Number(formData.age) < 18) return setError("Age must be 18 or above"), false;
    if (!formData.gender) return setError("Please select gender"), false;
    if (!formData.address || !formData.city || !formData.pincode) {
      return setError("Address, city and pin code are required"), false;
    }
    if (!formData.preferredZone) return setError("Preferred delivery area is required"), false;

    if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
      return setError("Enter valid 12-digit Aadhaar number"), false;
    }
    if (!formData.panNumber) return setError("PAN number is required"), false;

    if (!formData.vehicleType) return setError("Vehicle type is required"), false;

    if (formData.vehicleType !== "cycle" && formData.vehicleType !== "walking") {
      if (!formData.drivingLicenseNumber) return setError("Driving licence number is required"), false;
      if (!formData.drivingLicenseExpiry) return setError("Driving licence expiry date is required"), false;
      if (!formData.vehicleRegistrationNumber) return setError("Vehicle registration number is required"), false;
    }

    if (!formData.bankAccountNumber) return setError("Bank account number is required"), false;
    if (!formData.ifscCode) return setError("IFSC code is required"), false;
    if (!formData.accountHolderName) return setError("Account holder name is required"), false;

    if (!formData.emergencyContact || !/^[0-9]{10}$/.test(formData.emergencyContact)) {
      return setError("Enter valid emergency contact number"), false;
    }

    if (!firebaseIdToken && formData.password.length < 6) return setError("Password must be at least 6 characters"), false;
    if (!firebaseIdToken && formData.password !== formData.confirmPassword) return setError("Passwords do not match"), false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        firebaseIdToken,
        dob: formData.dob,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        preferredZone: formData.preferredZone,

        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        voterId: formData.voterId,

        vehicleType: formData.vehicleType,
        drivingLicenseNumber: formData.drivingLicenseNumber,
        drivingLicenseExpiry: formData.drivingLicenseExpiry,
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber,
        vehicleInsurance: formData.vehicleInsurance,
        pucCertificate: formData.pucCertificate,

        bankAccountNumber: formData.bankAccountNumber,
        ifscCode: formData.ifscCode,
        accountHolderName: formData.accountHolderName,
        upiId: formData.upiId,

        referralCode: formData.referralCode,
        educationQualification: formData.educationQualification,
        experience: formData.experience,
        emergencyContact: formData.emergencyContact,

        isAvailable: false,
      };

      const response = await fetch("http://localhost:5000/api/delivery-partner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(response);

      if (response.ok) {
        saveDeliverySession(data);
        router.replace("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white text-gray-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-4">
            <Bike className="text-white" size={34} />
          </div>
          <h1 className="text-4xl font-bold text-white">Become a Delivery Partner</h1>
            <p className="text-orange-100 mt-2">
              Complete your profile and start earning with Ruchibazzar
            </p>
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition disabled:opacity-60 ${
                firebaseIdToken
                  ? "bg-green-50 text-green-700"
                  : "bg-white text-gray-800 hover:bg-orange-50"
              }`}
            >
              {isGoogleLoading ? (
                "Connecting..."
              ) : (
                <>
                  {firebaseIdToken ? <CheckCircle size={18} /> : <Chrome size={18} />}
                  {firebaseIdToken ? "Google account connected" : "Sign up with Google"}
                </>
              )}
            </button>
          </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Partner Registration</h2>
                <p className="text-orange-100 text-sm">
                  Basic info, KYC, vehicle, bank and emergency details
                </p>
              </div>

              <div className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                18+ verification required
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="bg-orange-50 p-5 border-r border-orange-100">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        currentSection === section.id
                          ? "bg-orange-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      <Icon size={18} />
                      {section.title}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 bg-white rounded-2xl p-4 border border-orange-100">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-orange-600 mt-0.5" size={18} />
                  <p className="text-xs text-gray-600">
                    Keep your Aadhaar, PAN, licence, RC and bank details ready before submitting.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-3 p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {currentSection === "basic" && (
                <Section title="Basic Personal Information">
                  <Input icon={User} label="Full Name as per Aadhaar *" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" className={inputClass} />
                  <Input icon={Phone} label="Mobile Number *" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" maxLength="10" className={inputClass} />
                  <Input icon={Mail} label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="partner@example.com" className={inputClass} />
                  <Input icon={Calendar} label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleChange} className={inputClass} />
                  <Input icon={Calendar} label="Age *" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="18+" className={inputClass} />

                  <Select icon={User} label="Gender *" name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>

                  <Input icon={MapPin} label="Current Address *" name="address" value={formData.address} onChange={handleChange} placeholder="House no, street, landmark" className={inputClass} />
                  <Input icon={MapPin} label="City *" name="city" value={formData.city} onChange={handleChange} placeholder="Adilabad" className={inputClass} />
                  <Input icon={MapPin} label="Pin Code *" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="504001" maxLength="6" className={inputClass} />
                  <Input icon={MapPin} label="Preferred Delivery Area / Zone *" name="preferredZone" value={formData.preferredZone} onChange={handleChange} placeholder="Example: Bus stand, market area" className={inputClass} />
                </Section>
              )}

              {currentSection === "kyc" && (
                <Section title="Identity & KYC Details">
                  <Input icon={ShieldCheck} label="Aadhaar Card Number *" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar number" maxLength="12" className={inputClass} />
                  <Input icon={ShieldCheck} label="PAN Card Number *" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" className={inputClass} />
                  <Input icon={ShieldCheck} label="Voter ID optional" name="voterId" value={formData.voterId} onChange={handleChange} placeholder="If no Aadhaar" className={inputClass} />
                  <FileInput label="Upload Aadhaar Front Photo" name="aadhaarFront" onChange={handleChange} />
                  <FileInput label="Upload Aadhaar Back Photo" name="aadhaarBack" onChange={handleChange} />
                </Section>
              )}

              {currentSection === "vehicle" && (
                <Section title="Vehicle Details">
                  <Select icon={Bike} label="Vehicle Type *" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={inputClass}>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="cycle">Cycle</option>
                    <option value="walking">Walking</option>
                  </Select>

                  <Input icon={FileText} label="Driving Licence Number" name="drivingLicenseNumber" value={formData.drivingLicenseNumber} onChange={handleChange} placeholder="DL number" className={inputClass} />
                  <Input icon={Calendar} label="Driving Licence Expiry Date" name="drivingLicenseExpiry" type="date" value={formData.drivingLicenseExpiry} onChange={handleChange} className={inputClass} />
                  <Input icon={Bike} label="Vehicle Registration Number / RC" name="vehicleRegistrationNumber" value={formData.vehicleRegistrationNumber} onChange={handleChange} placeholder="TS 01 AB 1234" className={inputClass} />
                  <Input icon={ShieldCheck} label="Vehicle Insurance" name="vehicleInsurance" value={formData.vehicleInsurance} onChange={handleChange} placeholder="Insurance policy / validity" className={inputClass} />
                  <Input icon={FileText} label="PUC Certificate" name="pucCertificate" value={formData.pucCertificate} onChange={handleChange} placeholder="PUC details" className={inputClass} />
                  <FileInput label="Upload Driving Licence Photo" name="drivingLicensePhoto" onChange={handleChange} />
                </Section>
              )}

              {currentSection === "bank" && (
                <Section title="Bank Details for Weekly Payouts">
                  <Input icon={CreditCard} label="Bank Account Number *" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="Enter account number" className={inputClass} />
                  <Input icon={CreditCard} label="IFSC Code *" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="Example: HDFC0001234" className={inputClass} />
                  <Input icon={User} label="Account Holder Name *" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="As per bank" className={inputClass} />
                  <Input icon={CreditCard} label="UPI ID optional" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="example@upi" className={inputClass} />
                  <FileInput label="Upload Cancelled Cheque / Passbook Photo" name="cancelledCheque" onChange={handleChange} />
                </Section>
              )}

              {currentSection === "other" && (
                <Section title="Other Details">
                  <FileInput label="Upload Profile Photo" name="profilePhoto" onChange={handleChange} icon={Camera} />
                  <Input icon={Gift} label="Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="Optional" className={inputClass} />
                  <Input icon={GraduationCap} label="Education Qualification" name="educationQualification" value={formData.educationQualification} onChange={handleChange} placeholder="Example: 10th / Inter / Degree" className={inputClass} />
                  <Input icon={Briefcase} label="Previous Delivery Experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Optional" className={inputClass} />
                  <Input icon={HeartHandshake} label="Emergency Contact Number *" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="10-digit number" maxLength="10" className={inputClass} />

                  {!firebaseIdToken ? (
                    <>
                      <PasswordInput
                        label="Password *"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        show={showPassword}
                        setShow={setShowPassword}
                        inputClass={inputClass}
                      />

                      <PasswordInput
                        label="Confirm Password *"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                        inputClass={inputClass}
                      />
                    </>
                  ) : (
                    <div className="md:col-span-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                      Your Google account is connected. You can submit without creating a password.
                    </div>
                  )}
                </Section>
              )}

              <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    const index = sections.findIndex((s) => s.id === currentSection);
                    if (index > 0) setCurrentSection(sections[index - 1].id);
                  }}
                  className="md:w-40 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Previous
                </button>

                {currentSection !== "other" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const index = sections.findIndex((s) => s.id === currentSection);
                      setCurrentSection(sections[index + 1].id);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Save & Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                  >
                    {isLoading ? "Registering..." : "Register as Delivery Partner"}
                  </button>
                )}
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-5">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Input({ icon: Icon, label, className, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 text-gray-400" size={19} />
        <input {...props} className={className} />
      </div>
    </div>
  );
}

function Select({ icon: Icon, label, className, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 text-gray-400" size={19} />
        <select {...props} className={`${className} appearance-none`}>
          {children}
        </select>
      </div>
    </div>
  );
}

function FileInput({ label, name, onChange, icon: Icon = Upload }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:bg-orange-50 transition">
        <Icon size={20} className="text-orange-600" />
        <span className="text-sm text-gray-600">Choose file</span>
        <input type="file" name={name} onChange={onChange} className="hidden" accept="image/*,.pdf" />
      </label>
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, setShow, inputClass }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-3.5 text-gray-400" size={19} />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Minimum 6 characters"
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3.5 text-gray-400"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}
