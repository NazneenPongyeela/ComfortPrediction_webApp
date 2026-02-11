from __future__ import annotations

import numpy as np
import neurokit2 as nk

def extract_eda_features(
    eda_signal: list[float],
    sampling_rate: int,
    min_samples: int | None = None,
) -> dict:
    if sampling_rate <= 0:
        raise ValueError("eda_sampling_rate must be > 0")

    if min_samples is None:
        min_samples = max(30 * sampling_rate, 30)

    if len(eda_signal) < min_samples:
        raise ValueError(
            "ต้องส่ง eda_signal และ rr_intervals_ms เป็น series ไม่ใช่ค่าเดียว"
        )

    eda_array = np.asarray(eda_signal, dtype=float)
    eda_clean = nk.eda_clean(eda_array, sampling_rate=sampling_rate)
    eda_decomp = nk.eda_phasic(eda_clean, sampling_rate=sampling_rate)

    tonic = float(np.nanmean(eda_decomp["EDA_Tonic"]))
    phasic = float(np.nanmean(eda_decomp["EDA_Phasic"]))

    return {
        "EDA_Tonic_B": tonic,
        "EDA_Phasic_B": phasic,
    }
