import React from "react";
import Link from "next/link";

/**
 * BreadCrumbs Component displays a breadcrumb navigation bar.
 * @param {Object[]} breadCrumbs - An array of breadcrumb objects containing name and URL.
 * @returns {JSX.Element} - Rendered component with breadcrumb navigation.
 */

const BreadCrumbs = ({ breadCrumbs }) => {
    return (
        <section className="py-3 sm:py-5 bg-slate-900">
            <div className="container max-w-screen-xl mx-auto px-4">
                {/* Breadcrumb navigation list */}
                <ol className="inline-flex flex-wrap text-yellow-400 space-x-1 md:space-x-3 items-center font-bold">
                    {breadCrumbs?.map((breadCrumb, index) => (
                        <li key={breadCrumb.url || index} className="inline-flex items-center">
                            {/* Breadcrumb link */}
                            <Link
                                href={breadCrumb.url}
                                className="text-yellow-400 hover:text-yellow-600"
                            >
                                {breadCrumb.name}
                            </Link>
                            {/* Chevron icon for separation */}
                            {breadCrumbs?.length - 1 !== index && (
                                <i className="ml-3 text-yellow-400 fa fa-chevron-right"></i>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default BreadCrumbs;