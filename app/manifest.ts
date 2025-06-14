import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Planify",
        short_name: "Planify",
        start_url: "/",
        description: "Planify is a simple and easy app that helps you organize your life.",
        display: "standalone",
        theme_color: "#303236",
        background_color: "#303236",
        icons: [
            {
                src: "/logo.png",
                sizes: "64x64 32x32 24x24 16x16",
                type: "image/png",
                purpose:"any"
            },
            {
                src: "/logo2.png",
                sizes: "144x144",
                type: "image/png",
                purpose:"any"
            }
        ],
    }
}