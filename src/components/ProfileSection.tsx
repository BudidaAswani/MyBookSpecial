// src/components/ProfileSection.tsx
import React, { useEffect, useState } from "react";

interface ProfileSectionProps {
  isLoggedIn: boolean;
  currentUserEmail?: string | null; // important: used as key for per-user storage
  currentUserName?: string | null;
}

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

const PROFILES_KEY = "profiles"; // localStorage key that maps email -> profile

export default function ProfileSection({
  isLoggedIn,
  currentUserEmail,
  currentUserName,
}: ProfileSectionProps) {
  const [editMode, setEditMode] = useState(false);
  const [savedProfileSnapshot, setSavedProfileSnapshot] = useState<UserProfile | null>(null);

  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [user, setUser] = useState<UserProfile>(emptyProfile);

  // helpers to read/write the profiles map in localStorage
  const readProfiles = (): Record<string, UserProfile> => {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const writeProfiles = (profiles: Record<string, UserProfile>) => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save profiles", e);
    }
  };

  // load current user's profile on mount and whenever currentUserEmail changes
  useEffect(() => {
    if (!isLoggedIn || !currentUserEmail) {
      // clear view if no logged in user
      setUser(emptyProfile);
      setSavedProfileSnapshot(null);
      return;
    }

    const profiles = readProfiles();
    const profileForUser = profiles[currentUserEmail];

    if (profileForUser) {
      setUser(profileForUser);
      setSavedProfileSnapshot(profileForUser);
    } else {
      // initialize with provided name/email props if present
      const initial: UserProfile = {
        name: currentUserName ?? "",
        email: currentUserEmail,
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      };
      setUser(initial);
      setSavedProfileSnapshot(initial);
      // don't auto-save here (wait until user clicks Save)
    }
  }, [isLoggedIn, currentUserEmail, currentUserName]);

  const handleSave = () => {
    if (!currentUserEmail) {
      alert("No logged-in user detected.");
      return;
    }

    const profiles = readProfiles();
    // ensure email field on profile matches the login email
    const toSave: UserProfile = { ...user, email: currentUserEmail };
    profiles[currentUserEmail] = toSave;
    writeProfiles(profiles);
    setSavedProfileSnapshot(toSave);
    setEditMode(false);
    // feedback
    try {
      // prefer toast if available, otherwise fallback to alert
      // @ts-ignore
      if (typeof window?.toast === "function") window.toast("Profile saved");
    } catch {}
    // small user-friendly message
    alert("Profile updated for " + currentUserEmail);
  };

  const handleCancel = () => {
    // restore saved snapshot for this user (or empty)
    if (savedProfileSnapshot) {
      setUser(savedProfileSnapshot);
    } else {
      setUser({
        name: currentUserName ?? "",
        email: currentUserEmail ?? "",
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
    setEditMode(false);
  };

  if (!isLoggedIn) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2l shadow">
          <p className="text-center text-gray-700">Please log in to view your profile.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Profile</h2>

        {/* VIEW MODE */}
        {!editMode && (
          <>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Name: </span> {user.name || "—"}
              </p>
              <p>
                <span className="font-semibold">Email: </span> {currentUserEmail || user.email || "—"}
              </p>
              <p>
                <span className="font-semibold">Phone: </span> {user.phone || "Not set"}
              </p>

              <p className="mt-3 font-semibold">Address:</p>
              <div className="ml-3 space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">House:</span> {user.house || "—"}
                </p>
                <p>
                  <span className="font-medium">Street:</span> {user.street || "—"}
                </p>
                <p>
                  <span className="font-medium">City:</span> {user.city || "—"}
                </p>
                <p>
                  <span className="font-medium">State:</span> {user.state || "—"}
                </p>
                <p>
                  <span className="font-medium">Pincode:</span> {user.pincode || "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-green-700 text-white rounded-lg"
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  // simple logout behavior: remove 'authUser' (your app might handle logout centrally)
                  try {
                    localStorage.removeItem("authUser");
                    // after clearing, reload so app picks up logged-out state
                    window.location.reload();
                  } catch {
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Logout
              </button>
            </div>
          </>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <>
            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Name"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Phone"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.house}
                onChange={(e) => setUser({ ...user, house: e.target.value })}
                placeholder="House No"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.street}
                onChange={(e) => setUser({ ...user, street: e.target.value })}
                placeholder="Street"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.city}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                placeholder="City"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.state}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
                placeholder="State"
              />

              <input
                className="w-full p-2 border rounded"
                value={user.pincode}
                onChange={(e) => setUser({ ...user, pincode: e.target.value })}
                placeholder="Pincode"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-700 text-white rounded-lg"
              >
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
