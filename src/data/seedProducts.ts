import type { Category, Unit } from '../types';

export interface SeedProduct {
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  minStock: number;
  notes?: string;
}

export const SEED_PRODUCTS: SeedProduct[] = [

  // ── AGUA ──────────────────────────────────────────────────
  { name: 'Agua Botellón / Bidón',         category: 'bebidas',     quantity: 0,    unit: 'l',         minStock: 500,  notes: '1 galón por persona por día. 1 bidón por mes.' },
  { name: 'Purificador de agua',           category: 'hogar',       quantity: 0,    unit: 'unidades',  minStock: 1 },
  { name: 'Pastillas purificadoras agua',  category: 'hogar',       quantity: 0,    unit: 'unidades',  minStock: 1 },
  { name: 'Hervidor de agua',              category: 'hogar',       quantity: 0,    unit: 'unidades',  minStock: 1 },
  { name: 'Termo para agua caliente',      category: 'hogar',       quantity: 0,    unit: 'unidades',  minStock: 1 },

  // ── ALIMENTOS BASE ────────────────────────────────────────
  { name: 'Arroz',                         category: 'granos',      quantity: 12500, unit: 'g',        minStock: 5000, notes: 'Meta: 42 kg. 1 libra por día.' },
  { name: 'Frijoles',                      category: 'granos',      quantity: 3750,  unit: 'g',        minStock: 2000, notes: 'Meta: 10 kg. 4 tarros.' },
  { name: 'Lentejas',                      category: 'granos',      quantity: 3750,  unit: 'g',        minStock: 2000, notes: 'Meta: 10 kg. 4 tarros.' },
  { name: 'Garbanzos',                     category: 'granos',      quantity: 1200,  unit: 'g',        minStock: 2000, notes: 'Meta: 10 kg. 4 tarros.' },
  { name: 'Alverjas secas',                category: 'granos',      quantity: 1750,  unit: 'g',        minStock: 2000, notes: 'Meta: 10 kg. 4 tarros.' },
  { name: 'Avena',                         category: 'granos',      quantity: 2500,  unit: 'g',        minStock: 3000, notes: 'Meta: 15 kg. 3 tarros.' },
  { name: 'Pastas largas',                 category: 'granos',      quantity: 0,     unit: 'g',        minStock: 2000, notes: 'Meta: 7 kg. 2 tarros.' },
  { name: 'Pastas conchitas',              category: 'granos',      quantity: 1750,  unit: 'g',        minStock: 2000, notes: 'Meta: 7 kg. 2 tarros.' },
  { name: 'Harina',                        category: 'panaderia',   quantity: 0,     unit: 'g',        minStock: 2000, notes: 'Meta: 6 kg.' },

  // ── PROTEÍNAS ─────────────────────────────────────────────
  { name: 'Atún en lata',                  category: 'enlatados',   quantity: 1,     unit: 'latas',    minStock: 10,   notes: 'Meta: 30 latas. Comprar 24.' },
  { name: 'Sardinas en lata',              category: 'enlatados',   quantity: 1,     unit: 'latas',    minStock: 10,   notes: 'Meta: 30 latas. Comprar 6.' },
  { name: 'Pollo en lata',                 category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 6,    notes: 'Meta: 30 latas. Comprar 6.' },
  { name: 'Albóndigas en lata',            category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 6,    notes: 'Meta: 30 latas.' },
  { name: 'Jamoneta en lata',              category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 6,    notes: 'Meta: 30 latas.' },
  { name: 'Huevo en polvo',               category: 'otros',       quantity: 0,     unit: 'g',        minStock: 250,  notes: 'Meta: 500 g. 2 tarros.' },
  { name: 'Carne desmechada en sobre',    category: 'enlatados',   quantity: 0,     unit: 'paquetes', minStock: 6,    notes: 'Meta: 30 sobres. Comprar 12.' },
  { name: 'Carne seca',                    category: 'carnes',      quantity: 0,     unit: 'unidades', minStock: 10 },
  { name: 'Proteína en polvo',             category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },

  // ── GRASAS Y BÁSICOS ──────────────────────────────────────
  { name: 'Aceite Vegetal',                category: 'condimentos', quantity: 3,     unit: 'l',        minStock: 3,    notes: 'Meta: 10 litros. C 1 galón.' },
  { name: 'Aceite de Coco',                category: 'condimentos', quantity: 1,     unit: 'cajas',    minStock: 1,    notes: 'Meta: 2 tarros. Pricesmart.' },
  { name: 'Aceite de Oliva',               category: 'condimentos', quantity: 0,     unit: 'l',        minStock: 1,    notes: 'Meta: 3 litros.' },
  { name: 'Aceite de Aguacate',            category: 'condimentos', quantity: 0,     unit: 'l',        minStock: 1,    notes: 'Meta: 1 litro.' },
  { name: 'Azúcar',                        category: 'condimentos', quantity: 800,   unit: 'g',        minStock: 1000, notes: 'Meta: 5 kg. 2 tarros 1 kilo.' },
  { name: 'Sal',                           category: 'condimentos', quantity: 2500,  unit: 'g',        minStock: 500,  notes: 'Meta: 2.5 kg. 2 tarros.' },
  { name: 'Miel',                          category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 500,  notes: 'Meta: 2 kg. 3 tarros.' },
  { name: 'Vinagre',                       category: 'condimentos', quantity: 1,     unit: 'l',        minStock: 1,    notes: 'Meta: 3 litros.' },

  // ── SUPERVIVENCIA ─────────────────────────────────────────
  { name: 'Sampa',                         category: 'emergencia',  quantity: 0,     unit: 'cajas',    minStock: 1,    notes: 'Meta: 2 tarros.' },
  { name: 'Galletas de guerra marineras',  category: 'emergencia',  quantity: 0,     unit: 'cajas',    minStock: 1,    notes: 'Meta: 2 tarros.' },
  { name: 'Pemmican',                      category: 'emergencia',  quantity: 0,     unit: 'cajas',    minStock: 1,    notes: 'Meta: 2 tarros.' },

  // ── COMPLEMENTOS Y ENLATADOS ──────────────────────────────
  { name: 'Alverjas enlatadas',            category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Frijol enlatado',               category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Garbanzos enlatados',           category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Maicitos enlatados',            category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Alverjas zanahoria enlatada',   category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Champiñones enlatados',         category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 4 },
  { name: 'Tomate enlatado',               category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 10 },
  { name: 'Pasta de tomate en sobre',      category: 'enlatados',   quantity: 0,     unit: 'paquetes', minStock: 5 },
  { name: 'Duraznos enlatados',            category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 2 },
  { name: 'Leche en polvo',                category: 'lacteos',     quantity: 0,     unit: 'g',        minStock: 500,  notes: 'Meta: 2.5 kg. 2 tarros 1.5.' },
  { name: 'Mantequilla de maní',           category: 'lacteos',     quantity: 1,     unit: 'cajas',    minStock: 1,    notes: 'Meta: 3 frascos.' },
  { name: 'Café',                          category: 'bebidas',     quantity: 250,   unit: 'g',        minStock: 500,  notes: 'Meta: 2.5 kg.' },
  { name: 'Aromáticas (manzanilla, piña, hierba buena)', category: 'bebidas', quantity: 0, unit: 'paquetes', minStock: 2 },
  { name: 'Barras de granola',             category: 'granos',      quantity: 0,     unit: 'unidades', minStock: 10 },
  { name: 'Ramen',                         category: 'granos',      quantity: 0,     unit: 'paquetes', minStock: 12,   notes: 'Meta: 48 paquetes.' },
  { name: 'Cacao en polvo',                category: 'bebidas',     quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Panela en polvo',               category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 500,  notes: 'Meta: 2.5 kg. 2 tarros 1.5.' },

  // ── ESPECIAS ──────────────────────────────────────────────
  { name: 'Laurel',                        category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 300,  notes: 'Meta: 1.2 kg.' },
  { name: 'Canela en astillas',            category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g. Para ansiedad.' },
  { name: 'Cebolla en polvo',              category: 'condimentos', quantity: 400,   unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Comino',                        category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Paprika',                       category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Ajo en polvo',                  category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Orégano',                       category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g. Con ajo para defensas.' },
  { name: 'Pimienta cayena',               category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200,  notes: 'Meta: 800 g.' },
  { name: 'Cúrcuma',                       category: 'condimentos', quantity: 400,   unit: 'g',        minStock: 200,  notes: 'Meta: 800 g. Con pimienta para inflamación.' },
  { name: 'Jengibre',                      category: 'condimentos', quantity: 400,   unit: 'g',        minStock: 200,  notes: 'Meta: 800 g. Con canela para gripa.' },
  { name: 'Cardamomo',                     category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 100 },
  { name: 'Semillas de cilantro',          category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 200 },
  { name: 'Clavo de olor',                 category: 'condimentos', quantity: 0,     unit: 'g',        minStock: 100,  notes: 'Para los dientes.' },

  // ── FRUTAS Y DULCES ───────────────────────────────────────
  { name: 'Arándanos deshidratados',       category: 'frutas',      quantity: 0,     unit: 'g',        minStock: 100 },
  { name: 'Frutas deshidratadas',          category: 'frutas',      quantity: 0,     unit: 'g',        minStock: 100 },
  { name: 'Piña en lata',                  category: 'enlatados',   quantity: 0,     unit: 'latas',    minStock: 2 },

  // ── SUPLEMENTOS ───────────────────────────────────────────
  { name: 'Spirulina',                     category: 'suplementos', quantity: 0,     unit: 'g',        minStock: 200 },
  { name: 'Vitamina D',                    category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Vitamina E',                    category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Vitamina C',                    category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Omega 3',                       category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Citrato de magnesio',           category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Multivitamínico Centrum',       category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Carotenos',                     category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Moringa',                       category: 'suplementos', quantity: 0,     unit: 'g',        minStock: 100 },
  { name: 'Probióticos',                   category: 'suplementos', quantity: 0,     unit: 'cajas',    minStock: 1 },

  // ── BÁSICOS RITUALES / ESPIRITUALES ───────────────────────
  { name: 'Aceite del Buen Samaritano',    category: 'otros',       quantity: 0,     unit: 'l',        minStock: 1,    notes: 'Uso medicinal y espiritual.' },
  { name: 'Aceite San José Lirios Perfumados', category: 'otros',   quantity: 0,     unit: 'l',        minStock: 1 },
  { name: 'Aceites esenciales — Lavanda',  category: 'otros',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Aceites esenciales — Limón',    category: 'otros',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Aceites esenciales — Eucalipto',category: 'otros',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Aceites esenciales — Menta',    category: 'otros',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Aceites esenciales — Incienso', category: 'otros',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Velas',                         category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 5 },
  { name: 'Cirio Pascual',                 category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── PARA COCINAR ──────────────────────────────────────────
  { name: 'Estufa de gas',                 category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pipetas de gas',                category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Estufa de alcohol',             category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Fogón de leña',                 category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Carbón de bola',                category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Fósforos / Encendedores',       category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 3 },
  { name: 'Olla resistente para fogón',    category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── ASEO ──────────────────────────────────────────────────
  { name: 'Jabón de limpieza',             category: 'limpieza',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Jabón para platos',             category: 'limpieza',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Jabón para ropa',               category: 'limpieza',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Bolsas de basura',              category: 'limpieza',    quantity: 0,     unit: 'unidades', minStock: 8 },
  { name: 'Guantes de limpieza',           category: 'limpieza',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Alcohol',                       category: 'limpieza',    quantity: 0,     unit: 'botellas', minStock: 1 },
  { name: 'Bicarbonato',                   category: 'limpieza',    quantity: 0,     unit: 'g',        minStock: 300,  notes: 'Meta: 1.25 kg.' },

  // ── HIGIENE PERSONAL ──────────────────────────────────────
  { name: 'Pasta dental',                  category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Ceda dental',                   category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Cepillo dental',                category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Papel higiénico',               category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 12,   notes: 'Meta: 36 rollos.' },
  { name: 'Shampoo',                       category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Jabón de cuerpo',               category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Desodorante',                   category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Toallas higiénicas',            category: 'higiene',     quantity: 0,     unit: 'paquetes', minStock: 1 },
  { name: 'Copa menstrual',                category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pañales',                       category: 'higiene',     quantity: 0,     unit: 'paquetes', minStock: 1 },
  { name: 'Máquina de afeitar',            category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Pañitos húmedos',               category: 'higiene',     quantity: 0,     unit: 'paquetes', minStock: 1 },
  { name: 'Toallas personales',            category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Crema corporal',                category: 'higiene',     quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── MEDICINA ──────────────────────────────────────────────
  { name: 'Suero fisiológico',             category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Suero fisiológico en gotas',    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Suero oral',                    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Acetaminofén',                  category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Acetaminofén para niños',       category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Ibuprofeno',                    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Ibuprofeno para niños',         category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pastillas para gripa',          category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pastillas para cólicos',        category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 5 },
  { name: 'Alka-Seltzer',                  category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Milanta',                       category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Loperamida',                    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1,    notes: 'Para diarrea.' },
  { name: 'Amoxicilina',                   category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Crema antibiótica externa',     category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Loratadina',                    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1,    notes: 'Para alergias.' },
  { name: 'Valeriana',                     category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Vaporu / Vick',                 category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Atorvastatina',                 category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Jarabe de cebolla',             category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Ajo confitado',                 category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── BOTIQUÍN ──────────────────────────────────────────────
  { name: 'Termómetro',                    category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Isodine',                       category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Agua oxigenada',                category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Gasas',                         category: 'medicina',    quantity: 0,     unit: 'paquetes', minStock: 1 },
  { name: 'Curitas',                       category: 'medicina',    quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Microporo',                     category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Vendas',                        category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Guantes de latex',              category: 'medicina',    quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Tapabocas',                     category: 'medicina',    quantity: 0,     unit: 'cajas',    minStock: 1 },
  { name: 'Jeringas desechables',          category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 5 },
  { name: 'Tijeras',                       category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pinzas',                        category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Nebulizador',                   category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Crema de caléndula',            category: 'medicina',    quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── HOGAR Y MULTIFUNCIÓN ──────────────────────────────────
  { name: 'Absorbentes de oxígeno',        category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 10 },
  { name: 'Papel aluminio',                category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Reloj',                         category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Brújula',                       category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Hilo y agujas',                 category: 'hogar',       quantity: 0,     unit: 'unidades', minStock: 1 },

  // ── LUZ Y COMUNICACIÓN ────────────────────────────────────
  { name: 'Linternas',                     category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Radio portátil',                category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Pilas',                         category: 'emergencia',  quantity: 0,     unit: 'paquetes', minStock: 2 },
  { name: 'Cargador solar / Panel',        category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Power Banks',                   category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Lámparas de aceite',            category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Encendedores permanentes',      category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },

  // ── BOLSO DE EMERGENCIA ───────────────────────────────────
  { name: 'Navaja multiusos',              category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Cinta resistente (ducktape)',   category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Cuerdas',                       category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 1 },
  { name: 'Bolsas térmicas',               category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Copia documentos de identidad', category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Protectores de identificación', category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
  { name: 'Cobijas',                       category: 'emergencia',  quantity: 0,     unit: 'unidades', minStock: 2 },
];
