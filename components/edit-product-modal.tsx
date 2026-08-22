'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CoffeeMenuProduct } from '@/types';
import {
  X,
  Check,
  DollarSign,
  Tag,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Box,
  UploadCloud,
  Link as LinkIcon,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  product: CoffeeMenuProduct | null;
  onClose: () => void;
  onUpdateProduct: (updatedProduct: CoffeeMenuProduct) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onUpdateProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CoffeeMenuProduct['category']>('Coffee');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [description, setDescription] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  // Photo state
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setDescription(product.description);
      setIsBestSeller(!!product.isBestSeller);
      setIsOutOfStock(!!product.isOutOfStock);

      if (product.image.startsWith('data:image')) {
        setUploadedImageBase64(product.image);
        setImageUrl('');
        setPhotoMode('upload');
      } else {
        setImageUrl(product.image);
        setUploadedImageBase64(null);
        setPhotoMode('url');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

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

    let finalImage = product.image;
    if (photoMode === 'upload' && uploadedImageBase64) {
      finalImage = uploadedImageBase64;
    } else if (photoMode === 'url' && imageUrl.trim()) {
      finalImage = imageUrl.trim();
    }

    const updated: CoffeeMenuProduct = {
      ...product,
      name: name.trim(),
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      description: description.trim(),
      image: finalImage,
      isBestSeller,
      isOutOfStock,
    };

    onUpdateProduct(updated);
    onClose();
  };

  const currentPreview =
    photoMode === 'upload'
      ? uploadedImageBase64 || product.image
      : imageUrl.trim() || product.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Menu Produk</h3>
              <p className="text-[11px] text-slate-400">ID: {product.id} • {product.name}</p>
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
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Kategori & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Kategori
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Stok & Status Ketersediaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-amber-400" /> Jumlah Stok
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              {/* Sold Out Toggle */}
              <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition ${
                isOutOfStock
                  ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <span className="font-semibold flex items-center gap-1.5 text-xs">
                  <AlertTriangle className={`w-3.5 h-3.5 ${isOutOfStock ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>Status: {isOutOfStock ? 'HABIS / SOLD OUT' : 'Tersedia'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={isOutOfStock}
                  onChange={(e) => setIsOutOfStock(e.target.checked)}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                />
              </label>
            </div>
          </div>

          {/* Best Seller Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-semibold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tandai sebagai Menu BEST SELLER
              </span>
            </label>
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
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Foto Produk */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Foto Menu
              </label>
              
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
                  <span>Upload Foto</span>
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
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-1.5 ${
                      isDragging
                        ? 'border-amber-500 bg-amber-950/20'
                        : 'border-slate-800 bg-slate-950/70 hover:border-amber-500/50 hover:bg-slate-950'
                    }`}
                  >
                    <UploadCloud className="w-6 h-6 text-amber-400" />
                    <p className="font-semibold text-slate-200 text-xs">
                      Klik untuk ganti foto atau tarik berkas ke sini
                    </p>
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
                          {fileName || 'Foto Produk Baru'}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          ✓ Foto Siap Diganti
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={handleClearUploadedImage}
                        className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {photoMode === 'url' && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
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
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
