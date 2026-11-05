"""Put a cover on the first frame of the README video.

GitHub's player shows the video's first frame until someone presses Play, and the
scene's first frame is an empty chat. This script takes the frame where the page
shows its interface sketch (a phone with the price banner open) and makes it the
video's frame 0. Playback starts on frame 1, so the story itself runs from the very
beginning, unchanged.

The cover is the frame as it is, with no title and no play button: the README's
heading sits right above the video, and Safari draws its own play button.

    python3 cover.py rendered.mp4 decision-page-demo.mp4

Needs ffmpeg on PATH. The frame time below depends on the scene's timings: after
changing them, check that the frame at FRAME_AT shows the banner open and the
cursor clear of it (the scene marks that moment as 'cover').
"""

import subprocess
import sys
import tempfile
from pathlib import Path

FRAME_AT = 25.3  # seconds into the rendered video


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    with tempfile.TemporaryDirectory() as tmp:
        cover_png = Path(tmp, "cover.png")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-ss", str(FRAME_AT), "-i", src, "-frames:v", "1", "-update", "1", cover_png],
            check=True,
        )
        # The cover is frame 0 only; the rendered video follows from its own frame 0
        graph = (
            "[0:v]fps=60,format=yuv420p,setsar=1,settb=1/60,trim=end_frame=1[a];"
            "[1:v]fps=60,format=yuv420p,setsar=1,settb=1/60[b];"
            "[a][b]concat=n=2:v=1:a=0[v]"
        )
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "60", "-t", "0.0167", "-i", cover_png,
             "-i", src, "-filter_complex", graph, "-map", "[v]",
             "-c:v", "libx264", "-profile:v", "high", "-crf", "18", "-preset", "slow", "-r", "60",
             "-force_key_frames", "0,0.0167", "-movflags", "+faststart", dst],
            check=True,
        )
    print(dst)


if __name__ == "__main__":
    main()
