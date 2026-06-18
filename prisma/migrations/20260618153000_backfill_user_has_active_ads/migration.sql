UPDATE "users" u
SET "has_active_ads" = true
WHERE EXISTS (
  SELECT 1
  FROM "ads" a
  WHERE a."user_id" = u."id"
    AND a."status" = 'PUBLISHED'
);
