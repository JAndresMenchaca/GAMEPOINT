        const URL = 'http://localhost:3000/users';
            var txtUser, txtPass, txtCorreo;
            
            window.onload = () => {
                txtUser = document.getElementById('txtUser');
                txtPass = document.getElementById('txtPass');
                txtCorreo = document.getElementById('txtCorreo');
            }

            const registrarDatos = async () => {
                let usuarios = {
                    nombre: txtUser.value,
                    contrasenia: txtPass.value,
                    correo: txtCorreo.value,
                };

                await axios.post(URL, usuarios);
            }