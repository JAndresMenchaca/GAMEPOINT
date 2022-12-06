        const URL = 'http://localhost:3000/users';
            var listado;
            var txtNombre, txtApellido, txtSemestre, txtFechaNacimiento;

            window.onload = () => {
                txtNombre = document.getElementById('txtNombre');
                txtApellido = document.getElementById('txtApellido');
                txtSemestre = document.getElementById('txtSemestre');
                txtFechaNacimiento = document.getElementById('txtFechaNacimiento');
                getStudents();
            }

            const registrarDatos = async () => {
                let student = {
                    nombre: txtNombre.value,
                    apellido: txtApellido.value,
                    semestre: txtSemestre.value,
                    fechanac: txtFechaNacimiento.value
                };

                await axios.post(URL, student);
                window.location.href = '/pages/main.html';
            }