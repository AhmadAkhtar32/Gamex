ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "images"
text[]
NOT NULL
DEFAULT ARRAY[]::text[];

ALTER TABLE "custom_builds"
ADD COLUMN IF NOT EXISTS "images"
text[]
NOT NULL
DEFAULT ARRAY[]::text[];