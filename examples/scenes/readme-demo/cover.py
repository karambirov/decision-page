"""Put a cover on the first frame of the README video.

GitHub's player shows the video's first frame until someone presses Play, and the
scene's first frame is an empty chat. This script takes a frame from the rendered
video where the page is open (the price switcher on $15, the bars settled), puts a
title above it, and makes that the video's frame 0. Playback
starts on frame 1, so the story itself runs from the very beginning, unchanged.

The cover has no play button of its own: Safari draws one in the middle of the
video, and a second one under it looks like a mistake.

    python3 cover.py rendered.mp4 decision-page-demo.mp4

Needs ffmpeg on PATH, Pillow, and macOS for the SF Pro font. The frame time below
depends on the scene's timings: after changing them, check that the frame at FRAME_AT
still shows $15 picked and the bars settled, just before the page scrolls.
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FRAME_AT = 9.9  # seconds into the rendered video
TITLE = "See one question turn into a page"
GROUND = (215, 219, 224)  # the stage's own background
INK = (20, 20, 19)
FONT = "/System/Library/Fonts/SFNS.ttf"


def font(size: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_name("Bold")
    except (OSError, ValueError):
        pass
    return f


def cover(frame: Image.Image) -> Image.Image:
    w, h = frame.size
    img = Image.new("RGB", (w, h), GROUND)
    shot = frame.resize((round(w * 0.8), round(h * 0.8)), Image.LANCZOS)
    top = 200
    img.paste(shot, ((w - shot.width) // 2, top))
    d = ImageDraw.Draw(img)
    f = font(76)
    d.text(((w - d.textlength(TITLE, font=f)) / 2, 82), TITLE, font=f, fill=INK)
    return img


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    with tempfile.TemporaryDirectory() as tmp:
        frame_png = Path(tmp, "frame.png")
        cover_png = Path(tmp, "cover.png")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-ss", str(FRAME_AT), "-i", src, "-frames:v", "1", "-update", "1", frame_png],
            check=True,
        )
        cover(Image.open(frame_png).convert("RGB")).save(cover_png)
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
