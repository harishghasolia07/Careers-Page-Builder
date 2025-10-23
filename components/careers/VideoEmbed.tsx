interface VideoEmbedProps {
  videoUrl: string;
}

export function VideoEmbed({ videoUrl }: VideoEmbedProps) {
  if (!videoUrl) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
      return url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
