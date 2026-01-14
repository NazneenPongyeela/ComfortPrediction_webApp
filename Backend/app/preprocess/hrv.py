def normalize(value, min_val, max_val):
    return (value - min_val) / (max_val - min_val)


def preprocess_hrv(hrv_raw: float) -> dict:
    """
    Normalize HRV + derive LF/HF
    """

    hrv_norm = normalize(hrv_raw, min_val=0, max_val=100)

    lf = hrv_norm * 0.6
    hf = hrv_norm * 0.4
    lf_hf_ratio = lf / hf if hf != 0 else 0

    return {
        "lf": round(lf, 4),
        "hf": round(hf, 4),
        "lfhf_ratio": round(lf_hf_ratio, 4)
    }
