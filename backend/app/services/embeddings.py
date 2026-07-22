import numpy as np

_model = None
_skill_embedding_cache: dict[str, np.ndarray] = {}

MODEL_NAME = "all-MiniLM-L6-v2"


def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(MODEL_NAME)
    return _model


def embed(text: str) -> np.ndarray:
    key = text.strip().lower()
    cached = _skill_embedding_cache.get(key)
    if cached is not None:
        return cached

    vector = _get_model().encode(key, normalize_embeddings=True)
    _skill_embedding_cache[key] = vector
    return vector


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))
