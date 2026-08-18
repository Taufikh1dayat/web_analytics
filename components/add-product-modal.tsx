'use client';

import React, { useState, useRef } from 'react';
import { CoffeeMenuProduct } from '@/types';
import {
  X,
  Plus,
  DollarSign,
  Tag,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Box,
  UploadCloud,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: CoffeeMenuProduct) => void;
}

// Preset default image based on category if user doesn't provide custom photo
const defaultImagesByCategory: Record<CoffeeMenuProduct['category'], string> = {
  Coffee: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
  'Non-Coffee': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
  Pastry: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
  Snack: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CoffeeMenuProduct['category']>('Coffee');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [description, setDescription] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Photo Upload State
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImageBase64(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClearUploadedImage = () => {
    setUploadedImageBase64(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    // Generate ID based on category
    const prefix =
      category === 'Coffee'
        ? 'KOP'
        : category === 'Non-Coffee'
        ? 'NON'
        : category === 'Pastry'
        ? 'PAS'
        : 'SNK';

    // Determine final image: uploaded file > typed URL > category default
    let finalImage = defaultImagesByCategory[category];
    if (photoMode === 'upload' && uploadedImageBase64) {
      finalImage = uploadedImageBase64;
    } else if (photoMode === 'url' && imageUrl.trim()) {
      finalImage = imageUrl.trim();
    }

    const newProduct: CoffeeMenuProduct = {
      id: `${prefix}-${Math.floor(10 + Math.random() * 90)}`,
      name: name.trim(),
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 50,
      description: description.trim() || `${name.trim()} spesial khas Kedai Kopi Kelayu.`,
      image: finalImage,
      rating: 4.8,
      isBestSeller,
    };

    onAddProduct(newProduct);
    onClose();

    // Reset Form
    setName('');
    setCategory('Coffee');
    setPrice('');
    setStock('50');
    setDescription('');
    setImageUrl('');
    setUploadedImageBase64(null);
    setFileName(null);
    setIsBestSeller(false);
  };

  // Current preview image source
  const currentPreview =
    photoMode === 'upload'
      ? uploadedImageBase64
      : imageUrl.trim() || defaultImagesByCategory[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Menu Baru</h3>
              <p className="text-[11px] text-slate-400">Menu akan langsung tersedia di Kasir POS & Katalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Nama Produk */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Nama Menu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Avocado Coffee Float / Red Velvet Latte"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Kategori & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Kategori Menu
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CoffeeMenuProduct['category'])}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Coffee">Coffee</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Pastry">Pastry</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1000"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 28000"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Stok Awal & Best Seller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-amber-400" /> Jumlah Stok Awal
              </label>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tandai Best Seller
                </span>
              </label>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Deskripsi Menu
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan aroma, rasa, atau bahan utama menu ini..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Foto Produk: Drag & Drop vs URL Tab */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Foto Menu Produk
              </label>
              
              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    photoMode === 'upload'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Upload / Drag & Drop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    photoMode === 'url'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Link URL</span>
                </button>
              </div>
            </div>

            {/* Upload Area (Drag & Drop) */}
            {photoMode === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!uploadedImageBase64 ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                      isDragging
                        ? 'border-amber-500 bg-amber-950/20'
                        : 'border-slate-800 bg-slate-950/70 hover:border-amber-500/50 hover:bg-slate-950'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">
                        Klik untuk upload atau tarik foto ke sini
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Mendukung format PNG, JPG, JPEG, WEBP
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={uploadedImageBase64}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-800"
                      />
                      <div>
                        <p className="font-semibold text-slate-200 text-xs truncate max-w-[200px]">
                          {fileName || 'Foto Produk Terunggah'}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          ✓ Foto Siap Digunakan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={handleClearUploadedImage}
                        className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL Input Mode */}
            {photoMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-500">
                  Kosongkan jika ingin menggunakan foto preset bawaan kategori {category}.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Terbitkan Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
