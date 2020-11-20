# Proyecto Delilah Restó
El Proyecto Delilah Restó busca emular el desarrollo backend de un sistema de pedidos online. Siguiendo estas instrucciones podrá probar el proyecto desde su máquina

## Preparación
Para correr el proyecto sin inconvenientes, debe tener instalado:
  - Node.js
  - MySQL ***(debe tener el servicio corriendo)***
  - Postman
 
**NOTA**: Recuerde verificar el archivo ***.env*** ya que de este archivo depende el buen funcionamiento de la base de datos

## Inicialización
1. Ingresar a la carpeta del proyecto

        cd delilah_proyect
2. Instalar el proyecto y sus dependencias

        npm i
3. Ejecutar el script ***start*** para crear la base de datos e iniciar la aplicación

        npm run start
## Endpoints
En esta sección encontrará la lista de comandos disponibles además de la estructura general que debe seguir para llevarlos a cabo
### Usuarios
Los usuarios estan clasificados en 2 roles: *Administrador* y *Usuario*. Dependiendo del rol podrá realizar diferentes peticiones.
A continuación encontrará todos los endpoints disponibles para **Usuarios**

#### *Registrarse*
Un usuario nuevo **debe** seguir la siguiente estructura:

    POST - http://localhost:3000/api/usuarios/registrar
    {
        "username" : "nuevo",
        "nombreCompleto": "Mi Nombre",
        "correo": "email@gmail.com",
        "telefono": "+57 3216549875",
        "direccion": "un lugar",
        "contrasena": "incognito"
    }

Si el usuario se registró con exito, se le asignará el rol de *Usuario* por defecto.

---

#### *Login*
Aquí se verificará que el usuario se encuentre dentro de la base de datos del proyecto.
- En caso de exito retornará un token necesario para llevar a cabo otras peticiones
- En caso de error no podrá recibir el token, sino que recibirá un mensaje de error en su lugar

Para realizar el login debe seguir la siguiente estructura en *Postman*

*Administrador*
    
    POST - http://localhost:3000/api/login
    {
        "username": "haruMura",
        "password": "1q84"
    }

*Usuario*
    
    POST - http://localhost:3000/api/login
    {
        "username": "agi",
        "password": "mystery"
    }
Cuando reciba el token deberá utilizarlo en *Postman* de la siguiente forma:
1. Copie el token
2. Vaya a la pestaña de *"Authorization"*
3. En **Type**, Seleccione la opción *"Bearer Token"*
4. Pegue el token en el campo de **Token**

---

#### *Listar Usuarios (Admin)*

    GET - http://localhost:3000/api/usuarios

Retorna la lista de usuarios disponibles en la base de datos. Si el usuario que está realizando la solicitud no es de Rol *Administrador* retorna un **error**.

#### *Información del Usuario*
Aquí podrá obtener información sobre su cuenta, para esto debe haber hecho login de lo contrario retornará error.

    GET - http://localhost:3000/api/cuenta

### Productos

Rol *Usuario*
- Puede consultar todos los productos o especificar el **id** del pedido.
- No puede crear, editar o eliminar productos

Rol *Administrador* 
- Puede consultar todos los productos o especificar el **id** del pedido.
- Puede crear, editar o eliminar productos

A continuación encontrará todos los endpoints disponibles para **Productos**.

#### *Listar Productos*

Aquí podrá obtener la lista de productos disponibles o la información de un único porducto si especifica el **id** del producto

    GET - http://localhost:3000/api/productos/:id?
    
#### *Registrar Producto Nuevo (Admin)*

Solo un usuario con Rol *Administrador* puede registrar un producto nuevo. De igual forma, el producto nuevo debe seguir la siguiente estructura:

    GET - http://localhost:3000/api/productos/:id?
    {
        "nombre": "empanada",
        "descripcion": "EMP",
        "precio": "120",
        "imagen": "https://image.freepik.com/free-photo/chicken-pie-kurnik-that-is-beautifully-decorated-table_1150-23098.jpg"
    }

#### *Eliminar Producto (Admin)*

Solo un usuario con Rol *Administrador* puede eliminar un producto. Se **debe** especificar el *id del Producto*

    DELETE - http://localhost:3000/api/productos/:id

#### *Actualizar Producto (Admin)*

Solo un usuario con Rol *Administrador* puede actualizar un producto. Se **debe** especificar el *id del Producto*

    PUT - http://localhost:3000/api/productos/:id
    {
        "nombre": "empanada",
        "descripcion": "EMP",
        "precio": "120",
        "imagen": "https://image.freepik.com/free-photo/chicken-pie-kurnik-that-is-beautifully-decorated-table_1150-23098.jpg"
    }

Se puede actualizar cualquier valor del producto siempre y cuando se utilice el nombre de la llave correspondiente, es decir, en caso de que solo se quiera actualizar el *nombre* del producto se debe hacer de la siguiente forma:

    {
        "nombre": "empanada"
    }

### Pedidos
Rol *Usuario*
- Solo puede consultar sus pedidos.
- Puede generar un nuevo pedido

Rol *Administrador* 
- Puede consultar todos los pedidos o especificar el **id** del pedido
- Puede actualizar el estado del pedido

A continuación encontrará todos los endpoints disponibles para **Pedidos**.

#### *Listar Pedidos*
Aquí podrá obtener la lista de pedidos disponibles o la información de un único porducto si especifica el id del producto*

    GET - http://localhost:3000/api/pedidos/:id?

*El Rol *Usuario* solo puede consultar sus propios pedido asi haya especificado un **id**

#### *Crear Pedido*

Para crear un pedido debe especificar el método de pago y la lista de productos que desea ordenar:

    POST - http://localhost:3000/api/pedidos/nuevo
    {
        "metodo": "efectivo",
        "pedido": [
            {
                "id_producto": 1,
                "cantidad": 1
            },
            {
                "id_producto": 2,
                "cantidad": 2
            }
        ]
    }
    
#### *Actualizar Pedido (Admin)*

Solo un usuario con Rol Administrador puede actualizar un pedido. Se **debe** especificar el id del pedido

    PUT - http://localhost:3000/api/pedidos/:id
    {
        "estado": "cancelado"
    }
    