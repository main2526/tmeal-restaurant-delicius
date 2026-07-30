-- Datos iniciales de Delicias de Bávaro. Ejecuta este archivo después de la migración.

insert into public.menu_categories (id, name_es, name_en, sort_order, is_visible)
values
  ('entradas', 'Entradas', 'Appetizers', 10, true),
  ('ninos', 'Menú Niños', 'Kids Menu', 20, true),
  ('pasteles_en_hoja', 'Pasteles en Hoja', 'Dominican Pasteles', 30, true),
  ('sandwich', 'Sándwich', 'Sandwiches', 40, true),
  ('ensaladas', 'Ensaladas', 'Salads', 50, true)
on conflict (id) do update set
  name_es = excluded.name_es,
  name_en = excluded.name_en,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

insert into public.menu_items
  (id, category_id, name_es, name_en, description_es, description_en, price, image_url, sort_order, is_available)
values
  (1, 'entradas', 'Aceitunas', 'Olives', 'Selección de aceitunas.', 'Olive selection.', 250, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80', 10, true),
  (2, 'entradas', 'Panito tostado relleno de mozzarella', 'Toasted mozzarella-filled bread', 'Sale con pico de gallo.', 'Served with pico de gallo.', 350, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', 20, true),
  (3, 'entradas', 'Croquetas de pollo (6 unid.)', 'Chicken croquettes (6 units)', 'Croquetas crujientes de pollo.', 'Crunchy chicken croquettes.', 300, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=900&q=80', 30, true),
  (4, 'entradas', 'Bolitas de queso mozzarella (6 unid.)', 'Mozzarella cheese balls (6 units)', 'Queso mozzarella empanizado y frito.', 'Breaded and fried mozzarella cheese.', 300, 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=900&q=80', 40, true),
  (5, 'entradas', 'Empanaditas de yuca y res (4 unid.)', 'Cassava and beef empanadas (4 units)', 'Empanaditas de yuca rellenas de res.', 'Cassava empanadas filled with beef.', 320, 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80', 50, true),
  (6, 'entradas', 'Ceviche de pescado', 'Fish ceviche', 'Pescado fresco marinado con cítricos.', 'Fresh fish marinated in citrus.', 550, 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=80', 60, true),
  (7, 'entradas', 'Ceviche de camarones', 'Shrimp ceviche', 'Camarones frescos marinados con cítricos.', 'Fresh shrimp marinated in citrus.', 800, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80', 70, true),
  (8, 'entradas', 'Coctel de camarones', 'Shrimp cocktail', 'Camarones con salsa especial de la casa.', 'Shrimp with the house special sauce.', 1100, 'https://images.unsplash.com/photo-1593685418041-d68a529e7118?auto=format&fit=crop&w=900&q=80', 80, true),
  (9, 'ninos', 'Pancake tradicional', 'Traditional pancake', 'Pancakes suaves con sirope.', 'Soft pancakes with syrup.', 220, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80', 10, true),
  (10, 'ninos', 'Pancake zanahoria, avena y pasas', 'Carrot, oat and raisin pancake', 'Agrega frutas a tu pancake por RD$ 120 adicionales.', 'Add fruit to your pancake for RD$ 120 more.', 250, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80', 20, true),
  (11, 'ninos', 'Alitas de pollo + papas fritas', 'Chicken wings + french fries', 'Alitas de pollo acompañadas de papas fritas.', 'Chicken wings served with fries.', 400, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=80', 30, true),
  (12, 'ninos', 'Pechurinas + papas fritas', 'Chicken tenders + french fries', 'Pechurinas de pollo acompañadas de papas fritas.', 'Chicken tenders served with fries.', 400, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', 40, true),
  (13, 'ninos', 'Nuggets de pollo + papas fritas', 'Chicken nuggets + french fries', 'Nuggets de pollo acompañados de papas fritas.', 'Chicken nuggets served with fries.', 450, 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=900&q=80', 50, true),
  (14, 'pasteles_en_hoja', 'Pastel en hoja de pollo', 'Chicken pastel en hoja', 'Agrega queso mozzarella por RD$ 100 adicionales.', 'Add mozzarella cheese for RD$ 100 more.', 300, 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=900&q=80', 10, true),
  (15, 'pasteles_en_hoja', 'Pastel en hoja de res mechada', 'Shredded beef pastel en hoja', 'Agrega queso mozzarella por RD$ 100 adicionales.', 'Add mozzarella cheese for RD$ 100 more.', 400, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=80', 20, true),
  (16, 'sandwich', 'Huevo', 'Egg', 'Sándwich de huevo.', 'Egg sandwich.', 150, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', 10, true),
  (17, 'sandwich', 'Derretido de queso cheddar', 'Melted cheddar cheese', 'Sándwich de queso cheddar fundido.', 'Melted cheddar cheese sandwich.', 150, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80', 20, true),
  (18, 'sandwich', 'Queso cheddar', 'Cheddar cheese', 'Sándwich de queso cheddar.', 'Cheddar cheese sandwich.', 150, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80', 30, true),
  (19, 'sandwich', 'Queso danés', 'Danish cheese', 'Sándwich de queso danés.', 'Danish cheese sandwich.', 160, 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=900&q=80', 40, true),
  (20, 'sandwich', 'Full queso', 'Full cheese', 'Cheddar, mozzarella, gouda, tomate y lechuga.', 'Cheddar, mozzarella, gouda, tomato and lettuce.', 280, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80', 50, true),
  (21, 'sandwich', 'Jamón york y queso cheddar', 'York ham and cheddar cheese', 'Jamón york con queso cheddar.', 'York ham with cheddar cheese.', 180, 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=900&q=80', 60, true),
  (22, 'sandwich', 'Especial jamón de pavo y queso danés', 'Turkey ham and Danish cheese special', 'Jamón de pavo con queso danés.', 'Turkey ham with Danish cheese.', 200, 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?auto=format&fit=crop&w=900&q=80', 70, true),
  (23, 'sandwich', 'Jamón ahumado y queso Gouda Holandés', 'Smoked ham and Dutch Gouda cheese', 'Jamón ahumado con queso Gouda Holandés.', 'Smoked ham with Dutch Gouda cheese.', 390, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80', 80, true),
  (24, 'sandwich', 'Pollo desmenuzado', 'Shredded chicken', 'Disponible con cheddar (RD$ 280), mozzarella (RD$ 320) o Gouda (RD$ 400).', 'Available with cheddar (RD$ 280), mozzarella (RD$ 320) or Gouda (RD$ 400).', 250, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80', 90, true),
  (25, 'sandwich', 'Pechuga de pollo a la plancha', 'Grilled chicken breast', 'Pechuga de pollo preparada a la plancha.', 'Grilled chicken breast.', 480, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', 100, true),
  (26, 'sandwich', 'Pechuga de pollo y queso danés', 'Chicken breast and Danish cheese', 'Pechuga de pollo con queso danés.', 'Chicken breast with Danish cheese.', 520, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', 110, true),
  (27, 'sandwich', 'Club Sándwich', 'Club sandwich', 'Pan rebanado, jamón picnic, queso cheddar, pollo desmenuzado, cebolla y mayonesa. Sale con papas fritas.', 'Sliced bread, picnic ham, cheddar, shredded chicken, onion and mayonnaise. Served with fries.', 425, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80', 120, true),
  (28, 'sandwich', 'Especial Delicias', 'Delicias special', 'Pan baguette, pierna de cerdo, pollo, jamón picnic, queso cheddar y salsa china.', 'Baguette bread, pork leg, chicken, picnic ham, cheddar and Chinese sauce.', 400, 'https://images.unsplash.com/photo-1547050605-2f268cd0b785?auto=format&fit=crop&w=900&q=80', 130, true),
  (29, 'sandwich', 'Pierna de cerdo (salsa china)', 'Pork leg (Chinese sauce)', 'Agrega mozzarella por RD$ 400 o Gouda Holandés por RD$ 460.', 'Add mozzarella for RD$ 400 or Dutch Gouda for RD$ 460.', 340, 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=900&q=80', 140, true),
  (30, 'sandwich', 'Chimi de pierna de cerdo', 'Pork leg chimi', 'Repollo, cebolla, ají cubanela y salsa china.', 'Cabbage, onion, Cuban pepper and Chinese sauce.', 400, 'https://images.unsplash.com/photo-1598514982846-f4f8b0a6c4c0?auto=format&fit=crop&w=900&q=80', 150, true),
  (31, 'sandwich', 'Atún', 'Tuna', 'Sándwich de atún.', 'Tuna sandwich.', 330, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80', 160, true),
  (32, 'sandwich', 'Cubano', 'Cuban sandwich', 'Pierna de cerdo, jamón picnic, queso cheddar, mostaza y pepinillo.', 'Pork leg, picnic ham, cheddar, mustard and pickles.', 480, 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=900&q=80', 170, true),
  (33, 'sandwich', 'Philly Cheese', 'Philly cheese', 'Res, queso cheddar, ají morrón, cebolla y salsa china. Sale con papas fritas.', 'Beef, cheddar, bell pepper, onion and Chinese sauce. Served with fries.', 520, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', 180, true),
  (34, 'ensaladas', 'Ensalada de atún', 'Tuna salad', 'Ensalada fresca con atún.', 'Fresh salad with tuna.', 490, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', 10, true),
  (35, 'ensaladas', 'Ensalada César', 'Caesar salad', 'Ensalada César clásica.', 'Classic Caesar salad.', 400, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80', 20, true),
  (36, 'ensaladas', 'Ensalada César de pollo', 'Chicken Caesar salad', 'Ensalada César acompañada de pollo.', 'Caesar salad with chicken.', 700, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', 30, true),
  (37, 'ensaladas', 'Ensalada César de camarones', 'Shrimp Caesar salad', 'Ensalada César acompañada de camarones.', 'Caesar salad with shrimp.', 1400, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80', 40, true)
on conflict (id) do update set
  category_id = excluded.category_id,
  name_es = excluded.name_es,
  name_en = excluded.name_en,
  description_es = excluded.description_es,
  description_en = excluded.description_en,
  price = excluded.price,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_available = excluded.is_available;

select setval(
  pg_get_serial_sequence('public.menu_items', 'id'),
  (select coalesce(max(id), 1) from public.menu_items),
  true
);
