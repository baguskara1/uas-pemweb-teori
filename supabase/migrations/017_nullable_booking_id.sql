-- Make booking_id nullable for deposit payments
alter table payments alter column booking_id drop not null;
