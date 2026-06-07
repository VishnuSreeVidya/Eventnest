-- Sample venues for EventNest
INSERT INTO public.venues (owner_id, name, slug, description, city, area, address, capacity, base_price, decoration_cost, catering_cost_per_plate, ac, parking, catering_available, decoration_available, event_types, amenities, cover_image, contact_phone, contact_email, status)
SELECT 
  id,
  'Grand Palace Hall',
  'grand-palace-hall',
  'A magnificent palace-themed wedding hall with luxurious interiors and a grand entrance. Perfect for royal weddings and large gatherings.',
  'Hyderabad',
  'Banjara Hills',
  'Road No 12, Banjara Hills, Hyderabad',
  500,
  150000,
  50000,
  850,
  true,
  true,
  true,
  true,
  ARRAY['Wedding', 'Reception', 'Engagement'],
  ARRAY['Parking', 'AC', 'Stage', 'Sound System', 'Dressing Room', 'Green Room'],
  NULL,
  '+91 9876543210',
  'info@grandpalace.com',
  'verified'
FROM auth.users LIMIT 1;

INSERT INTO public.venues (owner_id, name, slug, description, city, area, address, capacity, base_price, decoration_cost, catering_cost_per_plate, ac, parking, catering_available, decoration_available, event_types, amenities, cover_image, contact_phone, contact_email, status)
SELECT 
  id,
  'Green Meadow Garden',
  'green-meadow-garden',
  'A beautiful open-air garden venue surrounded by lush greenery. Ideal for daytime events and outdoor ceremonies.',
  'Vijayawada',
  'Moghalrajpuram',
  'MG Road, Moghalrajpuram, Vijayawada',
  300,
  80000,
  30000,
  650,
  false,
  true,
  true,
  true,
  ARRAY['Wedding', 'Reception', 'Birthday', 'Engagement'],
  ARRAY['Parking', 'Garden', 'Stage', 'Catering'],
  NULL,
  '+91 9876543211',
  'info@greenmeadow.com',
  'verified'
FROM auth.users LIMIT 1;

INSERT INTO public.venues (owner_id, name, slug, description, city, area, address, capacity, base_price, decoration_cost, catering_cost_per_plate, ac, parking, catering_available, decoration_available, event_types, amenities, cover_image, contact_phone, contact_email, status)
SELECT 
  id,
  'Royal Convention Center',
  'royal-convention-center',
  'A state-of-the-art convention center with modern amenities. Suitable for corporate events, conferences, and exhibitions.',
  'Visakhapatnam',
  'Beach Road',
  'Beach Road, Visakhapatnam',
  1000,
  200000,
  60000,
  750,
  true,
  true,
  true,
  true,
  ARRAY['Conference', 'Corporate Event', 'Exhibition', 'Seminar'],
  ARRAY['Parking', 'AC', 'Projector', 'Sound System', 'WiFi', 'Stage', 'Backup Generator'],
  NULL,
  '+91 9876543212',
  'info@royalconvention.com',
  'verified'
FROM auth.users LIMIT 1;

INSERT INTO public.venues (owner_id, name, slug, description, city, area, address, capacity, base_price, decoration_cost, catering_cost_per_plate, ac, parking, catering_available, decoration_available, event_types, amenities, cover_image, contact_phone, contact_email, status)
SELECT 
  id,
  'Sunset Banquet Hall',
  'sunset-banquet-hall',
  'An elegant banquet hall with stunning sunset views. Perfect for intimate weddings and private parties.',
  'Tirupati',
  'Tirumala Bypass',
  'Tirumala Bypass Road, Tirupati',
  200,
  60000,
  25000,
  550,
  true,
  true,
  true,
  true,
  ARRAY['Wedding', 'Reception', 'Birthday', 'Party'],
  ARRAY['Parking', 'AC', 'Stage', 'Sound System', 'Catering'],
  NULL,
  '+91 9876543213',
  'info@sunsetbanquet.com',
  'verified'
FROM auth.users LIMIT 1;

INSERT INTO public.venues (owner_id, name, slug, description, city, area, address, capacity, base_price, decoration_cost, catering_cost_per_plate, ac, parking, catering_available, decoration_available, event_types, amenities, cover_image, contact_phone, contact_email, status)
SELECT 
  id,
  'Lakeview Resort Venue',
  'lakeview-resort-venue',
  'A serene lakeside resort venue offering a picturesque backdrop for events. Combines luxury with nature.',
  'Hyderabad',
  'Shamirpet',
  'Shamirpet Lake Road, Hyderabad',
  400,
  120000,
  45000,
  950,
  true,
  true,
  true,
  true,
  ARRAY['Wedding', 'Reception', 'Engagement', 'Pool Party'],
  ARRAY['Parking', 'AC', 'Pool', 'Garden', 'Stage', 'Sound System', 'Dressing Room', 'Green Room'],
  NULL,
  '+91 9876543214',
  'info@lakeviewresort.com',
  'verified'
FROM auth.users LIMIT 1;
