import { Play, Video } from "lucide-react";

export interface VideoPlaceholderData {
  videoTitle: string;
  presenter?: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  note?: string;
}

interface VideoPlaceholderSlideProps {
  title?: string;
  data: VideoPlaceholderData;
}

export function VideoPlaceholderSlide({ title, data }: VideoPlaceholderSlideProps) {
  const hasYoutube = !!data.youtubeId;

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-black text-primary mb-4">{title}</h2>}

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {/* Video area */}
        {hasYoutube ? (
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${data.youtubeId}`}
              title={data.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="relative w-full flex items-center justify-center bg-gradient-to-br from-muted/60 to-muted/20"
            style={{
              minHeight: 220,
              backgroundImage: data.thumbnailUrl ? `url(${data.thumbnailUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Play className="w-7 h-7 text-primary fill-primary ml-1" />
              </div>
              <div className="text-center px-4">
                <p className="text-white font-bold text-lg">{data.videoTitle}</p>
                {data.presenter && (
                  <p className="text-white/70 text-sm mt-1">com {data.presenter}</p>
                )}
                {data.duration && (
                  <p className="text-white/50 text-xs mt-0.5">{data.duration}</p>
                )}
              </div>
              {data.note && (
                <div className="bg-primary/20 border border-primary/40 rounded-lg px-4 py-2 mx-4 text-center">
                  <p className="text-primary text-xs font-medium">{data.note}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info below video */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-bold text-foreground text-sm">{data.videoTitle}</span>
          </div>
          {data.presenter && !hasYoutube && (
            <p className="text-xs text-muted-foreground">Apresentado por: <strong className="text-foreground">{data.presenter}</strong></p>
          )}
          {data.description && (
            <p className="text-sm text-foreground/80 leading-relaxed">{data.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function parseVideoContent(content: string): VideoPlaceholderData {
  try {
    return JSON.parse(content);
  } catch {
    return { videoTitle: content };
  }
}
