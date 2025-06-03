import librosa
import sys

song = sys.argv[1]

stream = librosa.stream(song, block_length=256, frame_length=2048, hop_length=512)

beat_times = []
total_time = 0

for chunk in stream:
    resampled_chunk = librosa.resample(chunk, orig_sr=44100, target_sr=22050, res_type='soxr_hq')
    tempo, beat_frames = librosa.beat.beat_track(y=resampled_chunk, sr=22050)
    adjusted_beat_times = librosa.frames_to_time(beat_frames, sr=22050) + total_time
    beat_times.extend(adjusted_beat_times)
    chunk_duration = librosa.get_duration(y=resampled_chunk, sr=22050)
    total_time += chunk_duration

for beat in beat_times:
    print(beat)

sys.stdout.flush()
