-- Migration: Add dynamic ProfileLink model
-- This replaces the fixed-field SocialLinks with a flexible links system

-- Create ProfileLink table for dynamic links
CREATE TABLE "ProfileLink" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'custom',
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileLink_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "ProfileLink" ADD CONSTRAINT "ProfileLink_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index for faster lookups
CREATE INDEX "ProfileLink_profileId_idx" ON "ProfileLink"("profileId");
CREATE INDEX "ProfileLink_sortOrder_idx" ON "ProfileLink"("sortOrder");

-- Migrate existing data from SocialLinks to ProfileLink
-- Only migrate non-empty links with proper ordering

-- Migrate Instagram
INSERT INTO "ProfileLink" ("id", "profileId", "title", "url", "provider", "sortOrder", "createdAt", "updatedAt")
SELECT
    'migr_' || substr(gen_random_uuid()::text, 1, 25),
    "profileId",
    'Instagram',
    instagram,
    'instagram',
    0,
    NOW(),
    NOW()
FROM "SocialLinks"
WHERE instagram IS NOT NULL AND instagram <> '';

-- Migrate TikTok
INSERT INTO "ProfileLink" ("id", "profileId", "title", "url", "provider", "sortOrder", "createdAt", "updatedAt")
SELECT
    'migr_' || substr(gen_random_uuid()::text, 1, 25),
    "profileId",
    'TikTok',
    tiktok,
    'tiktok',
    1,
    NOW(),
    NOW()
FROM "SocialLinks"
WHERE tiktok IS NOT NULL AND tiktok <> '';

-- Migrate Twitter/X
INSERT INTO "ProfileLink" ("id", "profileId", "title", "url", "provider", "sortOrder", "createdAt", "updatedAt")
SELECT
    'migr_' || substr(gen_random_uuid()::text, 1, 25),
    "profileId",
    'X',
    twitter,
    'x',
    2,
    NOW(),
    NOW()
FROM "SocialLinks"
WHERE twitter IS NOT NULL AND twitter <> '';

-- Migrate YouTube
INSERT INTO "ProfileLink" ("id", "profileId", "title", "url", "provider", "sortOrder", "createdAt", "updatedAt")
SELECT
    'migr_' || substr(gen_random_uuid()::text, 1, 25),
    "profileId",
    'YouTube',
    youtube,
    'youtube',
    3,
    NOW(),
    NOW()
FROM "SocialLinks"
WHERE youtube IS NOT NULL AND youtube <> '';

-- Add comment for documentation
COMMENT ON TABLE "ProfileLink" IS 'Dynamic links system replacing fixed SocialLinks model';
