-- Supabase schema for the portfolio admin backend
-- 1) Create a table that stores the full portfolio JSON.
create table if not exists public.profiles (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- Seed the default record used by the app.
insert into public.profiles (id, content)
values (
  'portfolio',
  '{
    "name": "Emmanuel A. Idoga",
    "title": "Azure Cloud & DevOps Engineer",
    "location": "Abuja, Federal Capital Territory, Nigeria",
    "available": true,
    "availabilityNote": "Open to remote and hybrid roles",
    "email": "hello@emmanuelidoga.com",
    "resumeUrl": "/resume.pdf",
    "social": {
      "linkedin": "https://www.linkedin.com/in/emmanuel-a-idoga",
      "github": "",
      "twitter": ""
    },
    "about": "I am an Azure Cloud & DevOps Engineer with hands on experience administering Microsoft Azure environments and building secure, scalable cloud infrastructure. Since 2024, I have worked as an Azure Administrator at Arodonna ICT Arena, gaining practical experience across Azure infrastructure, identity and access management, storage, compute, and cloud operations. My technical focus spans Azure infrastructure, networking, identity and security, automation and infrastructure as code, DevOps, and containers. I also enjoy technical writing and translating complex cloud engineering concepts into practical, easy to follow guides. I am interested in opportunities across Azure Engineering, Azure Administration, Cloud Infrastructure, DevOps, Cloud Operations, and Infrastructure Automation. Let us connect.",
    "stats": [
      { "label": "Years in cloud and DevOps", "value": "2+" },
      { "label": "Certifications", "value": "4" },
      { "label": "Connections", "value": "400+" }
    ],
    "skills": ["Microsoft Azure", "Docker", "Terraform"],
    "experience": [
      { "role": "Cloud Administrator", "company": "Arodonna ICT Arena Contract", "period": "Aug 2024 — Present · 2 yrs 2 mos", "location": "Hybrid", "summary": "Azure Administration and Cloud Infrastructure work across identity, storage, networking, and platform reliability." },
      { "role": "Azure Practitioner Personal Projects", "company": "Independent Projects and Azure Labs", "period": "Aug 2022 — Present · 4 yrs 2 mos", "location": "Nigeria", "summary": "Independent hands on Azure labs and personal projects across infrastructure, networking, identity, and automation." }
    ],
    "education": [
      { "school": "Federal University of Technology Minna", "degree": "Degree or field of study not shown in the screenshot", "period": "" }
    ],
    "journey": [
      { "year": "2022", "title": "Started hands on Azure practice", "description": "Began independent Azure labs and personal projects in infrastructure, networking, identity, and automation." },
      { "year": "2024", "title": "Became Cloud Administrator", "description": "Joined Arodonna ICT Arena as a Cloud Administrator working across Azure administration and cloud infrastructure." },
      { "year": "2025", "title": "Microsoft certified", "description": "Earned Azure Fundamentals, Azure Data Fundamentals, and Azure Administrator Associate credentials." }
    ],
    "blog": [
      { "title": "Building a Full Stack Cloud App on Azure", "excerpt": "A practical look at building a full stack cloud app on Azure and why the architecture decisions matter more than the final product.", "href": "#", "date": "LinkedIn post" },
      { "title": "I stopped deploying my Azure app by hand", "excerpt": "A personal project using ARM templates, SQL, Storage, and Functions to replace manual deployment steps with reproducible infrastructure as code.", "href": "#", "date": "LinkedIn post" }
    ],
    "portfolio": [
      { "id": "featured-arm-deploy", "category": "project", "title": "Automatically Deploy a Complete Azure App", "description": "A serverless three tier app deployed with ARM templates instead of manual portal clicks in the Azure Portal.", "tags": ["Azure", "ARM Templates", "IaC"], "links": [{ "label": "Read article", "href": "#" }] },
      { "id": "featured-linux-scaling-1", "category": "project", "title": "Scaling Linux Infrastructure on Azure", "description": "Featured Medium article focused on Linux scaling patterns and Azure based design decisions.", "tags": ["Azure", "Linux"], "links": [{ "label": "Read article", "href": "#" }] },
      { "id": "featured-linux-scaling-2", "category": "project", "title": "Scaling Linux Infrastructure on Azure 2", "description": "A second featured article with a similar Linux scaling theme for Azure workloads.", "tags": ["Azure", "Linux"], "links": [{ "label": "Read article", "href": "#" }] },
      { "id": "cert-az104", "category": "certification", "title": "Microsoft Certified Azure Administrator Associate", "description": "Azure Administrator certificate from Microsoft.", "tags": ["Azure"], "links": [{ "label": "Show credential", "href": "#" }] },
      { "id": "cert-az900", "category": "certification", "title": "Microsoft Certified Azure Fundamentals", "description": "Issued by Microsoft in 2025.", "tags": ["Azure"], "links": [{ "label": "Show credential", "href": "#" }] },
      { "id": "cert-dp900", "category": "certification", "title": "Microsoft Certified Azure Data Fundamentals", "description": "Issued by Microsoft in 2025.", "tags": ["Azure", "Data"], "links": [{ "label": "Show credential", "href": "#" }] },
      { "id": "cert-fourth", "category": "certification", "title": "4th certification", "description": "A fourth certification item from the profile overview.", "tags": [], "links": [] }
    ]
  }'::jsonb
)
on conflict (id) do update set content = excluded.content, updated_at = now();

-- Create a public upload bucket for CV/PDF files.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

drop policy if exists "resume_public_read" on storage.objects;
drop policy if exists "resume_authenticated_insert" on storage.objects;
drop policy if exists "resume_authenticated_update" on storage.objects;
drop policy if exists "resume_authenticated_delete" on storage.objects;

create policy "resume_public_read"
on storage.objects
for select
to public
using (bucket_id = 'resumes');

create policy "resume_authenticated_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'resumes');

create policy "resume_authenticated_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'resumes')
with check (bucket_id = 'resumes');

create policy "resume_authenticated_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'resumes');

-- Allow the public portfolio to read the profile data and authenticated admins to manage it.
alter table public.profiles enable row level security;

drop policy if exists "profiles_read_public" on public.profiles;
drop policy if exists "profiles_read_all_authenticated" on public.profiles;
drop policy if exists "profiles_write_all_authenticated" on public.profiles;
drop policy if exists "profiles_update_all_authenticated" on public.profiles;
drop policy if exists "profiles_delete_all_authenticated" on public.profiles;

create policy "profiles_read_public"
on public.profiles
for select
to public
using (true);

create policy "profiles_read_all_authenticated"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_write_all_authenticated"
on public.profiles
for insert
to authenticated
with check (true);

create policy "profiles_update_all_authenticated"
on public.profiles
for update
to authenticated
using (true)
with check (true);

create policy "profiles_delete_all_authenticated"
on public.profiles
for delete
to authenticated
using (true);

-- Optional: allow anonymous read access if you want public portfolio access without auth.
-- create policy "profiles_read_public" on public.profiles for select using (true);
