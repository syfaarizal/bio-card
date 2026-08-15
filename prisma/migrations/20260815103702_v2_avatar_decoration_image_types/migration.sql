-- Add avatar decoration fields and migrate image slots to the v2 enum.
-- Existing image rows are mapped forward so populated databases can migrate.

ALTER TABLE "Profile"
ADD COLUMN "profileEffect" TEXT,
ADD COLUMN "verifiedBadge" BOOLEAN NOT NULL DEFAULT false;

CREATE TYPE "ImageType_new" AS ENUM ('PROFILE', 'BANNER', 'GALLERY_1', 'GALLERY_2', 'GALLERY_3');

ALTER TABLE "Image"
ALTER COLUMN "type" TYPE "ImageType_new"
USING (
  CASE "type"::text
    WHEN 'MAIN' THEN 'PROFILE'
    WHEN 'SECONDARY' THEN 'GALLERY_1'
    WHEN 'GALLERY' THEN 'GALLERY_1'
    ELSE "type"::text
  END
)::"ImageType_new";

ALTER TYPE "ImageType" RENAME TO "ImageType_old";
ALTER TYPE "ImageType_new" RENAME TO "ImageType";
DROP TYPE "ImageType_old";
