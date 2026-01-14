def normalize(value, min_val, max_val):
    return (value - min_val) / (max_val - min_val)


def preprocess_eda(eda_raw: float) -> dict:
    """
    แปลง EDA raw → tonic / phasic (normalized 0-1)
    """

    # example range (คุณควรกำหนดจาก dataset จริง)
    eda_norm = normalize(eda_raw, min_val=0, max_val=50)

    eda_tonic = eda_norm * 0.7
    eda_phasic = eda_norm * 0.3

    return {
        "eda_tonic": round(eda_tonic, 4),
        "eda_phasic": round(eda_phasic, 4)
    }
