import { StreamVideoProvider } from "@/components/provider/stream-provider";
import "@stream-io/video-react-sdk/dist/css/styles.css";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StreamVideoProvider>
            <div className="h-screen flex flex-col justify-center items-center gap-3 w-full">
                {children}
            </div>
        </StreamVideoProvider>
    )
}   