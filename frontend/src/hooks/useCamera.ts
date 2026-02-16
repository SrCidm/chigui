"use client";

import { useState, useRef } from "react";

export function useCamera() {
  const [capturing, setCapturing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Show camera options modal
  const openCameraOptions = () => {
    setShowOptions(true);
  };

  // Close options
  const closeOptions = () => {
    setShowOptions(false);
  };

  // Open camera (take photo) - FIXED
  const takePhoto = () => {
    setShowOptions(false);
    // Trigger camera input
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Open gallery (choose from files)
  const chooseFromGallery = () => {
    setShowOptions(false);
    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB");
      return;
    }

    setCapturing(true);

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImage(base64);
      setCapturing(false);
    };
    reader.onerror = () => {
      setCapturing(false);
      alert("Failed to read image");
    };
    reader.readAsDataURL(file);
  };

  // Clear image
  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return {
    capturing,
    image,
    showOptions,
    openCameraOptions,
    closeOptions,
    takePhoto,
    chooseFromGallery,
    clearImage,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
  };
}