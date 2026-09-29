"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Store,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  FileText,
  Banknote,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Chrome,
} from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import UnderReviewPopup from "../components/UnderReviewPopup";

const AUTH_BASE_API = "http://localhost:5000/api/auth";
const AUTH_API = `${AUTH_BASE_API}/register`;
const RESTAURANT_API = "http://localhost:5000/api/restaurants";

const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const cuisineOptions = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Biryani",
  "Pizza",
  "Burger",
  "Fast Food",
  "Bakery",
  "Sweets",
  "Cafe",
  "Tandoori",
  "Hyderabadi",
];

const businessTypes = [
  "Restaurant",
  "Cloud Kitchen",
  "Hotel",
  "Cafe",
  "Bakery",
  "Sweet Shop",
];

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  multiple = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-black mb-1">
      {label}
    </label>

    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      )}

      <input
        type={type}
        name={name}
        value={type === "file" ? undefined : value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}
        className={`w-full ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none text-black disabled:bg-gray-100`}
      />
    </div>
  </div>
);

const PartnerRegister = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    restaurantName: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    restaurantPhone: "",
    restaurantEmail: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    logo: null,
    coverImage: null,
    fssaiNumber: "",
    fssaiDocument: null,
    gstNumber: "",
    gstDocument: null,
    panNumber: "",
    registrationCertificate: null,
    businessType: "Restaurant",
    cuisines: [],
    foodType: "Both",
    preparationTime: "",
    minimumOrderValue: "",
    deliveryRadius: "",
    openingTime: "",
    closingTime: "",
    dineIn: "No",
    takeaway: "Yes",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    panCard: null,
    cancelledCheque: null,
    outletPhotos: [],
    menuPdf: null,
    aboutRestaurant: "",
    popularDishes: "",
    referralCode: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setError("");

    if (type === "file") {
      if (name === "outletPhotos") {
        setFormData((prev) => ({
          ...prev,
          outletPhotos: Array.from(files || []),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: files?.[0] || null,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleCuisine = (cuisine) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((item) => item !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
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
        ownerName: prev.ownerName || googleUser.displayName || "",
        ownerEmail: googleUser.email || prev.ownerEmail,
        restaurantEmail: prev.restaurantEmail || googleUser.email || "",
      }));
    } catch (err) {
      console.error("Google signup error:", err);
      setError(err.message || "Google signup failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
      },
      () => setError("Unable to get location")
    );
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.restaurantName.trim()) return setError("Restaurant name required");
      if (!formData.ownerName.trim()) return setError("Owner name required");
      if (!formData.ownerPhone.trim()) return setError("Owner phone required");
      if (!/^[6-9]\d{9}$/.test(formData.ownerPhone)) return setError("Enter valid 10 digit Indian mobile number");
      if (!formData.ownerEmail.trim()) return setError("Owner email required");
      if (!formData.address.trim()) return setError("Address required");
      if (!formData.pincode.trim()) return setError("Pincode required");
    }

    if (step === 2) {
      if (!formData.fssaiNumber.trim()) return setError("FSSAI number required");
      if (!formData.panNumber.trim()) return setError("PAN number required");
    }

    if (step === 3) {
      if (formData.cuisines.length === 0) return setError("Select cuisines");
      if (!formData.preparationTime) return setError("Preparation time required");
      if (!formData.minimumOrderValue) return setError("Minimum order value required");
      if (!formData.deliveryRadius) return setError("Delivery radius required");
    }

    if (step === 4) {
      if (!formData.accountHolderName.trim()) return setError("Account holder name required");
      if (!formData.bankName.trim()) return setError("Bank name required");
      if (!formData.accountNumber.trim()) return setError("Account number required");
      if (!formData.ifscCode.trim()) return setError("IFSC code required");
    }

    if (step === 6) {
      if (!firebaseIdToken && !formData.password) return setError("Password required");
      if (!firebaseIdToken && formData.password.length < 6) return setError("Password minimum 6 characters");
      if (!firebaseIdToken && formData.password !== formData.confirmPassword) return setError("Passwords do not match");
      if (!formData.agreeTerms) return setError("Please accept terms");
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep() === true) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep() !== true) return;

    try {
      setIsLoading(true);
      setError("");

      const registerResponse = await fetch(AUTH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          password: formData.password,
          role: "partner",
          firebaseIdToken,
        }),
      });

      const registerData = await parseApiResponse(registerResponse);

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Partner registration failed");
      }

      const token = registerData.token;

      if (!token) {
        throw new Error("Token not received from backend");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registerData.user));

      const restaurantData = new FormData();

      const skipKeys = ["password", "confirmPassword", "agreeTerms"];

      Object.entries(formData).forEach(([key, value]) => {
        if (skipKeys.includes(key)) return;

        if (key === "cuisines") {
          restaurantData.append("cuisines", JSON.stringify(value));
        } else if (key === "outletPhotos") {
          value.forEach((file) => restaurantData.append("outletPhotos", file));
        } else if (value !== null && value !== "") {
          restaurantData.append(key, value);
        }
      });

      const restaurantResponse = await fetch(RESTAURANT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: restaurantData,
      });

      const restaurantResult = await parseApiResponse(restaurantResponse);

      if (!restaurantResponse.ok) {
        throw new Error(restaurantResult.message || "Restaurant creation failed");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("restaurant");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("restaurant");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setSuccess(true);

      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
        <UnderReviewPopup
          open
          showClose={false}
          title="Registration submitted"
          message="Your restaurant account is now under admin review. You can login after approval."
          primaryLabel="Back to login"
          onPrimary={() => router.push("/Login")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-red-600 to-black"></div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-3">
              <Store className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-black">
              Partner Restaurant Registration
            </h1>
            <p className="text-gray-500 mt-1">Step {step} of 6</p>
          </div>

          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold transition ${
                firebaseIdToken
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              } disabled:opacity-60`}
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

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-red-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Restaurant / Hotel Name *" name="restaurantName" value={formData.restaurantName} onChange={handleChange} icon={Store} />
                <InputField label="Owner Name *" name="ownerName" value={formData.ownerName} onChange={handleChange} icon={User} />
                <InputField label="Owner Phone Number *" name="ownerPhone" type="tel" value={formData.ownerPhone} onChange={handleChange} placeholder="9876543210" icon={Phone} />

                <InputField label="Owner Email ID *" name="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} icon={Mail} />
                <InputField label="Restaurant Phone Number" name="restaurantPhone" value={formData.restaurantPhone} onChange={handleChange} icon={Phone} />
                <InputField label="Restaurant Email ID" name="restaurantEmail" type="email" value={formData.restaurantEmail} onChange={handleChange} icon={Mail} />
                <InputField label="Full Address *" name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                <InputField label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} />
                <InputField label="Pincode *" name="pincode" value={formData.pincode} onChange={handleChange} />
                <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                <InputField label="State" name="state" value={formData.state} onChange={handleChange} />

                <div className="md:col-span-2">
                  <button type="button" onClick={getCurrentLocation} className="px-4 py-3 bg-black text-white rounded-xl">
                    Use Current Location
                  </button>
                </div>

                <InputField label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
                <InputField label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
                <InputField label="Restaurant Logo" name="logo" type="file" onChange={handleChange} icon={ImageIcon} />
                <InputField label="Cover / Banner Image" name="coverImage" type="file" onChange={handleChange} icon={ImageIcon} />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="FSSAI License Number " name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} icon={FileText} />
                <InputField label="Upload FSSAI Document" name="fssaiDocument" type="file" onChange={handleChange} />
                <InputField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                <InputField label="Upload GST Certificate" name="gstDocument" type="file" onChange={handleChange} />
                <InputField label="PAN Card Number " name="panNumber" value={formData.panNumber} onChange={handleChange} />
                <InputField label="Registration Certificate Optional" name="registrationCertificate" type="file" onChange={handleChange} />

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Type of Business
                  </label>
                  <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black">
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cuisines *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <button
                        type="button"
                        key={cuisine}
                        onClick={() => toggleCuisine(cuisine)}
                        className={`px-4 py-2 rounded-full border ${
                          formData.cuisines.includes(cuisine)
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Food Type
                    </label>
                    <select name="foodType" value={formData.foodType} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black">
                      <option>Pure Veg</option>
                      <option>Non-Veg</option>
                      <option>Both</option>
                      <option>Jain</option>
                    </select>
                  </div>

                  <InputField label="Average Preparation Time Minutes *" name="preparationTime" type="number" value={formData.preparationTime} onChange={handleChange} />
                  <InputField label="Minimum Order Value *" name="minimumOrderValue" type="number" value={formData.minimumOrderValue} onChange={handleChange} />
                  <InputField label="Delivery Radius KM *" name="deliveryRadius" type="number" value={formData.deliveryRadius} onChange={handleChange} />
                  <InputField label="Opening Time" name="openingTime" type="time" value={formData.openingTime} onChange={handleChange} />
                  <InputField label="Closing Time" name="closingTime" type="time" value={formData.closingTime} onChange={handleChange} />

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Dine-in Support</label>
                    <select name="dineIn" value={formData.dineIn} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Takeaway Support</label>
                    <select name="takeaway" value={formData.takeaway} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Account Holder Name *" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} icon={Banknote} />
                <InputField label="Bank Name *" name="bankName" value={formData.bankName} onChange={handleChange} />
                <InputField label="Account Number *" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                <InputField label="IFSC Code *" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                <InputField label="UPI ID Optional" name="upiId" value={formData.upiId} onChange={handleChange} />
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="PAN Card Upload" name="panCard" type="file" onChange={handleChange} />
                <InputField label="Cancelled Cheque / Passbook Photo" name="cancelledCheque" type="file" onChange={handleChange} />
                <InputField label="Shop / Outlet Photos Minimum 2-3" name="outletPhotos" type="file" onChange={handleChange} multiple />
                <InputField label="Menu PDF Optional" name="menuPdf" type="file" onChange={handleChange} />
              </div>
            )}

            {step === 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">
                    About Restaurant
                  </label>
                  <textarea name="aboutRestaurant" value={formData.aboutRestaurant} onChange={handleChange} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-red-600 outline-none" />
                </div>

                <InputField label="Popular Dishes" name="popularDishes" value={formData.popularDishes} onChange={handleChange} />
                <InputField label="Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} />

                {!firebaseIdToken ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 outline-none text-black" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5">
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 outline-none text-black" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5">
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    Your Google account is connected. You can submit without creating a password.
                  </div>
                )}

                <div className="md:col-span-2 flex gap-2">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
                  <p className="text-sm text-black">
                    I agree to the Terms and Conditions
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="px-5 py-3 bg-gray-200 text-black rounded-xl flex items-center gap-2">
                  <ArrowLeft size={18} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button type="button" onClick={nextStep} className="px-5 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2">
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-red-600 to-black text-white rounded-xl disabled:opacity-60">
                  {isLoading ? "Submitting..." : "Submit Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
