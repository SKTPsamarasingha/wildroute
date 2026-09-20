"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/ecommerce";
import {
  getProducts,
  saveProduct,
  deleteProduct,
  INITIAL_CATEGORIES,
} from "@/services/productService";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Add / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("apparel-outerwear");
  const [price, setPrice] = useState(10000);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState("S, M, L, XL");
  const [colors, setColors] = useState("Forest Pine, Black");

  // Cloudinary File Upload State
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  if (loading) {
    return <LoadingSpinner label="Fetching product inventory..." fullPage />;
  }

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("apparel-outerwear");
    setPrice(15000);
    setStock(15);
    setImageUrl(
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    );
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
    setImageUrl(p.images[0] || "");
    setSizes(p.sizes?.join(", ") || "");
    setColors(p.colors?.join(", ") || "");
    setIsModalOpen(true);
  };

  const handleFileUploadToCloudinary = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        alert("Image upload failed: " + data.error);
      }
    } catch (err) {
      alert("Cloudinary image upload error.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a product image first.");
      return;
    }

    await saveProduct({
      id: editingId || undefined,
      title,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      images: [imageUrl],
      sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      colors: colors ? colors.split(",").map((c) => c.trim()) : [],
    });
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product item?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
            Product Catalog Manager
          </h1>
          <p className="text-xs text-[#5C6B66] mt-1">
            Add raw image files (uploaded directly to Cloudinary), manage
            prices, and edit stock.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-[#23382B] hover:bg-[#192B20] text-white rounded-2xl text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add New Gear Item
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C2826]">
            <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8E9B96]">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price (LKR)</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5] transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-[#F3EFEA] overflow-hidden border border-[#E5DFD5] shrink-0">
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[#1C2826] block truncate max-w-xs">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-[#8E9B96]">
                        ID: {p.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 capitalize">
                    {p.category.replace("-", " ")}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#23382B]">
                    LKR {p.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {p.stock <= 5 ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                        In Stock ({p.stock})
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2 bg-[#FAF8F5] hover:bg-[#EAE3DA] rounded-lg border border-[#E5DFD5] text-[#1C2826]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal with Raw File Upload to Cloudinary */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-[#1C2826] mb-6">
              {editingId ? "Edit Product Item" : "Add New Product Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2826] uppercase mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                />
              </div>

              {/* Raw File Upload Section (Cloudinary Integration) */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl space-y-3">
                <label className="block font-bold text-[#1C2826] uppercase flex items-center justify-between">
                  <span>Product Image (Cloudinary Direct Upload) *</span>
                  {uploadingImage && (
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading
                      to Cloudinary...
                    </span>
                  )}
                </label>

                {imageUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E5DFD5]">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-[#23382B] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-[#192B20] transition">
                    <Upload className="w-4 h-4" /> Select Raw Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadToCloudinary}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#8E9B96]">
                    Uploads file & saves Cloudinary URL
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C2826] uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl font-semibold text-black"
                >
                  {INITIAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C2826] uppercase mb-1">
                    Colors (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full py-3 bg-[#23382B] text-white font-bold rounded-xl hover:bg-[#192B20] transition mt-4 disabled:opacity-50"
              >
                Save Product to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
