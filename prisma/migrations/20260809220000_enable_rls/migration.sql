-- Enable Row Level Security on every table in the public schema.
-- BioCard accesses these tables through Prisma on the trusted server, so no
-- public Data API policies are added here.

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SocialLinks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Music" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Image" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ViewLog" ENABLE ROW LEVEL SECURITY;
