-- Actualizar las lecciones del Módulo 1 de Node.js (TEC-0005) con contenido detallado
UPDATE lecciones 
SET descripcion = 'En esta lección aprenderemos cómo funciona Node.js internamente. Conoceremos el motor V8, la arquitectura no bloqueante (non-blocking I/O) y el famoso Event Loop que permite manejar miles de conexiones concurrentes sin crear múltiples hilos.\n\n### Concepto Clave\nNode.js ejecuta el código JavaScript en un solo hilo principal (Single Thread), pero delega las operaciones pesadas (como leer archivos o consultas a BD) al sistema operativo. Cuando estas operaciones terminan, el Event Loop las recoge y ejecuta su "callback".\n\n### Ejemplo Práctico:\nCuando haces una petición a una base de datos, Node.js no se queda congelado esperando. Continúa ejecutando otras tareas y atiende la respuesta de la base de datos tan pronto como esté lista. ¡Esta es la magia de la asincronía!'
WHERE titulo = 'Arquitectura y Event Loop' 
AND modulo_id = (
    SELECT id FROM modulos WHERE curso_id = (SELECT id FROM cursos WHERE codigo = 'TEC-0005') AND orden = 1
);

UPDATE lecciones 
SET descripcion = 'Descubre cómo organizar tu código utilizando CommonJS (`require`) y ES Modules (`import`). También exploraremos NPM (Node Package Manager), aprenderemos a inicializar un proyecto y a instalar dependencias esenciales para nuestros proyectos backend.\n\n### Concepto Clave\nNPM es el gestor de paquetes de Node.js. Con él, podemos descargar código escrito por otros desarrolladores (como frameworks o librerías) y usarlos en nuestro proyecto.\n\n### Ejemplo Práctico:\nPara inicializar un proyecto y descargar Express (el framework web más popular):\n\n```bash\nnpm init -y\nnpm install express\n```\n\n```javascript\n// Importando el módulo en tu código\nconst express = require("express");\nconst app = express();\n```'
WHERE titulo = 'Módulos y NPM' 
AND modulo_id = (
    SELECT id FROM modulos WHERE curso_id = (SELECT id FROM cursos WHERE codigo = 'TEC-0005') AND orden = 1
);

UPDATE lecciones 
SET descripcion = 'Aprende a interactuar con el sistema de archivos del servidor utilizando el módulo nativo `fs` (File System). Veremos cómo leer, escribir, actualizar y eliminar archivos de forma síncrona y asíncrona utilizando promesas y async/await.\n\n### Concepto Clave\nManejar archivos de forma asíncrona es vital en Node.js para no bloquear el Event Loop. Si leemos un archivo gigante de forma síncrona, ningún otro usuario podrá usar la aplicación hasta que termine de leerse.\n\n### Ejemplo Práctico:\n```javascript\nconst fs = require("fs").promises;\n\nasync function leerDatos() {\n  try {\n    // Lee el archivo sin bloquear el servidor\n    const data = await fs.readFile("datos.txt", "utf-8");\n    console.log(data);\n  } catch (error) {\n    console.error("Error al leer el archivo", error);\n  }\n}\n```'
WHERE titulo = 'Manejo de archivos' 
AND modulo_id = (
    SELECT id FROM modulos WHERE curso_id = (SELECT id FROM cursos WHERE codigo = 'TEC-0005') AND orden = 1
);
