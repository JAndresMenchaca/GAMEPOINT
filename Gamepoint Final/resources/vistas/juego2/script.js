/**
 * Proyecto de videojuego
 * 
 * El propósito de este ejercicio es el de desarrollar un videojuego
 * operable a través del teclado del computador.
 * 
 * El código fuente está compuesto por dos clases:
 * 
 * Bullet: Representa al proyectil que es lanzado ya sea por la misma nave
 * o bien un proyectil enemigo.
 * 
 * ShuttleGame: Es la clase principal del proyecto. A continuación se presentan
 * mayores detalles sobre cada una de las clases
 * 
 * Debes completar como mínimo todas las secciones con el texto HACER.
 * 
 * M.Sc. Ing. Oscar Contreras C.
 */

// Identificadores para proyectiles propios o enemigos



const OWN_BULLET = 1;
const ENEMY_BULLET = 2;
var sound = new Audio(); //variable para poner un sonido, sonido que suena cuando un proyectil impacta con otro proyectil
sound.src = "over.mp3"; //aqui definimos el archivo de audio que vamos a utilizar

var sound1 = new Audio(); //variable para poner un sonido, sonido de fondo, este sonido solo se escucha cuando el jugador aun no perdio
sound1.src = "2.mp3";  //aqui definimos el archivo de audio que vamos a utilizar

var sound2 = new Audio(); //variable para poner un sonido, sonido que suena cuando el jugador pierde
sound2.src = "3.mp3";  //aqui definimos el archivo de audio que vamos a utilizar
// Ancho y altura de los proyectiles
const BULLET_WIDTH = 20;
const BULLET_HEIGHT = 40;

// Clase Bullet para visualizar los proyectiles en la escena
class Bullet {
    // Inicialización de propiedades
    constructor(x, y, type, speed, ctx) {
        // Coordenadas de visualización
        // Recuerda que en el sistema de coordenadas de la pantalla
        // el eje x positivo apunta hacia la derecha y el eje y positivo hacia abajo.
        this.x = x;
        this.y = y;
        this.type = type;  // Tipo de proyectil
        this.ctx = ctx;    // Contexto de gráficos del canvas
        this.speed = speed;  // Velocidad de movimiento.

        // Dimensiones del proyectil
        this.width = BULLET_WIDTH;     
        this.height = BULLET_HEIGHT;
    }

    moveUp() {
        // HACER: Completa el código para que el proyectil
        // se mueva hacia arriba.
        // Pista: Necesitarás las referencias this.y, así como this.speed

        // Tu código aquí (1 línea aprox)
        this.y -= this.speed;
        ////////
    }

    moveDown() {
        // HACER: Completa el código para que el proyectil
        // se mueva hacia abajo.
        // Pista: Necesitarás las referencias this.y, así como this.speed

        // Tu código aquí (1 línea aprox)
        this.y += this.speed;
        ////////
    }

    draw() {
        // Visualizar la forma geométrica en la pantalla
        // Algo que puedes hacer para mejorar la apariencia
        // es usar imágenes en lugar de mostrar simplemente un rectángulo.
        if (this.type == OWN_BULLET) {
            this.ctx.fillStyle = 'skyblue'; // Proyectil de la nave: celeste
        } else {
            this.ctx.fillStyle = 'red'; // Proyectil enemigo: rojo
        }

        // Mostrar el rectángulo
        this.ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

// Clase principal de la aplicación
class ShuttleGame {
    /**
     * Inicialización de variables principales
     */
    constructor() {
        let body = document.querySelector('body');  // Referencia al body de la página
        this.canvas = document.querySelector('#canvas'); // Referencia al elemento canvas
        this.message = 'Press  Enter  to  start!';  // Mensaje de inicio.

        // Imagen de la nave en la parte inferior. Si lo deseas, puedes usar tus propias imágenes
        this.shuttle = new Image();
        this.shuttle.src = '1.png'; //el perro
        
        // Imagen para el fondo de la escena. Si lo deseas, puedes usar tus propias imágenes
        this.background = new Image();
        this.background.src = 'background.png'; //el fondo

        // Este arreglo almacena las referencias
        // de todas las imágenes que usamos.
        // Será útil para inicializar los temporizadores de actualización
        // Cuando todas las imágenes se hayan cargado
        this.images = new Array();
        this.images.push(this.shuttle);
        this.images.push(this.background);

        this.speed = 30;  // Velocidad de movimiento
        this.playing = false;  // Determina si el juego está activo

        // Dimensiones del área canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = canvas.getContext('2d');  // Contexto de gráficos 2D
        
        // Manejo de eventos del teclado
        // Se procesan las teclas de flecha izquierda, derecha y enter
        let moveLeftAction = this.moveLeft.bind(this);
        let moveRightAction = this.moveRight.bind(this);
        let startAction = this.start.bind(this);

        body.addEventListener('keydown', function(event) {
            switch (event.key) {
                case 'ArrowLeft':
                    moveLeftAction();
                    break;
                case 'ArrowRight':
                    moveRightAction();
                    break;
                case 'Enter':
                    sound2.pause(); //aqui hacemos que el sonido de esta vaiable se ponga en pausa
                    sound1.play(); //aqui le ponemos play al sonido de esta vaiable 
                    startAction();
                    break;
            }
        });

        // Cuando todas las imágenes se hayan terminado de cargar
        // entonces activar el temporizador que refresca la pantalla
        // de la animación
        // cada 10 milisegundos a través de setInterval
        let numImages = 0;
        let updateCall = this.update.bind(this);

        for (let image of this.images) {
            image.onload = function() {
                // Si tienes más imágenes, debes especificar el valor aquí
                // en lugar de 2
                if (++numImages == 2) {
                    setInterval(updateCall, 10);
                }
            }
        }
    }

    /**
     * Lógica para iniciar el juego
     */
    start() {
        // Si el juego no está activo, ignorar todo lo demás
        if (this.playing) {
            
            return;
        }

        // Posición inicial de la nave
        this.shuttleX = this.canvas.width / 2;

        ////////////////////////////////////////////////////////////////////////
        // Configurar el intervalo en milisegundos
        // con que se generan los proyectiles enemigos
        // llamando a generateEnemyBullets
        // Por defecto: 2 segundos

        if (this.enemyBulletsInterval) {
            // Si ya existe un previo manejador de eventos, eliminarlo
            clearInterval(this.enemyBulletsInterval);
        }

        let generateEnemyBulletsCall = this.generateEnemyBullets.bind(this);

   
        this.enemyBulletsInterval = setInterval(generateEnemyBulletsCall, 1500);
        ////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////
        // Configurar el intervalo en milisegundos con que se generan
        // los proyectiles de la propia nave llamando a fireBullet
        // Por defecto: Medio segundo

        if (this.ownBulletsInterval) {
            // Si ya existe un previo manejador de eventos, eliminarlo
            clearInterval(this.ownBulletsInterval);
        }

        let fireBulletCall = this.fireBullet.bind(this);
        this.ownBulletsInterval = setInterval(fireBulletCall, 500);
        ////////////////////////////////////////////////////////////////////////

        this.ownBullets = new Array();   // Arreglo de proyectiles de la nave
        this.enemyBullets = new Array(); // Arreglo de proyectiles enemigos

        this.playing = true;  // Juego activo
        this.points = 0;      // Número de puntos

        // Visualizar el puntaje en la parte superior
        this.showPoints();
    }

    showPoints() {
        // HACER: Asigna la información de puntaje a this.message
        this.message = 'POINTS: ' + this.points ;   // Completar esta parte

    }

    gameOver() {
        // HACER:
        // Implementa la lógica para que el juego se detenga
        // cuando el usuario ha perdido
        // Asimismo, se deberá mostrar en la parte superior el texto GAME OVER!!!
        // Pista: Debes trabajar con los atributos this.playing y this.message\
        
        sound1.pause(); //aqui hacemos que el sonido de esta vaiable se ponga en pausa
        sound2.play(); //aqui le ponemos play al sonido de esta vaiable 
        ///// Tu código aquí (2 líneas aprox)
        this.playing = false;
        this.message = 'GAME OVER! ---  TOTAL POINTS: ' + this.points;;
        
        ///////////////////////////////
    }

    /**
     * Visualización de cada frame de la animación
     * Aquí se implementa la lógica para mostrar las figuras en la pantalla
     * para cada frame
     */
    update() {
        let ctx = this.ctx;

        // Mostrar el fondo de la escena
        // Dibujando un rectángulo que se expande de esquina a esquina
        // Desde el origen hasta la parte inferior derecha
        var pattern = ctx.createPattern(this.background, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.playing) {
            // Si el juego está activo, entonces:
            // Paso 1. Se deben verificar las colisiones
            // Paso 2. Se deben eliminar de memoria los proyectiles de la nave que ya no están en pantalla
            // Paso 3. Se debe aplicar el movimiento a los proyectiles propios y enemigos, y luego mostrar cada figura.
            this.checkCollisions();  // Paso 1
            this.cleanFiredBullets(this.ownBullets);  // Paso 2

            // Paso 3
            // Dentro de cada loop debes ejecutar el movimiento
            // de los proyectiles de la nave y enemigos, luego llamar a draw para cada caso
            // Pista: Debes usar los métodos moveUp y moveDown según corresponda
            // Los proyectiles enemigos se mueven hacia abajo 
            // y los proyectiles propios se mueven hacia arriba

            for (let ownBullet of this.ownBullets) {
                // HACER:
                // Ejecuta el movimiento de ownBullet (proyectil propio)
                // y luego llama al método draw()

                // Tu código aquí (2 líneas aprox)
                ownBullet.moveUp();
                ownBullet.draw();
                //////////////////////////////////
            }

            for (let enemyBullet of this.enemyBullets) {
                // HACER:
                // Ejecuta el movimiento de enemyBullet (proyectil enemigo)
                // y luego llama al método draw()

                // Tu código aquí (2 líneas aprox)
               enemyBullet.moveDown();
               enemyBullet.draw();
                /////////////////////////////////
            }
        } else {
            // Si el juego no está activo, entonces simplemente mostrar
            // los elementos sin realizar ningún movimiento.
            if (this.ownBullets) {
                for (let ownBullet of this.ownBullets) {
                    ownBullet.draw();
                }
            }

            if (this.enemyBullets) {
                for (let enemyBullet of this.enemyBullets) {
                    enemyBullet.draw();
                }
            }
        }

        // Si es la primera vez que se carga la escena, posicionar correctamente la nave
        if (this.shuttleX === undefined || this.shuttleY === undefined) {
            this.shuttleX = canvas.width / 2;
            this.shuttleY = canvas.height - this.shuttle.height;
        }

        // Visualizar la nave en pantalla
        ctx.drawImage(this.shuttle, this.shuttleX, this.shuttleY);

        // Mostrar el texto en la parte superior, con fuente Arcade (puedes elegir tu propio tipo de letra)
        ctx.fillStyle = 'white';
        ctx.font = '30pt Arcade';
        ctx.fillText(this.message, 30, 40);
    }

    /**
     * Verificar si hay colisiones entre los elementos
     * Hay dos casos posibles:
     * CASO 1. Si un proyectil enemigo impacta con la nave o con la parte inferior de la escena, entonces pierde el juego
     * CASO 2. Si un proyectil enemigo impacta con un proyectil de la nave (ownBullet), entonces gana puntos
     */
    checkCollisions() {
        // CASO 1. Verificar cercanía entre proyectil enemigo y de la nave
        // o bien, verificar si el proyectil enemigo ha llegado a la parte inferior del canvas
        for (let enemyBullet of this.enemyBullets) {
            let sqDiffx = this.shuttleX + this.shuttle.width / 2 - enemyBullet.x + BULLET_WIDTH / 2; // Diferencia entre centros de masa
            let sqDiffy = this.shuttleY - (enemyBullet.y + BULLET_HEIGHT); // Distancia entre tope inferior del proyectil y parte superior de la nave

            sqDiffx *= sqDiffx;
            sqDiffy *= sqDiffy;

            let threshold = 20;

            if (sqDiffx + sqDiffy < threshold * threshold || // Teorema de Pitágoras al cuadrado
                (enemyBullet.y >= this.canvas.height - enemyBullet.height)) {
                
                this.gameOver();  // Perdió :(
                
                return;
            }
        }

        // CASO 2. Verificar cercanía entre proyectil de la nave y enemigo
        // Si algún proyectil enemigo está lo suficientemente próximo al de la nave
        // entonces sumar puntos y eliminar el proyectil enemigo.
        for (let ownBullet of this.ownBullets) {
            let i = this.enemyBullets.length;

            while (i--) {
                let enemyBullet = this.enemyBullets[i];

                let sqDiffx = ownBullet.x - enemyBullet.x;
                let sqDiffy = ownBullet.y - (enemyBullet.y + BULLET_HEIGHT);
                let threshold = 20;

                sqDiffx *= sqDiffx;
                sqDiffy *= sqDiffy;

                if (sqDiffx + sqDiffy < threshold * threshold) { // Teorema de Pitágoras al cuadrado
                    sound.play();
                    this.points++;  // Agregar un punto
                    this.enemyBullets.splice(i, 1);  // Eliminar proyectil enemigo
                    this.showPoints();  // Visualizar el número de puntos
                   
                    break;
                }
            }
        }
    }

    /**
     * Quitar de memoria los proyectiles de la nave que ya no son visibles en la pantalla
     */
    cleanFiredBullets(bullets) {
        let i = bullets.length;

        while (i--) {
            let bullet = bullets[i];
            if (bullet.type == OWN_BULLET && bullet.y <= -bullet.height) {
                bullets.splice(i, 1);
            }
        }
    }

    moveLeft() {
        // HACER:
        // Implementa la lógica para mover la nave hacia la izquierda
        // Recuerda que esto debe hacerse solamente si el juego está activo.
        // Pista: Necesitarás this.playing, this.shuttleX y this.speed
   
        // Tu código aquí (3 líneas aprox)
        if(this.playing == true){
            this.shuttleX -= this.speed;
        }
        
        //////////////////////////////////
    }

    moveRight() {
        // HACER:
        // Implementa la lógica para mover la nave hacia la derecha
        // Recuerda que esto debe hacerse solamente si el juego está activo.
        // Pista: Necesitarás this.playing, this.shuttleX y this.speed

        // Tu código aquí (3 líneas aprox)
        if(this.playing == true){ //es necesario poner ==
            this.shuttleX += this.speed;
        }
           
        /////////////////////////////////
    }

    /**
     * Generar un nuevo proyectil de la nave y luego agregarlo al arreglo this.ownBullets
     */
    fireBullet() {
        if (!this.playing) {
            return;
        }

        this.ownBullets.push(new Bullet(this.shuttleX + (this.shuttle.width - BULLET_WIDTH) / 2, this.shuttleY, OWN_BULLET, 10, this.ctx));
    }

    /**
     * Generar los proyectiles enemigos que emanan de la parte superior de la escena
     * y agregar las referencia a this.enemyBullets
     */
    generateEnemyBullets() {
        if (!this.playing) {
            return;
        }

        // Generar aleatoriamente la posición de cada proyectil enemigo
        // El cálculo se realizó de tal manera de que cada proyectil tenga aproximadamente
        // la misma probabilidad de aparecer en cualquier lugar desde la parte superior.
        let enemyBullet = new Bullet((Math.random() * (this.canvas.width * 2 / 3) + this.canvas.width / 6) , 0, ENEMY_BULLET, 3, this.ctx);
        this.enemyBullets.push(enemyBullet);
    }
}

// Inicializar el juego
window.onload = function() {
    new ShuttleGame();
}
