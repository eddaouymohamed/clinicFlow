const Pagination = ({ page, totalPages, onPageChange }) => {
    if (!totalPages || totalPages <= 1) {
        return null;
    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Précédent
            </button>

            {pages.map((pageNumber) => (
                <button
                    key={pageNumber}
                    type="button"
                    onClick={() => onPageChange(pageNumber)}
                    className={`rounded-lg px-4 py-2 text-sm ${pageNumber === page
                            ? "bg-blue-500 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Suivant
            </button>
        </div>
    );
};

export default Pagination;