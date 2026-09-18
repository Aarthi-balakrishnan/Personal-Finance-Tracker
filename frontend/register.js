const form =
    document.getElementById(
        "registerForm"
    );


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value;


        const email =
            document.getElementById(
                "email"
            ).value;


        const password =
            document.getElementById(
                "password"
            ).value;


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name,
                                email,
                                password

                            })

                    }
                );


            const data =
                await response.json();


            document.getElementById(
                "message"
            ).innerText =
                data.message;


            if (response.ok) {

                setTimeout(
                    function() {

                        window.location.href =
                            "login.html";

                    },
                    1000
                );

            }


        } catch (error) {

            document.getElementById(
                "message"
            ).innerText =
                "Backend connection failed";

        }

    }
);