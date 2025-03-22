"use client";

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
    streamUrl: string;
    width?: string | number;
    height?: string | number;
    className?: string;
}

const VideoPlayer = ({
    streamUrl,
    width = "100%",
    height = "auto",
    className = ""
}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Function to handle loading the video
        const loadVideo = () => {
            if (Hls.isSupported()) {
                // Use hls.js if supported
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(error => {
                        console.error("Autoplay prevented:", error);
                    });
                });

                // Error handling
                hls.on(Hls.Events.ERROR, (_, data) => {
                    console.error("HLS error:", data);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });

                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari which has native HLS support
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(error => {
                        console.error("Autoplay prevented:", error);
                    });
                });
            } else {
                console.error("HLS is not supported in this browser");
            }
        };

        loadVideo();
    }, [streamUrl]);

    return (
        <div className={`relative ${className}`}>
            <video
                ref={videoRef}
                controls
                width={width}
                height={height}
                className="w-full h-full object-contain"
                playsInline
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;