import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            start your 14-day free trial
                        </a>
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/kanban" })
                        }}
                        className="w-full"
                    >
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
