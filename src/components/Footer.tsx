"use client"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="py-8 px-4 border-t border-indigo-500/30">
            <div className="max-w-6xl mx-auto text-center">
                <p className="text-gray-400 text-lg">
                    © {currentYear}{" "}

                    <a
                        href="https://github.com/adam1618x/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="professional-highlight hover:opacity-80 transition-opacity"
                    >
                        Mohamed Adam Jemal
                    </a>
                    . Based on open source work by{" "}
                    <a
                        href="https://github.com/RayenSahmim/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="professional-highlight hover:opacity-80 transition-opacity"
                    >
                        Rayen Sahmim
                    </a>
                    .
                </p>
            </div>
        </footer>
    )
}