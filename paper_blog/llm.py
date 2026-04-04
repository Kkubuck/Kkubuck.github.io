from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Dict, Optional

from .heuristics import build_safe_summary_from_abstract, extract_key_claims, summarize_section
from .models import DraftSection, PaperExtraction

DEFAULT_MODEL_NAME = "Qwen/Qwen3-14B-Instruct-2507"
FALLBACK_MODEL_NAME = "Qwen/Qwen3-8B-Instruct-2507"


@dataclass
class LLMConfig:
    backend: str = "auto"
    model_name: str = DEFAULT_MODEL_NAME
    model_path: str = ""
    max_new_tokens: int = 1400
    temperature: float = 0.2


class BaseBackend:
    def draft(self, extraction: PaperExtraction) -> Dict[str, Any]:
        raise NotImplementedError


class HeuristicBackend(BaseBackend):
    def draft(self, extraction: PaperExtraction) -> Dict[str, Any]:
        return build_heuristic_draft(extraction)


class TransformersBackend(BaseBackend):
    def __init__(self, model_name: str = DEFAULT_MODEL_NAME, max_new_tokens: int = 1400, temperature: float = 0.2):
        self.model_name = model_name
        self.max_new_tokens = max_new_tokens
        self.temperature = temperature
        try:
            import torch  # type: ignore
            from transformers import AutoModelForCausalLM, AutoTokenizer  # type: ignore
        except Exception as exc:  # pragma: no cover - optional dependency
            raise RuntimeError(
                "transformers/torch are required for the local HF backend. Install `pip install -e '.[dev,llm]'` first."
            ) from exc
        self._torch = torch
        self._tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        self._model = AutoModelForCausalLM.from_pretrained(
            model_name,
            trust_remote_code=True,
            torch_dtype="auto",
            device_map="auto",
        )
        self._model.eval()

    def draft(self, extraction: PaperExtraction) -> Dict[str, Any]:
        prompt = build_prompt(extraction)
        if hasattr(self._tokenizer, "apply_chat_template"):
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a meticulous Korean academic editor. Use only the supplied evidence. "
                        "Do not invent claims, citations, or numbers. Return strict JSON only."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
            text = self._tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        else:
            text = prompt
        inputs = self._tokenizer([text], return_tensors="pt").to(self._model.device)
        with self._torch.inference_mode():
            output = self._model.generate(
                **inputs,
                max_new_tokens=self.max_new_tokens,
                temperature=self.temperature,
                do_sample=False,
            )
        prompt_length = inputs["input_ids"].shape[-1]
        decoded = self._tokenizer.decode(output[0][prompt_length:], skip_special_tokens=True)
        parsed = try_parse_json(decoded)
        if parsed is None:
            return build_heuristic_draft(extraction)
        return parsed


class LlamaCppBackend(BaseBackend):
    def __init__(self, model_path: str, max_new_tokens: int = 1400, temperature: float = 0.2):
        self.model_path = model_path
        self.max_new_tokens = max_new_tokens
        self.temperature = temperature
        try:
            from llama_cpp import Llama  # type: ignore
        except Exception as exc:  # pragma: no cover - optional dependency
            raise RuntimeError(
                "llama-cpp-python is required for the local GGUF backend. Install `pip install -e '.[dev,llm]'` first."
            ) from exc
        self._llama = Llama(
            model_path=model_path,
            n_ctx=8192,
            n_threads=max(4, (os.cpu_count() or 8) - 2),
            verbose=False,
        )

    def draft(self, extraction: PaperExtraction) -> Dict[str, Any]:
        prompt = build_prompt(extraction)
        response = self._llama(
            prompt,
            max_tokens=self.max_new_tokens,
            temperature=self.temperature,
            stop=["\n\n\n"],
        )
        text = response["choices"][0]["text"]
        parsed = try_parse_json(text)
        if parsed is None:
            return build_heuristic_draft(extraction)
        return parsed


class MlxBackend(BaseBackend):
    def __init__(self, model_name: str = DEFAULT_MODEL_NAME, max_new_tokens: int = 1400, temperature: float = 0.2):
        self.model_name = model_name
        self.max_new_tokens = max_new_tokens
        self.temperature = temperature
        try:
            from mlx_lm import generate, load  # type: ignore
        except Exception as exc:  # pragma: no cover - optional dependency
            raise RuntimeError(
                "mlx-lm is required for the MLX backend. Install it separately on Apple Silicon if you want MLX inference."
            ) from exc
        self._generate = generate
        self._model, self._tokenizer = load(model_name)

    def draft(self, extraction: PaperExtraction) -> Dict[str, Any]:
        prompt = build_prompt(extraction)
        text = self._generate(
            self._model,
            self._tokenizer,
            prompt=prompt,
            max_tokens=self.max_new_tokens,
            temp=self.temperature,
            verbose=False,
        )
        parsed = try_parse_json(text)
        if parsed is None:
            return build_heuristic_draft(extraction)
        return parsed


def build_prompt(extraction: PaperExtraction) -> str:
    payload = extraction.to_dict().copy()
    payload["pages"] = payload.get("pages", [])[:5]
    payload["source_sections"] = payload.get("source_sections", [])[:10]
    payload["figures"] = payload.get("figures", [])[:8]
    payload["featured_visuals"] = payload.get("featured_visuals", [])[:2]
    schema = {
        "title": "string",
        "one_line_summary": "string",
        "key_claims": [
            {
                "text": "string",
                "source_pages": [1, 2],
                "source_hint": "abstract",
            }
        ],
        "sections": [
            {
                "title": "초록|서론|본론|제안방법|실험|결론|논의",
                "body": "string",
                "bullets": ["string"],
                "source_pages": [1, 2],
            }
        ],
    }
    return (
        "You are a meticulous Korean academic editor.\n"
        "Use only the supplied evidence. Do not invent claims, citations, or numbers.\n"
        "Return strict JSON only.\n\n"
        "Evidence JSON:\n"
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + "\n\nRequired schema:\n"
        + json.dumps(schema, ensure_ascii=False, indent=2)
        + "\n\nGuidelines:\n"
        + "- Keep the order: 초록, 서론, 본론, 제안방법, 실험, 결론, 논의.\n"
        + "- Keep technical terms in English parentheses when helpful.\n"
        + "- If evidence is thin, say so instead of expanding.\n"
        + "- The summary must be faithful and concise.\n"
    )


def try_parse_json(text: str) -> Optional[Dict[str, Any]]:
    candidates = []
    stripped = text.strip()
    candidates.append(stripped)
    if "{" in stripped and "}" in stripped:
        candidates.append(stripped[stripped.find("{") : stripped.rfind("}") + 1])
    for candidate in candidates:
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return None


def build_heuristic_draft(extraction: PaperExtraction) -> Dict[str, Any]:
    abstract = extraction.abstract or ""
    key_claims = extract_key_claims(
        abstract,
        source_pages=[section.source_pages[0] if section.source_pages else 1 for section in extraction.source_sections[:1]] or [1],
    )
    sections: list[DraftSection] = []
    section_map = {section.title: section for section in extraction.source_sections}
    ordered_titles = ["초록", "서론", "본론", "제안방법", "실험", "결론", "논의"]
    for title in ordered_titles:
        source = section_map.get(title)
        if source is None:
            sections.append(
                DraftSection(
                    title=title,
                    body="원문에서 해당 섹션을 명확히 추출하지 못했다.",
                    bullets=[],
                    source_pages=[],
                )
            )
            continue
        rendered = summarize_section(source)
        rendered.title = title
        sections.append(rendered)
    return {
        "title": extraction.title,
        "one_line_summary": build_safe_summary_from_abstract(abstract),
        "key_claims": [claim.to_dict() for claim in key_claims],
        "sections": [section.to_dict() for section in sections],
    }


def _gguf_path_from_model_name(model_name: str) -> str:
    if model_name.lower().endswith(".gguf"):
        return model_name
    return ""


def _candidate_model_names(preferred: str) -> list[str]:
    candidates = [preferred] if preferred else [DEFAULT_MODEL_NAME]
    if FALLBACK_MODEL_NAME not in candidates:
        candidates.append(FALLBACK_MODEL_NAME)
    return candidates


def resolve_backend(config: LLMConfig) -> BaseBackend:
    if config.backend in {"heuristic", "mock", "rule", "rules"}:
        return HeuristicBackend()

    model_path = config.model_path or _gguf_path_from_model_name(config.model_name)
    candidate_models = _candidate_model_names(config.model_name)
    backend_order = []
    if config.backend in {"llama", "llama_cpp", "gguf"}:
        backend_order = ["llama"]
    elif config.backend == "mlx":
        backend_order = ["mlx", "transformers"]
    elif config.backend == "transformers":
        backend_order = ["transformers"]
    else:
        if model_path:
            backend_order.append("llama")
        backend_order.extend(["mlx", "transformers", "llama"])

    last_error: Exception | None = None
    for backend_name in backend_order:
        try:
            if backend_name == "llama":
                if not model_path:
                    continue
                return LlamaCppBackend(model_path=model_path, max_new_tokens=config.max_new_tokens, temperature=config.temperature)
            if backend_name == "mlx":
                for model_name in candidate_models:
                    try:
                        return MlxBackend(model_name=model_name, max_new_tokens=config.max_new_tokens, temperature=config.temperature)
                    except Exception as exc:
                        last_error = exc
                        continue
            if backend_name == "transformers":
                for model_name in candidate_models:
                    try:
                        return TransformersBackend(model_name=model_name, max_new_tokens=config.max_new_tokens, temperature=config.temperature)
                    except Exception as exc:
                        last_error = exc
                        continue
        except Exception as exc:
            last_error = exc
            continue

    if last_error is not None:
        return HeuristicBackend()
    return HeuristicBackend()
