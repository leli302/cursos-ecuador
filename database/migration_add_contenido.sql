-- Add contenido column to lecciones if it doesn't exist
ALTER TABLE lecciones ADD COLUMN IF NOT EXISTS contenido TEXT;

-- Move any existing markdown from descripcion to contenido
UPDATE lecciones 
SET contenido = descripcion 
WHERE descripcion LIKE '%#%' AND contenido IS NULL;

-- Truncate the descriptions that had full markdown content
UPDATE lecciones 
SET descripcion = left(descripcion, 150) || '...' 
WHERE length(descripcion) > 150 AND contenido IS NOT NULL;
