import os
import shlex
import atexit
import sys

try:
    import readline
except ImportError:
    if sys.platform == "win32":
        import pyreadline3 as readline
    else:
        raise ImportError("readline alternative not found.")

from rich.table import Table

from src.constants import LOG_FILE
from src.core.interface.console import CONSOLE

if os.path.exists(LOG_FILE):
    readline.read_history_file(LOG_FILE)
else:
    with open(LOG_FILE, 'w') as f:
        pass

atexit.register(readline.write_history_file, LOG_FILE)


class CLI:
    terminal_columns: list[int] = [16, 6]
    builtin_commands = {
        'quit': ['exit', 'quit'],
        'help': ['help', '?']
    }
    builtin_kwargs = [
        ("-h, --help", "Display help for the given command."),
    ]

    def __init__(self):
        self.commands = {}

    def command(self, name, description="", arguments=None, keyword_arguments=None):
        def decorator(func):
            self.commands[name] = {
                "func": func,
                "description": description,
                "arguments": arguments or [],
                "keyword_arguments": keyword_arguments or {},
            }
            return func

        return decorator

    def start(self):
        CONSOLE.print(
            "[dim]Welcome to my custom CLI[/dim]. Type 'help' to see available commands. Type 'exit' to quit.")

        while True:
            try:
                raw_input_line = input(">>> ").strip()
                if not raw_input_line:
                    continue

                self._log_command(raw_input_line)

                if self._handle_exit_commands(raw_input_line):
                    break
                elif self._handle_builtin_commands(raw_input_line):
                    continue

                cmd_name, args_and_kwargs = self._parse_command(raw_input_line)
                if cmd_name not in self.commands:
                    CONSOLE.print(f"[red]'{cmd_name}' is not a recognized command.[/red]")
                    continue

                if len(args_and_kwargs) == 1 and args_and_kwargs[0] in ("-h", "--help"):
                    self.print_help_for_command(cmd_name)
                else:
                    cmd_args_and_kwargs = self._parse_command_args(cmd_name, args_and_kwargs)
                    if cmd_args_and_kwargs:
                        cmd_args, cmd_kwargs = cmd_args_and_kwargs
                        self.commands[cmd_name]["func"](*cmd_args, **cmd_kwargs)

            except Exception as e:
                CONSOLE.print(f"[red]An error occurred:[/red] {e}")

    @staticmethod
    def _log_command(raw_input_line: str):
        if readline.get_current_history_length() == 0 or readline.get_history_item(
                readline.get_current_history_length()) != raw_input_line:
            readline.add_history(raw_input_line)

    @staticmethod
    def _parse_command(raw_input_line: str) -> tuple[str, list[str]]:
        parts = shlex.split(raw_input_line)
        return parts[0], parts[1:]

    def _parse_command_args(self, cmd_name: str, args_and_kwargs: list[str]) -> tuple[list[str], dict] | None:
        cmd_info = self.commands[cmd_name]
        expected_args = cmd_info["arguments"]
        expected_kwargs = cmd_info["keyword_arguments"]

        alias_to_key = {}
        expects_value = {}
        for canonical, meta in expected_kwargs.items():
            for alias in meta["aliases"]:
                alias_to_key[alias] = canonical
                expects_value[alias] = meta.get("expects", None) is not None

        positional = []
        kwargs = {}
        i = 0

        while i < len(args_and_kwargs):
            part = args_and_kwargs[i]
            if part.startswith("-"):
                if part not in alias_to_key:
                    CONSOLE.print(f"[red]Unknown keyword argument '{part}'[/red]")
                    return None

                key = alias_to_key[part]
                expects_arg = expects_value[part]

                if expects_arg:
                    if i + 1 >= len(args_and_kwargs):
                        CONSOLE.print(f"[red]Missing value for keyword argument '{part}'[/red]")
                        return None
                    value = args_and_kwargs[i + 1]
                    if value.startswith("-"):
                        CONSOLE.print(f"[red]Expected a value for '{part}' but got another flag.[/red]")
                        return None
                    kwargs[key] = value
                    i += 2
                else:
                    kwargs[key] = True
                    i += 1
            else:
                positional.append(part)
                i += 1

        if len(positional) != len(expected_args):
            # arg_list = ', '.join(name for name, _ in expected_args)
            CONSOLE.print(f"[red]Expected {len(expected_args)} positional arguments but got {len(positional)}[/red]")
            return None

        return positional, kwargs

    def _handle_exit_commands(self, raw_input_line: str) -> bool:
        return raw_input_line.lower().strip() in self.builtin_commands['quit']

    def _handle_builtin_commands(self, raw_input_line: str) -> bool:
        cleaned = raw_input_line.strip()
        parts = cleaned.split(maxsplit=1)

        if parts[0].lower() in self.builtin_commands['help']:
            if len(parts) == 1:
                self.print_help()
            else:
                cmd_name = parts[1].strip()
                if cmd_name in self.commands:
                    self.print_help_for_command(cmd_name)
                else:
                    CONSOLE.print(f"[red]No such command[/red]")
            return True

        return False

    def print_help(self):
        CONSOLE.print("[bold]Usage:[/bold]")
        CONSOLE.print("    command [dim]<argument> <options>[/dim]", highlight=False, end="\n\n")

        if self.builtin_kwargs:
            CONSOLE.print("[bold]Options:[/bold]")
            options_table = Table(show_header=False, box=None, padding=(0, 1))
            options_table.add_column("Flag", style="blue", no_wrap=True, width=self.terminal_columns[0])
            options_table.add_column("Description")

            for flag, desc in self.builtin_kwargs:
                options_table.add_row(flag, desc)

            CONSOLE.print(options_table)
            CONSOLE.print()

        CONSOLE.print("[bold]Available commands:[/bold]")
        command_table = Table(show_header=False, box=None, padding=(0, 1))
        command_table.add_column("Command", style="blue", no_wrap=True, width=self.terminal_columns[0])
        command_table.add_column("Description")

        for name, cmd in self.commands.items():
            description = cmd.get("description", "")
            command_table.add_row(name, description)

        CONSOLE.print(command_table)

    def print_help_for_command(self, name):
        if name not in self.commands:
            CONSOLE.print(f"[red]No such command: {name}[/red]")
            return

        cmd = self.commands[name]

        CONSOLE.print(f"[bold]Description:[/bold]\n  {cmd['description']}\n")

        args_part = " ".join(f"<{arg}>" for arg, _ in cmd["arguments"])
        CONSOLE.print(f"[bold]Usage:[/bold]")
        CONSOLE.print(f"    {name} {args_part}\n", highlight=False)

        if cmd["arguments"]:
            CONSOLE.print("[bold]Arguments:[/bold]")
            arg_table = Table(show_header=False, box=None, padding=(0, 1))
            arg_table.add_column("Argument", style="blue", no_wrap=True, width=self.terminal_columns[0])
            arg_table.add_column("Description")

            for arg, desc in cmd["arguments"]:
                arg_table.add_row(arg, desc)

            CONSOLE.print(arg_table)
            CONSOLE.print()

        if cmd["keyword_arguments"]:
            CONSOLE.print("[bold]Options:[/bold]")

            kw_table = Table(show_header=False, box=None, padding=(0, 1))
            kw_table.add_column("Flags", style="blue", no_wrap=True, width=self.terminal_columns[0])
            kw_table.add_column("Values", style="dim", no_wrap=True, width=self.terminal_columns[1], highlight=False)
            kw_table.add_column("Description")

            for canonical, meta in cmd["keyword_arguments"].items():
                flags = ", ".join(meta["aliases"])
                type_hint = f"<{meta['default']}>" if meta.get("expects") else ""
                desc = meta["description"]
                kw_table.add_row(flags, type_hint, desc)

            CONSOLE.print(kw_table)


cli = CLI()
