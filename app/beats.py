import librosa
import sys

song = sys.argv[1]

y, sr = librosa.load(song)

tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

beat_times = librosa.frames_to_time(beat_frames, sr=sr)

for beat in beat_times:
    print(beat)
sys.stdout.flush()
