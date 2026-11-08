create table settings(id int primary key default 1 check(id=1), start_date date default '2024-01-01', love_points int default 0,
 baby_gender text default 'girl', baby_name text default 'البيبي', next_date date, next_label text default 'موعدنا القادم');
insert into settings(id) values(1);
-- kind: note | voice | song | photo | catch | poem | quiz | reason | letter
create table posts(id bigserial primary key, kind text not null, title text, body text, url text, created_at timestamptz default now());
create table moods(id bigserial primary key, mood text, created_at timestamptz default now());
alter table settings enable row level security; alter table posts enable row level security; alter table moods enable row level security;
create policy r1 on settings for select using(true); create policy r2 on posts for select using(true); create policy r3 on moods for select using(true);
create policy w1 on settings for update to authenticated using(true);
create policy w2 on posts for all to authenticated using(true) with check(true);
create policy w3 on moods for insert to anon, authenticated with check(true);
create function add_points(n int) returns void language sql security definer as $$update settings set love_points=love_points+least(greatest(n,0),50) where id=1$$;
create function set_baby(g text,nm text) returns void language sql security definer as $$update settings set baby_gender=g,baby_name=nm where id=1$$;
alter publication supabase_realtime add table settings, posts, moods;
insert into storage.buckets(id,name,public) values('media','media',true);
create policy m1 on storage.objects for select using(bucket_id='media');
create policy m2 on storage.objects for insert to authenticated with check(bucket_id='media');
