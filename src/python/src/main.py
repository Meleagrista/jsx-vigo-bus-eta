from src.core.interface.cli import cli
from src.core.interface.console import CONSOLE

@cli.command(
    "greet",
    description="Says hello to the user.",
    arguments=[("name", "Name of the user to greet")],
    keyword_arguments={
        'language': {
            'aliases': ["--language", "-l"],
            'description': "Language to use for the greeting",
            "expects": "Language code",
            "default": "en"
        }
    }
)
def greet(name: str, language: str = "en"):
    if language.lower() not in ["en", "es"]:
        CONSOLE.print("[red]Unsupported language. Supported languages are: EN, ES.[/red]")
        return

    if language.lower() == "es":
        CONSOLE.print("¡Hola, [bold]{name}[/bold]! Bienvenido al CLI.".format(name=name))
    elif language.lower() == "en":
        CONSOLE.print("Hello, [bold]{name}[/bold]! Welcome to the CLI.".format(name=name))
    else:
        CONSOLE.print("[red]The code '{language}' is not supported, even if it was allowed.[/red]".format(language=language))

if __name__ == "__main__":
    cli.start()