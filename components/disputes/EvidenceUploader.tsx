"use client";

import React from "react"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";

interface EvidenceUploaderProps {
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export function EvidenceUploader({
  maxFiles = 5,
  onFilesChange,
}: EvidenceUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;
    const newFiles = selectedFiles.slice(0, remainingSlots);

    if (newFiles.length > 0) {
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...files, ...newFiles];
      const updatedPreviews = [...previews, ...newPreviews];

      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onFilesChange?.(updatedFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#111827]">증거 사진</span>
        <span className="text-xs text-[#6B7280]">
          {files.length}/{maxFiles}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {previews.map((preview, index) => (
          <div
            key={preview}
            className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB]"
          >
            <Image
              src={preview || "/placeholder.svg"}
              alt={`증거 ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center text-[#9CA3AF] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-xs mt-1">추가</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-[#6B7280]">
        분쟁 증거로 사용될 사진을 첨부해주세요 (최대 {maxFiles}장)
      </p>
    </div>
  );
}
