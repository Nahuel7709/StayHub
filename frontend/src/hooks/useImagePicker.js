import { useEffect, useMemo, useRef, useState } from "react";

export default function useImagePicker() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

 
  const previewUrls = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f));
  }, [files]);

  
  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  function onPickFiles(e) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    setFiles((prev) => {
      const map = new Map(
        prev.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f]),
      );
      for (const f of picked) {
        map.set(`${f.name}-${f.size}-${f.lastModified}`, f);
      }
      return Array.from(map.values());
    });

    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFileAt(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function clearFiles() {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return {
    files,
    previewUrls,
    fileInputRef,
    onPickFiles,
    removeFileAt,
    clearFiles,
    setFiles,
  };
}
