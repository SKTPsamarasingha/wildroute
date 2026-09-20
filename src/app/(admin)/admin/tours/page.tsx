"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Tour } from "@/types/tours";
import { getTours, saveTour, deleteTour } from "@/services/tourService";
import { Plus, Trash2, Edit2, X, MapPin, Upload, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [durationDays, setDurationDays] = useState(2);
  const [pricePerPerson, setPricePerPerson] = useState(25000);
  const [maxGroupSize, setMaxGroupSize] = useState(12);
  const [difficulty, setDifficulty] = useState<
    "Easy" | "Moderate" | "Challenging" | "Extreme"
  >("Moderate");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchTours = () => {
    getTours().then((data) => {
      setTours(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTours();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Fetching tour catalog..." fullPage />;
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("New Guided Trek Expedition");
    setLocation("Knuckles Mountain Range, Sri Lanka");
    setDurationDays(2);
    setPricePerPerson(30000);
    setMaxGroupSize(10);
    setDifficulty("Moderate");
    setImageUrl(
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    );
    setDescription(
      "Guided mountain trek exploring cloud forests, waterfalls, and scenic ridge vistas.",
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour: Tour) => {
    setEditingId(tour.id);
    setTitle(tour.title);
    setLocation(tour.location);
    setDurationDays(tour.durationDays);
    setPricePerPerson(tour.pricePerPerson);
    setMaxGroupSize(tour.maxGroupSize);
    setDifficulty(tour.difficulty);
    setImageUrl(tour.images[0] || "");
    setDescription(tour.description);
    setIsModalOpen(true);
  };

  const modalTitle = editingId ? "Edit Expedition Tour" : "Add Expedition Tour";

  const handleFileUploadToCloudinary = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "tours");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        alert("Tour image upload failed: " + data.error);
      }
    } catch {
      alert("Cloudinary image upload error.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a tour image first.");
      return;
    }

    await saveTour({
      id: editingId || undefined,
      title,
      location,
      durationDays: Number(durationDays),
      pricePerPerson: Number(pricePerPerson),
      maxGroupSize: Number(maxGroupSize),
      difficulty,
      images: [imageUrl],
      description,
      availableDates: ["2026-10-10", "2026-10-24", "2026-11-07"],
      includedGear: ["Camp setup", "Guide support", "Meals"],
      itinerary: [
        {
          day: 1,
          title: "Trail briefing & basecamp setup",
          description: "Arrival and orientation for the expedition.",
          activities: ["Guided briefing", "Trail walk", "Camp setup"],
        },
      ],
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline: "Wild adventure experience",
      featured: true,
      rating: 5,
      reviewCount: 1,
    });
    setIsModalOpen(false);
    fetchTours();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this guided expedition?")) {
      await deleteTour(id);
      fetchTours();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
            Tour Expedition Manager
          </h1>
          <p className="text-xs text-[#5C6B66] mt-1">
            Create, update pricing, set group limits, and upload raw image files
            directly to Cloudinary.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#C86D51] hover:bg-[#B35B40] text-white rounded-2xl text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Create New Tour Expedition
        </button>
      </div>

      {/* Tour Table */}
      <div className="overflow-hidden rounded-3xl border border-[#E5DFD5] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-[#1C2826]">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Tour
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Location
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Difficulty
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Days
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Group
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Price
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px]">
                  Description
                </th>
                <th className="px-4 py-3 font-bold uppercase tracking-wide text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t.id} className="border-t border-[#E5DFD5] align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E5DFD5] bg-[#EAE3DA]">
                        <Image
                          src={
                            t.images[0] ||
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                          }
                          alt={t.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-base text-[#1C2826]">
                          {t.title}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-[#8E9B96]">
                          {t.availableDates?.[0] || "Date TBD"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[#23382B]">
                      <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                      <span>{t.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#F3EFEA] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#23382B]">
                      {t.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#1C2826]">{t.durationDays}</td>
                  <td className="px-4 py-3 text-[#1C2826]">{t.maxGroupSize}</td>
                  <td className="px-4 py-3 font-bold text-[#23382B]">
                    LKR {t.pricePerPerson.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 max-w-xs text-[#5C6B66]">
                    <p className="line-clamp-3">{t.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] p-2 text-[#1C2826] transition hover:bg-[#EAE3DA]"
                        aria-label={`Edit ${t.title}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        aria-label={`Delete ${t.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-serif font-bold text-[#1C2826] mb-6">
              {modalTitle}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2826] uppercase mb-1">
                  Tour Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                />
              </div>

              {/* Raw File Upload to Cloudinary */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl space-y-3">
                <label className="block font-bold text-[#1C2826] uppercase flex items-center justify-between">
                  <span>Tour Banner Image *</span>
                  {uploadingImage && (
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading
                      to Cloudinary...
                    </span>
                  )}
                </label>

                {imageUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#E5DFD5]">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <label className="cursor-pointer px-4 py-2.5 bg-[#C86D51] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-[#B35B40] transition w-max">
                  <Upload className="w-4 h-4" /> Select Raw Tour Image File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadToCloudinary}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#1C2826] uppercase mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Price / Guest
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value as
                          | "Easy"
                          | "Moderate"
                          | "Challenging"
                          | "Extreme",
                      )
                    }
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl font-semibold text-black"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C2826] uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full py-3 bg-[#C86D51] text-white font-bold rounded-xl hover:bg-[#B35B40] transition mt-4 disabled:opacity-50"
              >
                Save Expedition Tour to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
