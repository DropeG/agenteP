import json
import time
from abc import ABC, abstractmethod
from pathlib import Path

# Setup paths relative to agents/core
AGENTS_DIR = Path(__file__).resolve().parent.parent
IO_DIR = AGENTS_DIR / "io"
PENDING_FILE = IO_DIR / "pending_task.json"
RESOLVED_FILE = IO_DIR / "resolved_task.json"

class TaskStrategy(ABC):
    """
    Abstract Base Class (Strategy Interface)
    Every task execution strategy must implement the execute method.
    """
    @abstractmethod
    def execute(self, task: dict) -> dict:
        pass

class ZeroCostLLMStrategy(TaskStrategy):
    """
    Strategy that delegates execution to the LLM (Antigravity Bridge)
    via pending_task.json and waits for resolved_task.json.
    """
    def execute(self, task: dict) -> dict:
        task_id = task.get("id")
        task_prompt = task.get("prompt")
        task_type = task.get("task_type")

        IO_DIR.mkdir(parents=True, exist_ok=True)

        pending_data = {
            "id": task_id,
            "task_type": task_type,
            "prompt": task_prompt
        }

        with open(PENDING_FILE, "w", encoding="utf-8") as f:
            json.dump(pending_data, f, indent=2)

        print("[Strategy: ZeroCostLLM] Wrote task details to agents/io/pending_task.json")
        print("\n==========================================================================")
        print("⚠️  LLM API Bypassed: Waiting for Antigravity to solve the task.")
        print("👉 Please tell Antigravity in your chat:")
        print(f"   \"Solve the pending task in agents/io/pending_task.json\"")
        print("==========================================================================\n")

        print("Waiting for agents/io/resolved_task.json...", end="", flush=True)

        while not RESOLVED_FILE.exists():
            time.sleep(2)
            print(".", end="", flush=True)

        print("\n[Strategy: ZeroCostLLM] Resolution detected!")

        try:
            with open(RESOLVED_FILE, "r", encoding="utf-8") as f:
                resolution = json.load(f)

            if PENDING_FILE.exists():
                PENDING_FILE.unlink()
            if RESOLVED_FILE.exists():
                RESOLVED_FILE.unlink()

            return resolution
        except Exception as e:
            print(f"\n[Strategy: ZeroCostLLM] Error reading resolution: {e}")
            raise e

class TaskStrategyFactory:
    """
    Registry Pattern (Dynamic Factory)
    Maps task_type strings to their corresponding Strategy class without if/else logic.
    """
    _registry = {
        "evaluate_announcement": ZeroCostLLMStrategy,
        "summarize_material": ZeroCostLLMStrategy,
        "setup_assignment": ZeroCostLLMStrategy,
        "default": ZeroCostLLMStrategy
    }

    @classmethod
    def register_strategy(cls, task_type: str, strategy_class: type[TaskStrategy]):
        """Allows dynamic registration of new strategies at runtime."""
        cls._registry[task_type] = strategy_class

    @classmethod
    def get_strategy(cls, task_type: str) -> TaskStrategy:
        """
        Instantiates and returns the Strategy class registered for task_type.
        Falls back to default strategy if task_type is unrecognized.
        """
        strategy_class = cls._registry.get(task_type, cls._registry["default"])
        return strategy_class()
