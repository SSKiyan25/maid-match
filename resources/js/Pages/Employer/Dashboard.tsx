import { Head } from "@inertiajs/react";
import EmployerLayout from "../../Layouts/EmployerLayout";

export default function Dashboard() {
    return (
        <EmployerLayout>
            <Head title="Employer Dashboard" />
            <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center w-full">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to Employer Dashboard!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Your registration is complete and successful!
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                            This is the Employer Dashboard
                        </h2>
                        <p className="text-green-700 dark:text-green-300">
                            More features and functionality will be added here
                            later.
                        </p>
                    </div>
                </div>
            </div>
        </EmployerLayout>
    );
}
