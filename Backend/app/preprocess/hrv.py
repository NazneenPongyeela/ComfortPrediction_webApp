from __future__ import annotations

import numpy as np
from scipy import signal
from scipy.interpolate import interp1d

def extract_hrv_features(
    rr_intervals_ms: list[float],
    min_count: int = 10,
    resample_rate_hz: float = 4.0,
) -> dict:
    if len(rr_intervals_ms) < min_count:
        raise ValueError(
            "ต้องส่ง eda_signal และ rr_intervals_ms เป็น series ไม่ใช่ค่าเดียว"
        )

    rr_intervals = np.asarray(rr_intervals_ms, dtype=float) / 1000.0
    if np.any(rr_intervals <= 0):
        raise ValueError("rr_intervals_ms must be positive values")

    time = np.cumsum(rr_intervals)
    time -= time[0]

    if len(time) < 4:
        raise ValueError("rr_intervals_ms must contain enough samples")

    interp_kind = "cubic" if len(time) >= 4 else "linear"
    interpolator = interp1d(time, rr_intervals, kind=interp_kind, fill_value="extrapolate")

    resample_time = np.arange(time[0], time[-1], 1.0 / resample_rate_hz)
    rr_resampled = interpolator(resample_time)
    rr_resampled = signal.detrend(rr_resampled)

    freqs, psd = signal.welch(
        rr_resampled,
        fs=resample_rate_hz,
        nperseg=min(256, len(rr_resampled)),
        scaling="density",
    )

    lf_mask = (freqs >= 0.04) & (freqs < 0.15)
    hf_mask = (freqs >= 0.15) & (freqs <= 0.4)

    lf_power = float(np.trapezoid(psd[lf_mask], freqs[lf_mask]))
    hf_power = float(np.trapezoid(psd[hf_mask], freqs[hf_mask]))

    total_power = lf_power + hf_power
    if total_power == 0:
        raise ValueError("HRV power bands are zero")

    hf_n = hf_power / total_power
    lf_n = lf_power / total_power
    lf_hf_ratio = lf_power / hf_power if hf_power > 0 else 0.0

    return {
        "HF_n_ECG_B": float(hf_n),
        "LF_n_ECG_B": float(lf_n),
        "LFHF_ratio_ECG_B": float(lf_hf_ratio),
    }