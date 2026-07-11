alter table cameras
  add column category text not null default 'camera'
  check (category in ('camera', 'lens', 'accessory'));

create index cameras_category_idx on cameras(category);
