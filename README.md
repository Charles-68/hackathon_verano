Un mapa tipo google earth, hay secretos geolocalizados, subidos por gente anónima, con mensajes de "Aqui me ligue a mi profe", es anónimo, pero tu con tu cuenta puedes ver los secretos que tu escribiste, y eres capaz de manejarlos, es decir, editarlo, borrarlos, o cambiarlos de lugar, junto con un historial de versiones que todos tienen acceso a. Además se podrá dar like y guardar secretos que leíste en otros lugares en una interfaz distnita, y que haya botones que te redirijan a la ubicación del secretos. Los secretos que tengan más likes, se mostrarán más grande en el mapa.


requerimientos:
Que haya una barra superior en la página con los botones de sign up, log in. 
Par el login, doble autenticación, que sea con correo y contraseña.
Que una vez iniciada sesión, en la misma barra, ya no se mostren esos botones, sino que se muestre el botón de perfil.
Además, si se inicia sesión con un correo en específico, puedas manejar los usuarios como admin, el correo será: charles8002.dgc@gmail.com
El mapa, literalmente un mapa en 2d donde puedas dezplazarte manteniendo presionado el mouse y moviendolo tipo arrastrarlo, que lo puedas girar, hacer zoom in, zoom out, y que no se te olviden los secretos más importantes que haya en el mapa
Además unos botones en la parte inferior derecha en la que una es para seleccionar y leer secretos, dar like y demás. y otro para tu escribir tu secreto
Que en el mensaje en donde se muestra el secreto, nunca se mostrará el nombre de usuario del mensaje, solo el secreto, numero de likes, y el emoji que indique el tema del secreto.
Cuando le apretes al botón de escribir tu secreto, se te muestre un cuadro de texto en el que puedas escribir tu secreto, además de clasificarlo en algún emoji que indique el tema del secreto. Los temas son: Romántico, Amistoso, Triste, Divertido, Odio. Luego te redirija al mapa, y se podrás elegir con una pinchita el lugar en donde localizar tu secreto, y se te mostrará el mapa con tu secreto en el lugar que eligiste.
Se podrá borrar cualquier usuario, y su historial de secretos.

Tecnologías:
Frontend: Next.js (React) para la web, usando una librería de mapas 3D tipo CesiumJS o react-globe.gl para el "planeta tierra".
Backend: Supabase (o Firebase) para autenticación, base de datos y almacenamiento de secretos (con historial).
Autenticación: Supabase Auth con correo+contraseña y configuración de doble factor.
Mapa: CesiumJS o react-globe.gl para el globo 3D, integración con los secretos.
UI/UX: Diseño moderno, responsivo, con barra superior y botones flotantes.