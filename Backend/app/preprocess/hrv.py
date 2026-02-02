def normalize(value, min_val, max_val):
    return (value - min_val) / (max_val - min_val)


def preprocess_hrv(hrv_raw: float) -> dict:
    hrv_norm = normalize(hrv_raw, 0, 100)

    lf = hrv_norm * 0.6
    hf = hrv_norm * 0.4

    raw_ratio = lf / hf if hf != 0 else 0

    # normalize ratio → 0–1
    ratio_norm = normalize(raw_ratio, min_val=0.5, max_val=4.0)
    ratio_norm = max(0, min(1, ratio_norm))  # clamp

    return {
        "lf": round(lf, 4),
        "hf": round(hf, 4),
        "lfhf_ratio": round(ratio_norm, 4)
    }