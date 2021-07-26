# 

Install nim from [here](https://nim-lang.org/install.html) :


[https://nim-lang.org/install.html](https://nim-lang.org/install.html)

## Run the server using:

`nim c -r lens_ux_server.nim`

The default port is 5000 but you can change it to something else (like 6000) modifying this line in `lens_ux_server.nim`:


    settings:
        port = Port(6000)


