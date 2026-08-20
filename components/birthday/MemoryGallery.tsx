"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MemoryPhoto } from "@/types/birthday";

interface MemoryGalleryProps {
  photos: MemoryPhoto[];
}

const ROTATIONS = [-6, 3, -3, 6, -4, 4];

export function MemoryGallery({ photos }: MemoryGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 px-4">
      {photos.slice(0, 10).map((photo, i) => (
        <motion.figure
          key={photo.url}
          className="w-24 rounded-md bg-white p-2 pb-5 shadow-lg"
          style={{ rotate: ROTATIONS[i % ROTATIONS.length] }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
        >
          <div className="relative h-24 w-full overflow-hidden rounded-sm">
            <Image src={photo.url} alt={photo.caption ?? "memory"} fill sizes="96px" className="object-cover" />
          </div>
          {photo.caption && (
            <figcaption className="mt-1.5 text-center font-serif text-xs italic text-current/80">
              {photo.caption}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}
