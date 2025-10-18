import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Sign up for Planify today and take your productivity to the next
          level.
        </p>
        <Button
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
        >
          Sign Up
        </Button>
      </div>
    </section>
  );
}
